import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Send, X } from 'lucide-react';

const Chatbox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    const newUserMessage = { role: 'user', content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const apiMessages = [...messages, newUserMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('https://solidoro-backend-production.up.railway.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I encountered an error. Please try again later or use the Contact Us button to reach our team.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbox-overlay">
      <div className="chatbox-container" role="dialog" aria-label="AI Assistant chat">
        <div className="chatbox-header">
          <div className="chatbox-header-content">
            <h3 className="chatbox-title">AI Assistant</h3>
            <p className="chatbox-subtitle">Ask me anything about our products and services</p>
          </div>
          <button className="chatbox-close-btn" onClick={onClose} aria-label="Close chat" type="button">
            <X size={20} />
          </button>
        </div>

        <div className="chatbox-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chatbox-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="chatbox-message-content">{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="chatbox-message assistant-message">
              <div className="chatbox-message-content">
                <Loader2 size={16} className="chatbox-loading-icon" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbox-input-form" onSubmit={handleSend}>
          <input
            ref={inputRef}
            type="text"
            className="chatbox-input"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="chatbox-send-btn"
            disabled={!inputMessage.trim() || isLoading}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;
