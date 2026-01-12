import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Mic, MicOff, Send, Square, Volume2, X, Paperclip, FileText, FileImage, File, HeadphonesIcon, Check, CheckCheck, AlertCircle, RotateCcw } from 'lucide-react';
import ProductCard from './ProductCard';

// Utility function to generate message IDs
const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const Chatbox = ({ isOpen, onClose }) => {
  // Initialize messages from localStorage or use default
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem('bmw-chatbox-messages');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        // Ensure we have at least the initial assistant message
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load chat history from localStorage:', error);
    }
    // Return default initial message
    return [
      {
        role: 'assistant',
        content: "Hi! I'm the Building Material Warehouse assistant. Tell me your budget and the look you want, and I'll recommend materials from our Collections.",
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [showHumanService, setShowHumanService] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlsRef = useRef([]);

  const chatApiUrl = useMemo(() => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
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
    return () => {
      objectUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
      objectUrlsRef.current = [];
    };
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      const persistable = messages.map((msg) => {
        if (!msg?.attachments || !Array.isArray(msg.attachments)) return msg;
        return {
          ...msg,
          attachments: msg.attachments.map((att) => ({
            ...att,
            localPreviewUrl: undefined,
          })),
        };
      });
      localStorage.setItem('bmw-chatbox-messages', JSON.stringify(persistable));
    } catch (error) {
      console.warn('Failed to save chat history to localStorage:', error);
    }
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

  const toggleListening = () => {
    if (!speechRecognitionSupported) return;

    if (isListening) {
      stopListening();
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.transcript;
        if (transcript) {
          setInputMessage(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    try {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
      }
    } catch {
      // ignore
    } finally {
      setSpeakingIndex(null);
    }
  };

  const speakMessage = (text, messageIndex) => {
    if (!speechSynthesisSupported || !text) return;

    if (speakingIndex === messageIndex) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setSpeakingIndex(messageIndex);
      utterance.onend = () => setSpeakingIndex(null);
      utterance.onerror = () => setSpeakingIndex(null);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Failed to speak message:', error);
      setSpeakingIndex(null);
    }
  };

  // File handling functions
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                         file.type === 'application/pdf' || 
                         file.type.startsWith('text/') ||
                         file.type === 'application/msword' ||
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      console.warn('Some files were rejected. Only images, PDFs, text files, and Word documents under 10MB are allowed.');
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (fileToRemove) => {
    setSelectedFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <FileImage size={16} />;
    if (file.type === 'application/pdf') return <FileText size={16} />;
    return <File size={16} />;
  };

  // Render file attachment with preview for images
  const renderAttachment = (file, fileIndex) => {
    if (file.type.startsWith('image/')) {
      // Create image source - use server URL if available, otherwise create object URL
      let imageSrc;
      try {
        if (file.previewDataUrl) {
          imageSrc = file.previewDataUrl;
        } else if (file.localPreviewUrl) {
          imageSrc = file.localPreviewUrl;
        } else if (file.url) {
          imageSrc = file.url;
        } else if (file && file.constructor && file.constructor.name === 'File') {
          imageSrc = URL.createObjectURL(file);
          objectUrlsRef.current.push(imageSrc);
        } else if (file && file.size && file.type) {
          // Fallback: if it looks like a File object, try to create URL
          imageSrc = URL.createObjectURL(file);
          objectUrlsRef.current.push(imageSrc);
        } else {
          throw new Error('No valid image source');
        }
      } catch (error) {
        console.warn('Could not create image preview for:', file.name, error);
        imageSrc = null;
      }

      return (
        <div key={fileIndex} className="chatbox-image-attachment">
          <div className="image-preview-container">
            {imageSrc ? (
              <img 
                src={imageSrc} 
                alt={file.name}
                className="image-preview"
                onClick={() => setEnlargedImage({ src: imageSrc, alt: file.name })}
                onError={(e) => {
                  // Fallback to file icon if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="image-fallback" style={{ display: imageSrc ? 'none' : 'flex' }}>
              <FileImage size={24} />
              <span className="attachment-name">{file.name}</span>
            </div>
          </div>
          <div className="image-info">
            <span className="attachment-name">{file.name}</span>
            <span className="attachment-size">({Math.round(file.size / 1024)}KB)</span>
          </div>
        </div>
      );
    } else {
      return (
        <div key={fileIndex} className="chatbox-attachment">
          {getFileIcon(file)}
          <span className="attachment-name">{file.name}</span>
          <span className="attachment-size">
            ({Math.round(file.size / 1024)}KB)
          </span>
        </div>
      );
    }
  };

  const uploadFiles = async (files) => {
    if (files.length === 0) return [];

    setIsUploadingFiles(true);
    const uploadedFiles = [];

    try {
      for (const file of files) {
        try {
          let localPreviewUrl = null;
          if (file.type && file.type.startsWith('image/')) {
            try {
              localPreviewUrl = URL.createObjectURL(file);
              objectUrlsRef.current.push(localPreviewUrl);
            } catch {
              localPreviewUrl = null;
            }
          }

          const formData = new FormData();
          formData.append('file', file);

          const uploadUrl = chatApiUrl.replace('/bmw/chat', '/bmw/upload');
          console.log('Uploading to:', uploadUrl); // Debug log
          
          const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`Upload response for ${file.name}:`, data);
            uploadedFiles.push({
              name: file.name,
              type: file.type,
              size: file.size,
              url: data.file?.url || data.url,
              previewDataUrl: data.file?.previewDataUrl,
              localPreviewUrl,
              content: data.file?.content || data.content
            });
          } else {
            const errorText = await response.text();
            console.error(`Failed to upload ${file.name}:`, response.status, errorText);
            // Still add the file but without server-processed content
            uploadedFiles.push({
              name: file.name,
              type: file.type,
              size: file.size,
              url: null,
              previewDataUrl: null,
              localPreviewUrl,
              content: `File upload failed for ${file.name}. File type: ${file.type}, Size: ${file.size} bytes.`
            });
          }
        } catch (singleFileError) {
          console.error(`Error uploading individual file ${file.name}:`, singleFileError);
          // Add file info even if upload failed
          uploadedFiles.push({
            name: file.name,
            type: file.type,
            size: file.size,
            url: null,
            previewDataUrl: null,
            localPreviewUrl: null,
            content: `Unable to process file ${file.name}. File type: ${file.type}, Size: ${file.size} bytes.`
          });
        }
      }
    } catch (error) {
      console.error('Error in uploadFiles function:', error);
    } finally {
      setIsUploadingFiles(false);
    }

    console.log('Final uploadedFiles result:', uploadedFiles);
    return uploadedFiles;
  };

  // Retry failed message
  const retryMessage = async (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message || message.role !== 'user') return;

    // Update message status to sending
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'sending' } : msg
    ));

    // Remove any assistant response that followed this message
    setMessages(prev => {
      const messageIndex = prev.findIndex(msg => msg.id === messageId);
      return prev.slice(0, messageIndex + 1);
    });

    // Resend the message
    setIsLoading(true);
    try {
      const apiMessages = messages.slice(0, messages.findIndex(msg => msg.id === messageId) + 1).map((msg) => {
        const messageObj = {
          role: msg.role,
          content: msg.content,
        };
        
        if (msg.attachments && msg.attachments.length > 0) {
          messageObj.attachments = msg.attachments.map(file => ({
            name: file.name,
            type: file.type,
            content: file.content
          }));
        }
        
        return messageObj;
      });

      const response = await fetch(chatApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Update message status to delivered
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status: 'delivered' } : msg
        ));
        
        // Add assistant response
        const assistantMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: data.message,
          products: data.products || [],
          status: 'delivered',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error retrying message:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'failed' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!inputMessage.trim() && selectedFiles.length === 0) || isLoading || isUploadingFiles) return;

    const userMessage = inputMessage.trim();
    const filesToUpload = [...selectedFiles];
    
    setInputMessage('');
    setSelectedFiles([]);
    stopListening();

    // Upload files first if any
    let uploadedFiles = [];
    if (filesToUpload.length > 0) {
      console.log('Uploading files:', filesToUpload.map(f => f.name));
      uploadedFiles = await uploadFiles(filesToUpload);
      console.log('Uploaded files result:', uploadedFiles);
    }

    // Create user message with files
    const messageContent = userMessage || 'I have attached some files for you to review.';
    const newUserMessage = { 
      id: generateMessageId(),
      role: 'user', 
      content: messageContent,
      attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      status: 'sending',
      timestamp: Date.now()
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const apiMessages = [...messages, newUserMessage].map((msg) => {
        const messageObj = {
          role: msg.role,
          content: msg.content,
        };
        
        // Include file content for AI analysis
        if (msg.attachments && msg.attachments.length > 0) {
          console.log('Processing message attachments for API:', msg.attachments);
          messageObj.attachments = msg.attachments.map(file => ({
            name: file.name,
            type: file.type,
            content: file.content
          }));
        }
        
        return messageObj;
      });

      const response = await fetch(chatApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Update user message status to delivered
        setMessages((prev) => prev.map(msg => 
          msg.id === newUserMessage.id ? { ...msg, status: 'delivered' } : msg
        ));
        
        console.log('AI Response:', data); // Debug log
        console.log('Products received:', data.products); // Debug log
        
        const assistantMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: data.message,
          products: data.products || [],
          status: 'delivered',
          timestamp: Date.now()
        };
        
        console.log('Assistant message with products:', assistantMessage); // Debug log
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update user message status to failed
      setMessages((prev) => prev.map(msg => 
        msg.id === newUserMessage.id ? { ...msg, status: 'failed' } : msg
      ));
      
      const errorMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later or use the Contact Us button to reach our team.',
        status: 'delivered',
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render message status indicator
  const renderMessageStatus = (message) => {
    if (message.role !== 'user') return null;
    
    switch (message.status) {
      case 'sending':
        return (
          <div className="message-status sending" title="Sending...">
            <Loader2 size={12} className="spinning" />
          </div>
        );
      case 'delivered':
        return (
          <div className="message-status delivered" title="Delivered">
            <CheckCheck size={12} />
          </div>
        );
      case 'failed':
        return (
          <div className="message-status failed" title="Failed to send">
            <AlertCircle size={12} />
            <button 
              className="retry-btn"
              onClick={() => retryMessage(message.id)}
              title="Retry sending message"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Format message time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  // Handle human service click
  const handleHumanServiceClick = () => {
    // TODO: Implement human service interface
    console.log('Connecting to human service...');
    setShowHumanService(true);
    // This is where you would implement the actual human service connection
    // For example: open a chat widget, redirect to a support page, etc.
  };

  // Clear chat history
  const clearChatHistory = () => {
    objectUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    });
    objectUrlsRef.current = [];

    const initialMessage = {
      role: 'assistant',
      content: "Hi! I'm the Building Material Warehouse assistant. Tell me your budget and the look you want, and I'll recommend materials from our Collections.",
    };
    setMessages([initialMessage]);
    try {
      localStorage.removeItem('bmw-chatbox-messages');
    } catch (error) {
      console.warn('Failed to clear chat history from localStorage:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="chatbox-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="chatbox-container" onClick={(e) => e.stopPropagation()}>
        <div className="chatbox-header">
          <div className="chatbox-title">
            <div className="chatbox-avatar">AI ASSISTANT</div>
          </div>
          <button className="chatbox-close-btn" onClick={onClose} aria-label="Close chat">
            <X size={20} />
          </button>
        </div>

        <div className="chatbox-messages">
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`chatbox-message ${message.role === 'user' ? 'user-message' : 'assistant-message'} ${
                message.status === 'sending' ? 'loading-state' : ''
              } ${
                message.status === 'failed' ? 'failed-state' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <div className="chatbox-avatar-small">
                  <img src="/logo.png" alt="AI" />
                </div>
              )}
              <div className="chatbox-message-wrapper">
                <div className="chatbox-message-content">
                  <div className="chatbox-message-text-container">
                    <div className="message-content-wrapper">
                      <span className="chatbox-message-text">{message.content}</span>
                      <div className="message-meta">
                        {message.timestamp && (
                          <span className="message-time">{formatTime(message.timestamp)}</span>
                        )}
                        {renderMessageStatus(message)}
                      </div>
                    </div>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="chatbox-attachments">
                        {message.attachments.map((file, fileIndex) => renderAttachment(file, fileIndex))}
                      </div>
                    )}
                    
                    {message.products && message.products.length > 0 && (
                      <div className="chatbox-products">
                        <h4 className="products-title">Recommended Products:</h4>
                        <div className="products-grid">
                          {message.products.map((product, productIndex) => {
                            console.log(`Rendering product ${productIndex}:`, product); // Debug log
                            return (
                              <ProductCard 
                                key={productIndex} 
                                product={product} 
                                isCompact={true}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  {message.role === 'assistant' && speechSynthesisSupported && (
                    <button
                      className={`chatbox-speak-btn ${speakingIndex === index ? 'speaking' : ''}`}
                      onClick={() => speakMessage(message.content, index)}
                      disabled={isLoading}
                      aria-label={speakingIndex === index ? 'Stop speaking' : 'Read message aloud'}
                      title={speakingIndex === index ? 'Stop speaking' : 'Read aloud'}
                    >
                      {speakingIndex === index ? (
                        <Square size={16} />
                      ) : (
                        <Volume2 size={16} />
                      )}
                    </button>
                  )}
                </div>
                
                {message.role === 'assistant' && index === messages.length - 1 && (
                  <div className="human-service-link-container">
                    <div className="human-service-text">
                      Can't solve the problem?
                      <button onClick={handleHumanServiceClick}>
                        Try human support
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chatbox-message assistant-message">
              <div className="chatbox-avatar-small">
                <img src="/logo.png" alt="AI" />
              </div>
              <div className="chatbox-message-content">
                <Loader2 size={16} className="chatbox-loading-icon" />
                <span>AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {enlargedImage && (
          <div className="image-modal-overlay" onClick={() => setEnlargedImage(null)}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="image-modal-close"
                onClick={() => setEnlargedImage(null)}
                aria-label="Close image"
              >
                <X size={24} />
              </button>
              <img 
                src={enlargedImage.src} 
                alt={enlargedImage.alt}
                className="enlarged-image"
              />
            </div>
          </div>
        )}

        <div className="chatbox-input-section">
          {selectedFiles.length > 0 && (
            <div className="chatbox-selected-files">
              {selectedFiles.map((file, index) => {
                if (file.type.startsWith('image/')) {
                  return (
                    <div key={index} className="selected-image-item">
                      <div className="selected-image-preview">
                        <img 
                          src={file && file.size && file.type ? URL.createObjectURL(file) : '#'} 
                          alt={file.name}
                          className="selected-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="selected-file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">({Math.round(file.size / 1024)}KB)</span>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file-btn"
                        onClick={() => removeFile(file)}
                        aria-label="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="selected-file-item">
                      {getFileIcon(file)}
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">({Math.round(file.size / 1024)}KB)</span>
                      <button 
                        type="button" 
                        className="remove-file-btn"
                        onClick={() => removeFile(file)}
                        aria-label="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                }
              })}
            </div>
          )}
          
          <form className="chatbox-input-form" onSubmit={handleSend}>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            
            <button
              type="button"
              className="chatbox-attachment-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isUploadingFiles}
              aria-label="Attach file"
              title="Attach file"
            >
              <Paperclip size={18} />
            </button>
            
            <div className="chatbox-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="chatbox-input"
                placeholder={isListening ? "Listening..." : "Type your message..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
              />
              {speechRecognitionSupported && (
                <button
                  type="button"
                  className={`chatbox-mic-btn-inner ${isListening ? 'active' : ''}`}
                  onClick={toggleListening}
                  disabled={isLoading}
                  aria-pressed={isListening}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              )}
            </div>
            
            <button
              type="submit"
              className="chatbox-send-btn"
              disabled={(!inputMessage.trim() && selectedFiles.length === 0) || isLoading || isUploadingFiles}
              aria-label="Send message"
            >
              {isUploadingFiles || isLoading ? (
                <Loader2 size={18} className="chatbox-loading-icon" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
