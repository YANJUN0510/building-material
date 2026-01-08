import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Mic, MicOff, Send, Square, Volume2, X } from 'lucide-react';

const Chatbox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Building Material Warehouse assistant. Tell me your budget and the look you want, and I’ll recommend materials from our Collections.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  const chatApiUrl = useMemo(() => {
    const base = import.meta.env.VITE_API_BASE_URL || 'https://solidoro-backend-production.up.railway.app';
    return `${base.replace(/\/+$/, '')}/api/bmw/chat`;
  }, []);

  const speechRecognitionSupported = useMemo(() => {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  const speechSynthesisSupported = useMemo(() => {
    return Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance);
  }, []);

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

  const stopListening = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // ignore
    } finally {
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    try {
      window.speechSynthesis?.cancel?.();
    } catch {
      // ignore
    } finally {
      utteranceRef.current = null;
      setSpeakingIndex(null);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopSpeaking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = () => {
    if (!speechRecognitionSupported || isListening || isLoading) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = navigator.language || 'en-AU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setInputMessage((prev) => {
          const next = prev ? `${prev.trim()} ${transcript.trim()}` : transcript.trim();
          return next;
        });
        inputRef.current?.focus?.();
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const speak = (text, index) => {
    if (!speechSynthesisSupported) return;

    if (speakingIndex === index) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = /[\u4e00-\u9fff]/.test(text) ? 'zh-CN' : (navigator.language || 'en-AU');
    utterance.onend = () => {
      setSpeakingIndex(null);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setSpeakingIndex(null);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    stopListening();
    
    const newUserMessage = { role: 'user', content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const apiMessages = [...messages, newUserMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(chatApiUrl, {
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
              <div className="chatbox-message-content">
                <span className="chatbox-message-text">{message.content}</span>
                {message.role === 'assistant' && speechSynthesisSupported && (
                  <button
                    type="button"
                    className="chatbox-tts-btn"
                    onClick={() => speak(message.content, index)}
                    aria-label={speakingIndex === index ? 'Stop voice' : 'Play voice'}
                    title={speakingIndex === index ? 'Stop' : 'Play'}
                  >
                    {speakingIndex === index ? <Square size={16} /> : <Volume2 size={16} />}
                  </button>
                )}
              </div>
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
          <button
            type="button"
            className="chatbox-mic-btn"
            onClick={toggleListening}
            disabled={!speechRecognitionSupported || isLoading}
            aria-label={isListening ? 'Stop voice input' : 'Voice input'}
            aria-pressed={isListening}
            title={!speechRecognitionSupported ? 'Voice input not supported' : (isListening ? 'Stop' : 'Voice input')}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
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
