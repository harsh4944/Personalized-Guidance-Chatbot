import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Award } from 'lucide-react';
import CareerCard from './CareerCard';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which of the following topics excites you the most?",
    options: [
      { text: "Writing code, logical structures, and web technologies.", value: "software coding web programming" },
      { text: "Creating designs, UI layouts, colors, and graphics.", value: "visual design UI UX graphics layout prototyping" },
      { text: "Analyzing statistics, spreadsheets, and training ML models.", value: "statistics math machine learning analytics prediction" },
      { text: "Setting up servers, cloud hosting, and automation.", value: "cloud server devops infrastructure configuration" },
      { text: "Securing networks, encryption, and finding system flaws.", value: "network security ethical hacking firewall cryptography" }
    ]
  },
  {
    id: 2,
    question: "What is your preferred style of problem-solving?",
    options: [
      { text: "Creating algorithms to solve complex data flows.", value: "algorithms logic backend" },
      { text: "Conducting user testing and prototyping visually.", value: "user research user experience wireframes" },
      { text: "Building statistical graphs and data storytelling.", value: "data visualization dashboard charts metrics" },
      { text: "Automating repetitive setup tasks and CI/CD pipelines.", value: "automation scripting deploy docker pipelines" },
      { text: "Simulating cyber attack scenarios in isolated sandboxes.", value: "vulnerability scanning malware investigation penetration" }
    ]
  },
  {
    id: 3,
    question: "Which type of digital product would you love to build?",
    options: [
      { text: "Mobile apps or interactive websites.", value: "web application mobile app developer" },
      { text: "A sleek interface design for a SaaS startup.", value: "figma prototyping product design" },
      { text: "An AI search engine or analytical forecasting model.", value: "deep learning ai forecast database query" },
      { text: "A global cloud infrastructure that never goes down.", value: "aws cloud scalable systems high availability" },
      { text: "A bulletproof security network for banking data.", value: "cybersecurity incident response data protection" }
    ]
  }
];

export default function AssessmentQuiz({ onSubmitQuiz, loading, results, savedCareers, onSaveToggle, onSelectCareer }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState([]);
  const [completed, setCompleted] = useState(false);

  const handleOptionSelect = (value) => {
    const updated = [...selections, value];
    setSelections(updated);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
      // Aggregate selections and submit
      const summary = updated.join(" ");
      onSubmitQuiz(summary);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelections([]);
    setCompleted(false);
  };

  return (
    <div className="quiz-container">
      {!completed ? (
        <div className="quiz-card glass-panel">
          <div className="quiz-header">
            <span className="step-counter">Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h3 className="quiz-question-title">{QUIZ_QUESTIONS[currentStep].question}</h3>

          <div className="quiz-options-list">
            {QUIZ_QUESTIONS[currentStep].options.map((opt, idx) => (
              <button 
                key={idx} 
                className="quiz-option-btn glass-panel"
                onClick={() => handleOptionSelect(opt.value)}
              >
                <span>{opt.text}</span>
                <ArrowRight size={16} className="arrow-icon" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="quiz-results-container">
          <div className="results-header glass-panel">
            <Award className="icon-pulse-magenta" size={32} color="#fe019a" />
            <h3>Your Top Career Match Recommendations</h3>
            <p>Based on your selections, we've query-searched our vector catalog for the best fits:</p>
            <button className="neon-btn neon-btn-pink reset-btn" onClick={handleReset}>
              <RotateCcw size={16} />
              <span>Retake Quiz</span>
            </button>
          </div>

          {loading ? (
            <div className="quiz-loading-spinner">
              <span className="pulse-dot large"></span>
              <p>Analyzing profiles & computing matches...</p>
            </div>
          ) : (
            <div className="quiz-results-grid">
              {results.map((career) => (
                <CareerCard
                  key={career.name}
                  career={career}
                  isSaved={savedCareers.some((c) => c.name === career.name)}
                  onSaveToggle={onSaveToggle}
                  onSelect={onSelectCareer}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
