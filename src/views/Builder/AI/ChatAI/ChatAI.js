import React, { useState, useEffect, useRef } from 'react';
import chatAILogo from '../../../../assets/images/chatAILogo.png';
import '../../../../css/Builder/AI/ChatAI/ChatAI.css';

import {
  sendMessageToAiChat
} from '../../../api';
import { subscribeToChatChannel } from '../../../actionCable';

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


  const handleMessageReceived = (data) => {
    // Assume data contains { type: 'ai', text: 'Response text from AI' }
    setMessages(messages => {
        const newMessages = [...messages];

        // Check if the last message is a loading message
        if (newMessages.length && newMessages[newMessages.length - 1].loading && data.text !== '...') {
            newMessages.pop(); // Remove the 'loading...' message
        }

        // Determine if the incoming message is a 'loading' message
        const isLoading = data.message === '...';

        // Prevent adding the incoming message if it's identical to the last message in the array
        if (newMessages.length && newMessages[newMessages.length - 1].text === data.message) {
            return newMessages; // Simply return the current messages without adding the new one
        }

        newMessages.push({ type: 'ai', text: data.message, loading: isLoading });
        return newMessages;
    });
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}


    useEffect(() => {
        let unsubscribe = () => {};

        if (selectedWorkspace) {
            unsubscribe = subscribeToChatChannel(selectedWorkspace.id, handleMessageReceived);
        }

        return () => {
            unsubscribe();
        };
    }, [selectedWorkspace]);

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
    // Add the user's message to the messages display
    const userMessage = { type: 'user', text: input };
    setMessages(messages => [...messages, userMessage]);

    // Clear input and reset textarea height
    setInputValue('');
    resetTextAreaHeight();

    try {
      // Send the message to the server without waiting for a direct response
      await sendMessageToAiChat(selectedWorkspace.id, input);
      // Assume sendMessageToAiChat handles the logic of sending messages and dealing with errors

      // Add a temporary "sending..." message that will be replaced by the socket response
      setMessages(messages => [...messages, { type: 'ai', text: 'Enviando...', loading: true }]);

      // Debugging: log message sent to console
      console.log("Mensaje enviado:", input);
    } catch (error) {
      console.error("Error al enviar mensaje: ", error);

      // Depending on the error status code, provide a user-friendly error message
      if (error.response && error.response.status === 422) {
        // For 422 errors, you might not want to display any error message at all
        // or you might want to log these silently without alerting the user
        console.log("Validation error: ", error.response.data);
      } else {
        // For other types of errors, provide a generic error message
        setMessages(messages => [...messages, { type: 'ai', text: 'Error al procesar su mensaje.' }]);
      }
    }

    // Update the last message sent
    setLastSentMessage(input);

    // Stop voice recognition if active
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

  const renderMessageContent = (message) => {
    let messageClass = '';
    switch (message.type) {
      case 'ai':
        if (message.loading) {
          // Renderiza el mensaje con la animación de cargando
          return <span className="loading-animation"></span>;
        }
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
