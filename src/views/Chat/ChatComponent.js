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
  const [isTyping, setIsTyping] = useState(false);
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
    const messageData = JSON.parse(data.message);
    const messageType = messageData.user_id === 0 ? 'received' : 'sent';

    // Clear any ongoing typing effects and enable input when a new message is received
    if (messageType === 'received') {
        setInputDisabled(false);
        clearTimeout(timeoutRef.current);

        if (messageData.body === "...") {
            // Update or add the '...' message with blinking effect
            setMessages(prevMessages => {
                const otherMessages = prevMessages.filter(msg => msg.text !== "...");
                otherMessages.push({ id: messageData.id, text: messageData.body, type: messageType, loading: true });
                return otherMessages;
            });
            setInputDisabled(true);
            timeoutRef.current = setTimeout(() => setInputDisabled(false), 60000);
        } else {
            // Apply typing effect only for non-"..." received messages and remove any "..."
            simulateTypingEffect(messageData.body, messageData.user_id);
        }
    } else {
        // For sent messages, add them directly without typing effect
        setMessages(prevMessages => [
            ...prevMessages.filter(msg => msg.text !== "..."),
            { id: messageData.id, text: messageData.body, type: messageType, loading: false }
        ]);
    }
};
const simulateTypingEffect = (fullText, userId) => {
    let i = 0;
    const typingSpeed = 5;  // Adjust this value to change the typing speed

    const message = {
        id: Math.random().toString(36).substr(2, 9),  // Generate a pseudo-random ID
        text: '',
        type: 'received',
        loading: true
    };

    // Ensure old "..." messages are removed when starting to type
    setMessages(prevMessages => [...prevMessages.filter(msg => msg.text !== "..."), message]);

    const typingInterval = setInterval(() => {
        if (i < fullText.length) {
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                const index = newMessages.findIndex(msg => msg.id === message.id);
                newMessages[index].text = fullText.slice(0, i + 1);
                return newMessages;
            });
            i++;
        } else {
            clearInterval(typingInterval);
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                const index = newMessages.findIndex(msg => msg.id === message.id);
                if (index !== -1) {
                    newMessages[index].loading = false;  // Typing done
                }
                return newMessages;
            });
        }
    }, typingSpeed);
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
