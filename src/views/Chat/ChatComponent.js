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
    const [selectedOptions, setSelectedOptions] = useState({});
    const [isMinimized, setIsMinimized] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(false);
    const messageEndRef = useRef(null);

    const parseMessage = (messageBody) => {
        try {
            return JSON.parse(messageBody);
        } catch (error) {
            console.error('Failed to parse message:', error);
            return {}; // Return an empty object or handle errors appropriately
        }
    };

    useEffect(() => {
        const handleConnected = () => setIsConnected(true);
        const handleDisconnected = () => {
            setIsConnected(false);
            setMessages(prevMessages => [...prevMessages, { text: "Connecting...", type: "system" }]);
        };

        const handleReceivedMessage = (data) => {
            const receivedMessage = JSON.parse(data.message);
            const parsedBody = parseMessage(receivedMessage.body);
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
        setMessages(prevMessages => [...prevMessages, { id: Math.random(), text: data.response, type: messageType }]);
    };

    const processForm = (data) => {
        setMessages(prevMessages => [
            ...prevMessages,
            { id: Math.random(), type: 'form', content: data.additional_info.fields }
        ]);
    };

    const processOptions = (data) => {
        setMessages(prevMessages => [
            ...prevMessages,
            { id: Math.random(), type: 'options', content: data.additional_info.options, select_type: data.additional_info.select_type }
        ]);
    };

    const handleOptionChange = (id, value) => {
        setSelectedOptions(prev => ({ ...prev, [id]: value }));
    };

    const submitForm = async (msgId, formData) => {
        const messageToSend = formData ? JSON.stringify(formData) : selectedOptions[msgId];
        try {
            await sendMessageToChat(chatId, messageToSend);
        } catch (error) {
            console.error("Error sending message:", error);
        }
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

    const renderForm = (msg) => (
        <FormGroup>
            {msg.content.map((field, idx) => (
                <div key={idx}>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl
                        type={field.field_type}
                        placeholder={field.placeholder}
                        onChange={e => handleOptionChange(msg.id, { ...selectedOptions[msg.id], [field.label]: e.target.value })}
                    />
                </div>
            ))}
            <Button onClick={() => submitForm(msg.id, selectedOptions[msg.id])}>Submit</Button>
        </FormGroup>
    );

    const renderOptions = (msg) => (
        <FormGroup>
            {msg.content.map((option, idx) => (
                <FormCheck
                    key={idx}
                    type={msg.select_type === 'multiple' ? 'checkbox' : 'radio'}
                    label={option.label}
                    name={msg.select_type === 'multiple' ? `optionGroup-${msg.id}` : 'optionGroup'}
                    id={`option-${msg.id}-${idx}`}
                    onChange={() => handleOptionChange(msg.id, option.value)}
                />
            ))}
            <Button onClick={() => submitForm(msg.id)}>Submit</Button>
        </FormGroup>
    );

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
                        {messages.map((msg) => (
                            <ListGroup.Item key={msg.id} className={`message ${msg.type}`}>
                                {msg.type === 'form' ? renderForm(msg) :
                                 msg.type === 'options' ? renderOptions(msg) :
                                 msg.text}
                            </ListGroup.Item>
                        ))}
                        <div ref={messageEndRef} />
                    </ListGroup>
                    <Form onSubmit={sendMessage} className="message-form">
                        <InputGroup>
                            <FormControl
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

export default ChatComponent;
