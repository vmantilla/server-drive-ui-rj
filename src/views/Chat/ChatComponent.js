import React, { useEffect, useRef, useState } from 'react';
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
    const messageEndRef = useRef(null);

    useEffect(() => {
        const handleConnected = () => setIsConnected(true);
        const handleDisconnected = () => {
            setIsConnected(false);
            setMessages(prevMessages => [...prevMessages, { text: "Conecting...", type: "received" }]);
        };

        const handleReceivedMessage = (data) => {
            const messageData = JSON.parse(data.message);
            const messageType = messageData.user_id === 0 ? 'received' : 'sent';
            if (messageType === 'received') {
                setInputDisabled(false);
                clearTimeout(inputDisabled);
                if (messageData.body === "...") {
                    setMessages(prevMessages => [...prevMessages, { id: messageData.id, text: messageData.body, type: messageType, loading: true }]);
                    setInputDisabled(true);
                    setTimeout(() => setInputDisabled(false), 60000);
                } else {
                    setMessages(prevMessages => [...prevMessages.filter(msg => msg.text !== "...")]);
                    simulateTypingEffect(messageData.body, messageData.user_id);
                }
            } else {
                setMessages(prevMessages => [...prevMessages, { id: messageData.id, text: messageData.body, type: messageType, loading: false }]);
            }
        };

        const unsubscribe = subscribeToChatChannel(chatId, handleReceivedMessage, handleConnected, handleDisconnected);
        return () => {
            unsubscribe();
            clearTimeout(inputDisabled);
        };
    }, [chatId, isConnected]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const simulateTypingEffect = (fullText, userId) => {
        let i = 0;
        const typingSpeed = 50;
        const message = {
            id: Math.random().toString(36).substr(2, 9),
            text: '',
            type: 'received',
            loading: true
        };

        setMessages(prevMessages => [...prevMessages, message]);

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
                        newMessages[index].loading = false;
                    }
                    return newMessages;
                });
            }
        }, typingSpeed);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim()) {
            try {
                await sendMessageToChat(chatId, message);
                setMessage('');
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    const toggleChat = () => setIsMinimized(!isMinimized);

    return (
        <div className="chat-container">
            <div className="chat-header" onClick={toggleChat}>
                <span>
                    <img src={chatAILogo} alt="Chat AI logo" className="robot-icon" />
                    <span className="text-gap">AI Builder</span>
                </span>
                <button className="toggle-chat-btn">
                    {isMinimized ? <i className="bi bi-plus"></i> : <i className="bi bi-dash"></i>}
                </button>
            </div>
            {!isMinimized && (
                <>
                    <ListGroup className="message-list">
                        {messages.map((msg, index) => (
                            <ListGroup.Item key={index} className={`message ${msg.type} ${msg.text === "..." && msg.type === 'received' && msg.loading ? 'blinking' : ''}`}>
                                {msg.text}
                            </ListGroup.Item>
                        ))}
                        <div ref={messageEndRef} />
                    </ListGroup>
                    <Form onSubmit={sendMessage} className="message-form">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder={(canWrite && isConnected && !inputDisabled) ? "Builder Chat" : "Processingg..."}
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
