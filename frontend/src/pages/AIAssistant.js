  import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send } from "lucide-react";
import { askAI } from "../services/aiService";

const AIAssistant = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAIDisabled, setIsAIDisabled] = useState(false);
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
    if (showChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || isAIDisabled) return;
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question) => {
    setInputValue(question);
    handleSendMessage();
  };

  const quickQuestions = [
    "Check loan eligibility",
    "How to improve credit score?",
    "Analyze my spending",
    "Best investment options?",
    "Reduce loan EMI",
    "Emergency fund size"
  ];

  return (
    <div className="glass-center">
      {/* AI Disabled Banner */}
      {isAIDisabled && (
        <div className="glass-card glass-container glass-animate-in">
          <div className="text-center">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="text-title">AI Services Unavailable</h3>
            <p className="text-label">AI features are currently disabled. Please contact support for more information.</p>
          </div>
        </div>
      )}

      {/* Landing Section */}
      {!showChat && messages.length === 0 && (
        <div className="glass-card glass-container glass-animate-in">
          <div className="text-center">
            <div className="ai-header">
              <div className="ai-logo">
                <Sparkles size={48} />
              </div>
              <h1 className="text-title">AI Assistant</h1>
              <p className="text-label">What can I help you with?</p>
            </div>
          </div>

          {/* Main Input */}
          <div className="glass-flex-col">
            <div className="glass-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isAIDisabled ? "AI services are currently disabled" : "Ask anything about your finances, loans, spending..."}
                className="glass-input"
                disabled={isAIDisabled}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || isAIDisabled}
                className="glass-button glass-button-primary"
              >
                {isLoading ? (
                  <div className="ai-loading-spinner"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="glass-grid">
            <h3 className="text-title">Quick Questions</h3>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                disabled={isAIDisabled}
                className="glass-button"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {showChat && (
        <div className="glass-card glass-container glass-animate-in">
          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                <div className="message-content">{msg.text}</div>
                <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="glass-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything about your finances, loans, spending..."
              className="glass-input"
              disabled={isAIDisabled}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || isAIDisabled}
              className="glass-button glass-button-primary"
            >
              {isLoading ? (
                <div className="ai-loading-spinner"></div>
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;