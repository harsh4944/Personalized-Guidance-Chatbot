import React from 'react';
import { Star, ArrowUpRight } from 'lucide-react';

export default function CareerCard({ career, isSaved, onSaveToggle, onSelect }) {
  return (
    <div className="career-card glass-panel">
      <div className="card-header">
        <h4>{career.name}</h4>
        <button 
          className={`save-toggle-btn ${isSaved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSaveToggle(career);
          }}
          title={isSaved ? "Remove from saved" : "Save career"}
        >
          <Star size={16} fill={isSaved ? "#fe019a" : "none"} color={isSaved ? "#fe019a" : "#a0a0bc"} />
        </button>
      </div>

      <p className="card-desc">{career.description}</p>

      <div className="card-skills">
        {career.skills.slice(0, 4).map((skill, idx) => (
          <span key={idx} className="skill-tag">
            {skill}
          </span>
        ))}
        {career.skills.length > 4 && (
          <span className="skill-tag excess">+{career.skills.length - 4} more</span>
        )}
      </div>

      <div className="card-footer">
        <div className="card-stats">
          <span className="stat-label">Avg. Salary:</span>
          <span className="stat-value neon-text-cyan">{career.salary.split(' - ')[0]}</span>
        </div>
        <button className="neon-btn card-details-btn" onClick={() => onSelect(career)}>
          <span>Roadmap</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
