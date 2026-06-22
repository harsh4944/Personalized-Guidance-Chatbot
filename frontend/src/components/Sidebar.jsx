import React from 'react';
import { MessageSquare, Compass, Award, Bookmark, Trash2, Sparkles } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, savedCareers, onRemoveCareer, onSelectCareer }) {
  return (
    <aside className="glass-panel sidebar-container">
      <div className="sidebar-header">
        <Sparkles className="icon-pulse-cyan" size={24} color="#00f2fe" />
        <h2>
          GUIDE<span className="neon-text-cyan">BOT</span>
        </h2>
      </div>

      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={20} />
          <span>Chat Assistant</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          <Compass size={20} />
          <span>Explore Careers</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          <Award size={20} />
          <span>Career Quiz</span>
        </button>
      </nav>

      <div className="sidebar-divider"></div>

      <div className="saved-careers-section">
        <div className="saved-header">
          <Bookmark size={16} className="neon-text-magenta" />
          <h3>Saved Careers</h3>
          <span className="saved-count">{savedCareers.length}</span>
        </div>

        {savedCareers.length === 0 ? (
          <div className="empty-saved">
            <p>No saved careers yet. Star recommendations in the chat to save them!</p>
          </div>
        ) : (
          <ul className="saved-list">
            {savedCareers.map((career) => (
              <li key={career.name} className="saved-item">
                <span className="saved-name" onClick={() => onSelectCareer(career)}>
                  {career.name}
                </span>
                <button 
                  className="remove-btn" 
                  onClick={() => onRemoveCareer(career.name)}
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-footer">
        <p className="footer-credits">v1.2.0 • Cyber Edition</p>
      </div>
    </aside>
  );
}
