import React, { useState, useEffect, useRef } from 'react';
import chatAILogo from '../../../../assets/images/chatAILogo.png';
import '../../../../css/Builder/AI/ChatAI/ChatAI.css';


function ChatAI({ className }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatHeight, setChatHeight] = useState('300px'); // Estado inicial para la altura del chat
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUserInput = (event) => {
    const input = event.target.value;
    if (event.key === 'Enter' && input.trim() !== '') {
      // Código para manejar la entrada del usuario
      const userMessage = { type: 'user', text: input };
      setMessages(messages => [...messages, userMessage]);

      // Aquí simulas una respuesta de la AI
      const aiResponse = mockAIResponse(input);
      setMessages(messages => [...messages, aiResponse]);

      setInputValue(''); // Limpia el input después de enviar
    }
  };

  // Esta función simula diferentes tipos de respuestas de la AI
  const mockAIResponse = (input) => {
    // Lógica de simulación basada en la entrada 'input'
    return { type: 'ai', text: 'Respuesta de la AI...' };
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
    <button className={`chat-ai-button minimized ${className}`} onClick={() => setIsMinimized(false)}>
      <img src={chatAILogo} alt="Chat AI logo" className="robot-icon" />
    </button>
  ) : (
    <div className={`chat-ai ${className}`} style={{ height: chatHeight }}>
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
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleUserInput}
        />
        <button className="voice-button"><i className="bi bi-house-door"></i></button>
      </div>
      {/* Agrega un controlador para cambiar el tamaño del chat */}
      <div 
        className="resize-handle" 
        onMouseDown={(e) => {
          // Implementa la lógica para redimensionar el chat aquí
        }}
      />
    </div>
  );
}

export default ChatAI;
