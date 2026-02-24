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
        <div className="ai-chat-interface">
          {/* Chat content here */}
        </div>
      )}
    </div>
  );