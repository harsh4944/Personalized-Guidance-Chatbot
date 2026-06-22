import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ExploreCareers from './components/ExploreCareers';
import AssessmentQuiz from './components/AssessmentQuiz';
import CareerDetailsModal from './components/CareerDetailsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: '👋 Welcome to GuideBot! Describe your skills, hobbies, or interests (e.g., "I love Python and math"), and I will suggest matching careers with personalized roadmaps.'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [savedCareers, setSavedCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('saved_careers');
    if (saved) {
      try {
        setSavedCareers(JSON.parse(saved));
      } catch (e) {
        // Fallback if structure changes
        const parsed = JSON.parse(saved);
        setSavedCareers(Array.isArray(parsed) ? parsed : []);
      }
    }
  }, []);

  // Save careers to localStorage on change
  const updateSavedCareers = (newSaved) => {
    setSavedCareers(newSaved);
    localStorage.setItem('saved_careers', JSON.stringify(newSaved));
  };

  const handleSaveToggle = (career) => {
    const isAlreadySaved = savedCareers.some((c) => c.name === career.name);
    if (isAlreadySaved) {
      updateSavedCareers(savedCareers.filter((c) => c.name !== career.name));
    } else {
      updateSavedCareers([...savedCareers, career]);
    }
  };

  const handleRemoveCareer = (name) => {
    updateSavedCareers(savedCareers.filter((c) => c.name !== name));
  };

  const handleSendMessage = async (text) => {
    // 1. Add user message
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();

      // 2. Add bot reply
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: data.reply,
        careers: data.careers
      }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: '⚠️ Failed to connect to the recommendation engine. Please ensure the backend server is running.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async (summaryText) => {
    setQuizLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: summaryText })
      });

      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      setQuizResults(data.careers || []);
    } catch (error) {
      console.error(error);
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCareers={savedCareers}
        onRemoveCareer={handleRemoveCareer}
        onSelectCareer={setSelectedCareer}
      />

      <main className="main-content-viewport">
        {activeTab === 'chat' && (
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
            savedCareers={savedCareers}
            onSaveToggle={handleSaveToggle}
            onSelectCareer={setSelectedCareer}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreCareers
            savedCareers={savedCareers}
            onSaveToggle={handleSaveToggle}
            onSelectCareer={setSelectedCareer}
          />
        )}

        {activeTab === 'quiz' && (
          <AssessmentQuiz
            onSubmitQuiz={handleSubmitQuiz}
            loading={quizLoading}
            results={quizResults}
            savedCareers={savedCareers}
            onSaveToggle={handleSaveToggle}
            onSelectCareer={setSelectedCareer}
          />
        )}
      </main>

      {selectedCareer && (
        <CareerDetailsModal
          career={selectedCareer}
          onClose={() => setSelectedCareer(null)}
        />
      )}
    </div>
  );
}
