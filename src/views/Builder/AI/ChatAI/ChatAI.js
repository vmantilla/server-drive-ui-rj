import React, { useState, useEffect, useRef } from 'react';
import chatAILogo from '../../../../assets/images/chatAILogo.png';
import '../../../../css/Builder/AI/ChatAI/ChatAI.css';

import { sendMessageToChat } from '../../../../services/api';
import { subscribeToChatChannel } from '../../../../services/actionCable';

function ChatAI({ selectedWorkspace, className }) {
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false); // Properly initialize this state here
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const recognition = useRef(null);

    useEffect(() => {
        if (selectedWorkspace) {
            const unsubscribe = subscribeToChatChannel(selectedWorkspace.id, handleMessageReceived);
            return () => unsubscribe && unsubscribe();
        }
    }, [selectedWorkspace]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleAudio = () => {
        if (isAudioEnabled && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        setIsAudioEnabled(!isAudioEnabled);
    };

    const handleMessageReceived = (data) => {
        if (data.message === '...') {
            setMessages(currentMessages => [...currentMessages, { type: 'ai', text: data.message, loading: true }]);
        } else {
            simulateTypingEffect(data.message);
        }
    };

    const handleDeleteLastMessage = () => {
      setMessages(prevMessages => {
          // Eliminar el último mensaje excluyéndolo de la matriz actual
          const newMessages = prevMessages.slice(0, -1);
          return newMessages;
      });
  };

    const simulateTypingEffect = (message) => {
        const length = message.length;
        let i = 0;
        const typingSpeed = 40; // Adjust typing speed
        setMessages(currentMessages => {
            const newMessages = currentMessages.filter(msg => !msg.loading); // Remove any existing 'loading' message
            newMessages.push({ type: 'ai', text: '', loading: true }); // Add new loading message for typing simulation
            return newMessages;
        });

        const intervalId = setInterval(() => {
            if (i < length) {
                setMessages(currentMessages => {
                    const newMessages = currentMessages.slice(0, -1); // Remove the last 'loading' message
                    newMessages.push({ type: 'ai', text: message.substring(0, i+1), loading: false });
                    return newMessages;
                });
                i++;
            } else {
                clearInterval(intervalId);
                setMessages(currentMessages => {
                    const newMessages = currentMessages.slice(0, -1); // Final cleanup to remove 'loading' state
                    newMessages.push({ type: 'ai', text: message, loading: false });
                    return newMessages;
                });
                setIsWaitingForResponse(false);
            }
        }, typingSpeed);
    };

    const handleUserInput = async (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '' && !isWaitingForResponse) {
            const trimmedInput = inputValue.trim();
            setMessages(current => [...current, { type: 'user', text: trimmedInput }]);
            setInputValue('');
            setIsWaitingForResponse(true); // Lock the input area
            try {
                await sendMessageToChat(selectedWorkspace.id, trimmedInput);
                setMessages(current => [...current, { type: 'ai', text: '...', loading: true }]);
            } catch (error) {
                console.error("Error sending message:", error);
                setMessages(current => [...current, { type: 'ai', text: 'Error processing your message.', loading: false }]);
                setIsWaitingForResponse(false); // Unlock the input area on error
            }
        }
    };

    const adjustTextAreaHeight = (event) => {
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
    };

    const handleVoiceToggle = () => {
        if (isListening) {
            recognition.current.stop();
        } else {
            recognition.current.start();
        }
        setIsListening(!isListening);
    };

    return (
        <div className={`chat-ai ${className} ${isMinimized ? 'minimized' : ''}`}>
            <div className="chat-header">
                <img src={chatAILogo} alt="Chat AI logo" className="robot-icon" />
                <button onClick={toggleAudio} className="audio-toggle-button">
                    {isAudioEnabled ? <i className="bi bi-volume-up"></i> : <i className="bi bi-volume-mute"></i>}
                </button>
                <button onClick={() => setIsMinimized(!isMinimized)} className="minimize-button">–</button>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type} ${msg.loading ? 'loading-animation' : ''}`}>
                      {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <textarea
                    ref={inputRef}
                    className="chat-input-area"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleUserInput}
                    onInput={adjustTextAreaHeight}
                    disabled={isWaitingForResponse}
                />
                <button className="voice-button" onClick={handleVoiceToggle}>
                    {isListening ? 'Stop' : '🎤'}
                </button>
            </div>
        </div>
    );
}

export default ChatAI;
