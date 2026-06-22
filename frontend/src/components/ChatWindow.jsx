import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal } from 'lucide-react';
import ChatMessage from './ChatMessage';

const SUGGESTIONS = [
  "I want to build software and databases.",
  "I enjoy visual design and digital art.",
  "Show me careers with high salary and fast growth.",
  "I like mathematics and deep learning models.",
  "I want to secure networks and prevent hack attacks."
];

export default function ChatWindow({ messages, onSendMessage, loading, savedCareers, onSaveToggle, onSelectCareer }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (suggestion) => {
    if (loading) return;
    onSendMessage(suggestion);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="chat-window-container">
      <header className="chat-window-header glass-panel">
        <div className="status-indicator">
          <span className="pulse-dot"></span>
          <span>Core AI Retriever Active</span>
        </div>
        <div className="terminal-label">
          <Terminal size={14} />
          <span>Console::CareerGuidance</span>
        </div>
      </header>

      <div className="chat-messages-area">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            savedCareers={savedCareers}
            onSaveToggle={onSaveToggle}
            onSelectCareer={onSelectCareer}
          />
        ))}

        {loading && (
          <div className="chat-message-wrapper bot">
            <div className="message-avatar">
              <span className="pulse-dot"></span>
            </div>
            <div className="message-content-box">
              <div className="message-bubble bot-bubble thinking-bubble">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && !loading && (
        <div className="chat-suggestions-container">
          <p className="suggestions-title">Click a starter interest to search:</p>
          <div className="suggestions-grid">
            {SUGGESTIONS.map((s, idx) => (
              <button 
                key={idx} 
                className="suggestion-chip glass-panel"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-group glass-panel">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your skills, interests, or hobbies..."
            disabled={loading}
            className="chat-text-input"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="send-button"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
