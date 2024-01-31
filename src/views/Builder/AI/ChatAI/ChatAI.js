import React, { useState, useEffect, useRef } from 'react';
import chatAILogo from '../../../../assets/images/chatAILogo.png';
import '../../../../css/Builder/AI/ChatAI/ChatAI.css';

import {
  sendMessageToAiChat
} from '../../../api';

function ChatAI({ selectedWorkspace, className, setForceWorkspaceUpdate }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  const speechSynthesisUtterance = new window.SpeechSynthesisUtterance();
  const recognition = useRef(null); 
 const [lastSentMessage, setLastSentMessage] = useState(""); // Estado para almacenar el último mensaje enviado
const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
const [showCode, setShowCode] = useState(false); // Estado para mostrar/ocultar el código JSON
  const [jsonCode, setJsonCode] = useState(null);


  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.onresult = (event) => {
        let lastResult = event.results[event.results.length - 1];
        if (lastResult[0].transcript !== lastSentMessage) { // Solo actualiza si es diferente al último mensaje enviado
          setInputValue(lastResult[0].transcript);
          adjustTextAreaHeightDirectly(lastResult[0].transcript);
        }
      };
      recognition.current.onend = () => setIsListening(false);
      recognition.current.onerror = (event) => {
        if (event.error === 'not-allowed') {
          alert("No se tiene permiso para usar el micrófono.");
        }
      };
    } else {
      console.error("Reconocimiento de voz no disponible.");
    }
  }, []);

    
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleAudio = () => {
  if (!isAudioEnabled) {
    setIsAudioEnabled(true);
  } else {
    // Si el sonido está activado y la síntesis de voz está hablando, detiene la síntesis de voz
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsAudioEnabled(false);
  }
};


  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isMinimized, messages]);

  const handleUserInput = async (event) => {
  const input = event.target.value;
  if (event.key === 'Enter' && input.trim() !== '') {
    // Agrega el mensaje del usuario a los mensajes
    const userMessage = { type: 'user', text: input };
    setMessages(messages => [...messages, userMessage]);

    // Agrega un mensaje temporal de "enviando..."
    const sendingMessage = { type: 'ai', text: '...' };
    setMessages(messages => [...messages, sendingMessage]);

    // Limpia el input y resetea la altura del textarea
    setInputValue('');
    resetTextAreaHeight();
    setIsWaitingForResponse(true);

    try {
      // Envía el mensaje al servidor y obtiene la respuesta
      const aiResponse = await sendMessageToAiChat(selectedWorkspace.id, input);

      // Imprime en consola la respuesta completa para depuración
      console.log("Respuesta completa de AI:", aiResponse);

      // Reemplaza el mensaje de "enviando..." con la respuesta de la AI
      setMessages(messages => {
        const newMessages = [...messages];
        newMessages.splice(-1, 1);


        // Intenta parsear el JSON dentro de la respuesta
        try {
           

          // Añade explicaciones como mensajes individuales
          if (aiResponse.response && aiResponse.response.explanation) {
            aiResponse.response.explanation.forEach(exp => {
              newMessages.push({ type: 'ai', text: exp });
            });
          }

          // Añade las preguntas como mensajes individuales
          if (aiResponse.response && aiResponse.response.questions) {
            aiResponse.response.questions.forEach(qst => {
              newMessages.push({ type: 'ai', text: qst });
            });
          }

          // 'code.instructions' no se utiliza, por lo que se ignora

          return newMessages;

        } catch (jsonParseError) {
          console.error("Error al parsear la respuesta JSON: ", jsonParseError);
          newMessages.push({ type: 'ai', text: "Error al procesar la respuesta" });
        }

        return newMessages;
      });

      // Habla la respuesta de la AI
      if (isAudioEnabled) {
        //speak(aiResponse.text);
      }

      setForceWorkspaceUpdate(prev => prev + 1);
    } catch (error) {
      console.error("Error al enviar mensaje: ", error);
      // Manejo de error
      setMessages(messages => [...messages, { type: 'ai', text: 'Error al enviar mensaje.' }]);
    } finally {
      setIsWaitingForResponse(false); // Vuelve a habilitar el input después de recibir la respuesta
    }

    // Actualiza el último mensaje enviado
    setLastSentMessage(input);

    // Detiene el reconocimiento de voz si está activo
    if (isListening && recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  }
};


const adjustTextAreaHeight = (event) => {
  event.target.style.height = 'auto';
  event.target.style.height = event.target.scrollHeight + 'px';
};

const adjustTextAreaHeightDirectly = (text) => {
  if (inputRef.current) {
    inputRef.current.value = text; // Establece temporalmente el valor para medir el scrollHeight
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
  }
};

const resetTextAreaHeight = () => {
  inputRef.current.style.height = 'auto';
};


  const handleVoiceButtonClick = () => {
  	if ('webkitSpeechRecognition' in window) {
    if (recognition.current) {
      if (isListening) {
        recognition.current.stop();
      } else {
        recognition.current.start();
      }
    }
    setIsListening(!isListening);
    } else {
    	 alert("El reconocimiento de voz no está disponible en este navegador. Considera usar Google Chrome o habilita la función si está desactivada.");
    }
  };

  const speak = (text) => {
    if (isAudioEnabled) {
      speechSynthesisUtterance.text = text;
      window.speechSynthesis.speak(speechSynthesisUtterance);
    }
  };

  const mockAIResponse = (input) => {
  // Supongamos que la AI puede responder de manera diferente según algunas palabras clave
  if (input.toLowerCase().includes("hola")) {
    return { type: 'ai', text: '¡Hola! ¿Cómo puedo ayudarte hoy?' };
  } else if (input.toLowerCase().includes("ayuda")) {
    return { type: 'ai', text: 'Claro, dime en qué puedo asistirte.' };
  } else if (input.toLowerCase().includes("opciones")) {
    return { 
      type: 'ai-selection', 
      text: 'Puedes elegir entre estas opciones:', 
      options: ['Opción 1', 'Opción 2', 'Opción 3'] 
    };
  } else if (input.toLowerCase().includes("despedida")) {
    return { type: 'ai', text: 'Ha sido un placer ayudarte. ¡Hasta luego!' };
  } else {
    // Respuesta por defecto para entradas no reconocidas
    return { type: 'ai', text: 'Lo siento, no entendí eso. ¿Puedes ser más específico?' };
  }
};


  const renderMessageContent = (message) => {
    let messageClass = '';
    switch (message.type) {
      case 'ai':
        return <span>{message.text}</span>;
      case 'ai-code':
        return showCode ? <pre>{JSON.stringify(message.json, null, 2)}</pre> : <button onClick={() => setShowCode(true)}>Mostrar Código</button>;
      case 'user':
        messageClass = 'user-message';  // Clase para mensajes del usuario
        break;
      // ... otros casos
    }

    return (
      <div className={`message-content ${messageClass}`}>
        <span>{message.text}</span>
      </div>
    );
  };

  return isMinimized ? (
     <button className={`chat-ai minimized ${className}`} onClick={() => setIsMinimized(false)}>
      <img src={chatAILogo} alt="Chat AI logo" className="robot-icon" />
    </button>
  ) : (
    <div className={`chat-ai ${className}`}>
      <div className="chat-header">
      <button onClick={toggleAudio} className="audio-toggle-button">
          {isAudioEnabled 
            ? <i className="bi bi-volume-up"></i>  // Ícono de audio activado
            : <i className="bi bi-volume-mute"></i> // Ícono de audio desactivado
          }
        </button>
        <img src={chatAILogo} alt="Chat AI logo" className="robot-icon" />
        &nbsp;
        Chat AI
        <button className="minimize-button" onClick={() => setIsMinimized(true)}>–</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {renderMessageContent(msg)}
          </div>
        ))}
        {/* Botón y visualización del código JSON */}
        {jsonCode && (
          <>
            <button onClick={() => setShowCode(!showCode)}>
              {showCode ? 'Ocultar Código' : 'Mostrar Código'}
            </button>
            {showCode && (
              <div className="message ai-code">
                <pre>{JSON.stringify(jsonCode, null, 2)}</pre>
              </div>
            )}
          </>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input">
        <textarea
          ref={inputRef}
          className="chat-input-area"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleUserInput}
          onInput={adjustTextAreaHeight}
          disabled={isWaitingForResponse}  // Deshabilita el textarea si se está esperando respuesta
        />

    <button className="voice-button" onClick={handleVoiceButtonClick}>
      {isListening ? 'Stop' : '🎤'}
    </button>
      </div>
    </div>
  );
}

export default ChatAI;
