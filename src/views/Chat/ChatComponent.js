import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import '../../css/Chat/ChatComponent.css';
import { sendMessageToChat } from '../../services/api';
import { subscribeToChatChannel } from '../../services/actionCable';
import chatAILogo from '../../assets/images/chatAILogo.png';

const getUserId = () => localStorage.getItem('user_id');

const ChatComponent = ({ chatId, canWrite = false }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const timeoutRef = useRef(null);
  const endOfMessagesRef = useRef(null); 
  const userId = getUserId();

  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
    }
  }, [messages, isMinimized]);

  useEffect(() => {
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => {
      setIsConnected(false);
      setMessages(prevMessages => [...prevMessages, { text: "Conectando...", type: "received" }]);
    };

    const handleReceivedMessage = (data) => {
      const message = JSON.parse(data.message);
      const messageType = message.user_id === 0 ? 'received' : 'sent';
      const receivedMessage = {
          id: message.id,
          text: message.body,
          type: messageType
      };

      // Remove "..." and disable effects when new message received
      if (receivedMessage.text === "...") {
        setInputDisabled(true);
        clearTimeout(timeoutRef.current);  // Clear any existing timer
        timeoutRef.current = setTimeout(() => setInputDisabled(false), 60000);  // Set new timer
      } else {
        setInputDisabled(false);  // Re-enable input if new message is not "..."
        clearTimeout(timeoutRef.current);  // Clear timer as new valid message received
      }

      setMessages(prevMessages => [...prevMessages.filter(msg => msg.text !== "..."), receivedMessage]);
    };

    const unsubscribe = subscribeToChatChannel(chatId, handleReceivedMessage, handleConnected, handleDisconnected);
    return () => {
      unsubscribe();
      clearTimeout(timeoutRef.current);  // Ensure timer is cleared when component unmounts
    };
  }, [chatId, userId]);

  const scrollToBottom = useCallback(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        const newMessage = await sendMessageToChat(chatId, message);
        setMessage('');
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const toggleChat = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="chat-container">
      <div className="chat-header" onClick={toggleChat}>
        <span>
          <img src={chatAILogo} alt="Chat AI logo" className="robot-icon" />
          -AI Builder
        </span>
        <button className="toggle-chat-btn">
          {isMinimized ? <i className="bi bi-plus"></i> : <i className="bi bi-dash"></i>}
        </button>
      </div>
      {!isMinimized && (
        <>
          <ListGroup className="message-list">
            {messages.map((msg, index) => (
              <ListGroup.Item 
                key={index} 
                className={`message ${msg.type} ${msg.text === "..." && msg.type === 'received' ? 'blinking' : ''}`}>
                {msg.text}
              </ListGroup.Item>
            ))}
            <div ref={endOfMessagesRef} />
          </ListGroup>
          <Form onSubmit={sendMessage} className="message-form">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={(canWrite && isConnected && !inputDisabled) ? "Escribe un mensaje..." : "..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!canWrite || !isConnected || inputDisabled}
              />
              <Button variant="primary" type="submit" disabled={!canWrite || !isConnected || inputDisabled}>Send</Button>
            </InputGroup>
          </Form>
        </>
      )}
    </div>
  );
};

export default ChatComponent;
