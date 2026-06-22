import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CareerCard from './CareerCard';

export default function ExploreCareers({ savedCareers, onSaveToggle, onSelectCareer }) {
  const [careers, setCareers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/careers')
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load catalog");
        return res.json();
      })
      .then((data) => {
        setCareers(data.careers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredCareers = careers.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchesName = c.name.toLowerCase().includes(query);
    const matchesDesc = c.description.toLowerCase().includes(query);
    const matchesSkills = c.skills.some((s) => s.toLowerCase().includes(query));
    return matchesName || matchesDesc || matchesSkills;
  });

  return (
    <div className="explore-container">
      <div className="explore-header-row glass-panel">
        <div>
          <h3>Career Catalog</h3>
          <p>Browse and search the entire directory of indexed career options</p>
        </div>
        <div className="explore-search-box glass-panel">
          <Search size={18} color="#a0a0bc" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, or skill..."
            className="explore-search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="explore-loading-spinner">
          <span className="pulse-dot large"></span>
          <p>Loading database directory...</p>
        </div>
      ) : filteredCareers.length === 0 ? (
        <div className="explore-empty">
          <p>No careers found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="explore-grid">
          {filteredCareers.map((career) => (
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
  );
}
