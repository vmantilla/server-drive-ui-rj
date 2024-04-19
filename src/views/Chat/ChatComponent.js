import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, ListGroup, InputGroup, FormControl, FormGroup, FormLabel, FormCheck } from 'react-bootstrap';
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

    const parseMessage = (messageBody) => {
        try {
            const parsedBody = JSON.parse(messageBody);
            return parsedBody;
        } catch (error) {
            console.error('Failed to parse message:', error);
            return null; // Return null or handle errors appropriately
        }
    };

    useEffect(() => {
        const handleConnected = () => setIsConnected(true);
        const handleDisconnected = () => {
            setIsConnected(false);
            setMessages(prevMessages => [...prevMessages, { text: "Connecting...", type: "system" }]);
        };

        const handleReceivedMessage = (data) => {
            const receivedMessage = JSON.parse(data.message)
            const parsedBody = parseMessage(receivedMessage.body);
            console.log(parsedBody);
            console.log(parsedBody.type);
            
            
            const messageType = receivedMessage.user_id === 0 ? 'received' : 'sent';

            switch (parsedBody.type) {
                case 'text':
                case 'error':
                case 'retry':
                    processSimpleMessage(parsedBody, messageType);
                    break;
                case 'form':
                    processForm(parsedBody);
                    break;
                case 'options':
                    processOptions(parsedBody);
                    break;
                default:
                    console.error('Unknown message type received');
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

    const processSimpleMessage = (data, messageType) => {
        setMessages(prevMessages => [...prevMessages, { text: data.response, type: messageType }]);
    };

    const processForm = (data) => {
        setMessages(prevMessages => [
            ...prevMessages,
            { type: 'form', content: data.additional_info.fields.map(field => ({
                label: field.label,
                type: field.field_type,
                placeholder: field.placeholder
            }))}
        ]);
    };

    const processOptions = (data) => {
        setMessages(prevMessages => [
            ...prevMessages,
            { type: 'options', content: data.additional_info.options, select_type: data.additional_info.select_type }
        ]);
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
                                {msg.text || (msg.type === 'form' ? renderForm(msg.content) : msg.type === 'options' ? renderOptions(msg.content, msg.select_type) : msg.content)}
                            </ListGroup.Item>
                        ))}
                        <div ref={messageEndRef} />
                    </ListGroup>
                    <Form onSubmit={sendMessage} className="message-form">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder={(canWrite && isConnected && !inputDisabled) ? "Builder Chat" : "Processing..."}
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

const renderForm = (fields) => (
    <FormGroup>
        {fields.map((field, idx) => (
            <FormControl key={idx} placeholder={field.placeholder} />
        ))}
    </FormGroup>
);

const renderOptions = (options, select_type) => (
    <FormGroup>
        {options.map((option, idx) => (
            <FormCheck
                key={idx}
                type={select_type === 'multiple' ? 'checkbox' : 'radio'}
                label={option.label}
                name="optionGroup"
                id={`option-${idx}`}
            />
        ))}
    </FormGroup>
);

export default ChatComponent;
