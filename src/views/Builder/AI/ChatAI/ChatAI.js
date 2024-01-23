import React, { useState, useEffect, useRef } from 'react';
import chatAILogo from '../../../../assets/images/chatAILogo.png';
import '../../../../css/Builder/AI/ChatAI/ChatAI.css';

function ChatAI({ className }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  const speechSynthesisUtterance = new window.SpeechSynthesisUtterance();
  const recognition = useRef(null); 
 const [lastSentMessage, setLastSentMessage] = useState(""); // Estado para almacenar el último mensaje enviado


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

  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [isMinimized]);

  const handleUserInput = (event) => {
  const input = event.target.value;
  if (event.key === 'Enter' && input.trim() !== '') {
    // Agrega el mensaje del usuario a los mensajes
    const userMessage = { type: 'user', text: input };
    setMessages(messages => [...messages, userMessage]);

    // Actualiza el último mensaje enviado
    setLastSentMessage(input);

    // Genera una respuesta de la AI
    const aiResponse = mockAIResponse(input);
    setMessages(messages => [...messages, aiResponse]);

    // Habla la respuesta de la AI
    speak(aiResponse.text);

    // Detiene el reconocimiento de voz si está activo
    if (isListening && recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }

    // Limpia el input después de un breve retraso
    setTimeout(() => {
      setInputValue('');
      resetTextAreaHeight();
    }, 500);
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
    speechSynthesisUtterance.text = text;
    window.speechSynthesis.speak(speechSynthesisUtterance);
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


  // Renderiza el contenido del mensaje basado en el tipo
  const renderMessageContent = (message) => {
    switch (message.type) {
      case 'ai-selection':
        // Renderiza un mensaje con opciones de selección
        return (
          <div>
            {message.text}
            {message.options.map((option, idx) => (
              <button key={idx}>{option}</button>
            ))}
          </div>
        );
      case 'ai':
        // Renderiza un mensaje normal de la AI
        return <span>{message.text}</span>;
      default:
        // Renderiza un mensaje del usuario
        return <span>{message.text}</span>;
    }
  };

  return isMinimized ? (
     <button className={`chat-ai minimized ${className}`} onClick={() => setIsMinimized(false)}>
      <img src={chatAILogo} alt="Chat AI logo" className="robot-icon" />
    </button>
  ) : (
    <div className={`chat-ai ${className}`}>
      <div className="chat-header">
        <img src={chatAILogo} alt="Chat AI logo" className="robot-icon" />
        Chat AI
        <button className="minimize-button" onClick={() => setIsMinimized(true)}>–</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {renderMessageContent(msg)}
          </div>
        ))}
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
  />
    <button className="voice-button" onClick={handleVoiceButtonClick}>
      {isListening ? 'Stop' : '🎤'}
    </button>
      </div>
    </div>
  );
}

export default ChatAI;
