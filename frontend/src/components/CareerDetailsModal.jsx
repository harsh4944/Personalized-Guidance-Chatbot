import React from 'react';
import { X, TrendingUp, DollarSign, CheckCircle2, Map } from 'lucide-react';

export default function CareerDetailsModal({ career, onClose }) {
  if (!career) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-body-layout">
          {/* Main Info Column */}
          <div className="modal-info-col">
            <div className="modal-title-area">
              <Map size={24} className="neon-text-cyan" />
              <h3>{career.name}</h3>
            </div>
            
            <p className="modal-desc">{career.description}</p>

            <div className="modal-stats-grid">
              <div className="modal-stat-box glass-panel">
                <div className="stat-label-row">
                  <DollarSign size={16} className="neon-text-cyan" />
                  <span>Salary Range</span>
                </div>
                <div className="stat-value neon-text-cyan">{career.salary}</div>
              </div>

              <div className="modal-stat-box glass-panel">
                <div className="stat-label-row">
                  <TrendingUp size={16} className="neon-text-green" />
                  <span>Job Growth</span>
                </div>
                <div className="stat-value neon-text-green">{career.growth}</div>
              </div>
            </div>

            <div className="modal-skills-section">
              <h5>Core Skills Required</h5>
              <div className="modal-skills-list">
                {career.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag large">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Roadmap Column */}
          <div className="modal-roadmap-col">
            <h4>Learning Roadmap</h4>
            <p className="roadmap-subtitle">Follow these steps to qualify for this career path:</p>
            
            <div className="roadmap-timeline">
              {career.roadmap && career.roadmap.map((step, idx) => (
                <div key={idx} className="roadmap-step-item">
                  <div className="step-number-node">
                    <CheckCircle2 size={16} className="neon-text-cyan" />
                  </div>
                  <div className="step-text-container glass-panel">
                    <span className="step-badge">STEP {idx + 1}</span>
                    <p className="step-details">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
