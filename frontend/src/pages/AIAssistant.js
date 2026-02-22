import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, TrendingUp, Shield, CreditCard } from 'lucide-react';
import { askAI } from '../services/aiService';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';
import AIAssistantWidget from '../components/AIAssistantWidget';
import './AIAssistant.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AI Assistant Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: "40px", 
          color: "red", 
          textAlign: "center",
          fontFamily: "Arial, sans-serif"
        }}>
          <h2>AI Assistant Error</h2>
          <p>Something went wrong loading the AI Assistant.</p>
          <p>Please refresh the page and try again.</p>
          <details style={{ marginTop: "20px", textAlign: "left" }}>
            <summary>Error Details</summary>
            <pre style={{ 
              background: "#f5f5f5", 
              padding: "10px", 
              borderRadius: "5px",
              fontSize: "12px"
            }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // AI Feature Disabled State
  const isAIDisabled = true;

  // User context for AI (kept for UI compatibility)
  const [userContext, setUserContext] = useState({});

  // Load user context
  useEffect(() => {
    if (user) {
      const balance = localStorage.getItem(`balance_${user.id}`);
      const loans = JSON.parse(localStorage.getItem(`loans_${user.id}`) || '[]');
      const transactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
      
      setUserContext({
        balance: parseFloat(balance) || 0,
        loans: loans,
        creditScore: 750, // Mock credit score
        recentTransactions: transactions.slice(0, 10)
      });
    }
  }, [user]);

  // Load conversation history
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    setShowChat(true);

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

  const handleQuickQuestion = (question) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('aiChatHistory');
    setShowChat(false);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="ai-assistant-page">
      {/* AI Disabled Banner */}
      {isAIDisabled && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '12px 16px',
          margin: '16px',
          textAlign: 'center',
          color: '#92400e'
        }}>
          <strong>AI Services Unavailable</strong>
          <br />
          <span style={{ fontSize: '14px' }}>AI features are currently disabled. Please contact support for more information.</span>
        </div>
      )}

      {/* Landing Section */}
      {!showChat && messages.length === 0 && (
        <div className="ai-landing">
          <div className="ai-landing-content">
            <div className="ai-header">
              <div className="ai-logo">
                <Sparkles size={48} />
              </div>
              <h1>AI Assistant</h1>
              <p className="ai-subtitle">What can I help you with?</p>
            </div>

            {/* Main Input */}
            <div className="ai-main-input-container">
              <div className="ai-main-input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isAIDisabled ? "AI services are currently disabled" : "Ask anything about your finances, loans, spending..."}
                  className="ai-main-input"
                  disabled={isAIDisabled}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || isAIDisabled}
                  className="ai-main-send-btn"
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
            <div className="ai-quick-suggestions">
              <h3>Quick Questions</h3>
              <div className="suggestions-grid">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="suggestion-chip"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="ai-features">
              <div className="feature-card">
                <TrendingUp className="feature-icon" />
                <h4>Financial Insights</h4>
                <p>Get personalized advice based on your spending patterns</p>
              </div>
              <div className="feature-card">
                <Shield className="feature-icon" />
                <h4>Loan Guidance</h4>
                <p>Understand eligibility and optimize your loan applications</p>
              </div>
              <div className="feature-card">
                <CreditCard className="feature-icon" />
                <h4>Credit Building</h4>
                <p>Learn strategies to improve and maintain your credit score</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {showChat && (
        <div className="ai-chat-interface">
          <div className="ai-chat-header">
            <div className="ai-header-content">
              <div className="ai-avatar">
                <Bot size={24} />
              </div>
              <div className="ai-header-info">
                <h3>AI Assistant</h3>
                <span className="ai-status">Online</span>
              </div>
            </div>
            <div className="ai-header-actions">
              <button
                className="ai-clear-btn"
                onClick={clearChat}
              >
                Clear Chat
              </button>
              <button
                className="ai-back-btn"
                onClick={() => setShowChat(false)}
              >
                Back
              </button>
            </div>
          </div>

          <div className="ai-messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? (
                    <User size={18} />
                  ) : (
                    <Bot size={18} />
                  )}
                </div>
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-timestamp">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="ai-message ai-message">
                <div className="message-avatar">
                  <Bot size={18} />
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-input-container">
            <div className="ai-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isAIDisabled ? "AI services are currently disabled" : "Ask about your finances, loans, or banking..."}
                className="ai-input"
                disabled={isLoading || isAIDisabled}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || isAIDisabled}
                className="ai-send-button"
              >
                {isLoading ? (
                  <div className="ai-loading-spinner"></div>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Widget */}
      <AIAssistantWidget userContext={userContext} />
    </div>
  );
};

// Wrap the component with ErrorBoundary
const AIAssistantWithErrorBoundary = () => (
  <ErrorBoundary>
    <AIAssistant />
  </ErrorBoundary>
);

export default AIAssistantWithErrorBoundary;
