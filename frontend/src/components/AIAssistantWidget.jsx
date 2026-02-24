import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { askAI } from '../services/aiService';
import { formatCurrency } from '../utils/helpers';
import './AIAssistantWidget.css';

const AIAssistantWidget = ({ userContext = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load conversation history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('aiChatHistory');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save conversation to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aiChatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await askAI(userMessage.text);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble responding right now. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('aiChatHistory');
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Floating Button */}
      <div className={`ai-widget-container ${isOpen ? 'open' : ''}`}>
        <button
          className="glass-button glass-button-sm"
          onClick={toggleChat}
          aria-label="AI Assistant"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="glass-card glass-modal glass-animate-in">
          {/* Header */}
          <div className="glass-transaction">
            <div className="flex items-center space-x-3">
              <div className="text-xl">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-title">AI Assistant</h3>
                <span className="ai-status">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="ai-messages-container">
            {messages.length === 0 ? (
              <div className="ai-welcome-message">
                <Bot size={40} />
                <h4>Hello! I'm your AI Banking Assistant</h4>
                <p>I can help you with:</p>
                <ul>
                  <li>Loan eligibility questions</li>
                  <li>Credit score improvement tips</li>
                  <li>Spending analysis</li>
                  <li>Banking product information</li>
                </ul>
                <p>Feel free to ask me anything!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`glass-transaction ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">
                      {message.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div>
                      <p className="font-medium">{message.text}</p>
                      <p className="text-sm">{formatTimestamp(message.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isTyping && (
              <div className="glass-transaction ai-message">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">
                    <Bot size={18} />
                  </div>
                  <div>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="glass-transaction">
            <div className="glass-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about your finances, loans, spending..."
                className="glass-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="glass-button glass-button-primary"
              >
                {isLoading ? (
                  <div className="ai-loading-spinner"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>

          {/* Clear Chat Button */}
          <div className="text-center mt-4">
            <button
              onClick={clearChat}
              className="glass-button glass-button-sm"
            >
              Clear Chat
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistantWidget;
