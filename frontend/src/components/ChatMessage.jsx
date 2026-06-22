import React from 'react';
import { User, ShieldAlert, Cpu } from 'lucide-react';
import CareerCard from './CareerCard';

export default function ChatMessage({ message, savedCareers, onSaveToggle, onSelectCareer }) {
  const isBot = message.role === 'bot';

  return (
    <div className={`chat-message-wrapper ${isBot ? 'bot' : 'user'}`}>
      <div className="message-avatar">
        {isBot ? (
          <Cpu size={16} className="neon-text-cyan" />
        ) : (
          <User size={16} className="neon-text-magenta" />
        )}
      </div>

      <div className="message-content-box">
        <div className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
          <div className="message-text">{message.text}</div>
        </div>

        {isBot && message.careers && message.careers.length > 0 && (
          <div className="message-careers-grid">
            {message.careers.map((career) => (
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
    </div>
  );
}
