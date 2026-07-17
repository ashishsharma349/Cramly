import React, { useState } from 'react';
import { Search, BookOpen, GraduationCap, Landmark, Gem, Send } from 'lucide-react';

const subjects = [
  "Databases",
  "Backend",
  "Frontend",
  "DevOps",
  "Languages",
  "Data Science",
  "Cloud",
  "Testing",
  "General",
  "AI/ML"
];

// Handles input inputs for cheatsheet parameters and submits inputs to parent.
export default function InputForm({ onSubmit, isGenerating }) {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [level, setLevel] = useState('school');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!topic || topic.trim().length < 2) {
      setError('Topic must be at least 2 characters.');
      return;
    }
    if (topic.length > 50) {
      setError('Topic must be maximum 50 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9\s\-]+$/.test(topic)) {
      setError('Topic can only contain letters, numbers, spaces, and dashes.');
      return;
    }
    
    let finalSubject = subject;
    if (subject === 'custom') {
      if (!customSubject || customSubject.trim().length < 2) {
        setError('Please enter a custom subject of at least 2 characters.');
        return;
      }
      if (customSubject.length > 50) {
        setError('Custom subject must be maximum 50 characters.');
        return;
      }
      finalSubject = customSubject.trim();
    }

    if (!finalSubject) {
      setError('Please select or enter a subject.');
      return;
    }

    onSubmit({ topic: topic.trim(), subject: finalSubject, level });
  };

  return (
    <form className="generator-card" onSubmit={handleSubmit}>
      <div className="form-grid-top">
        <div className="form-group">
          <label className="form-label" htmlFor="topic-input">
            <Search />
            1. Topic
          </label>
          <div className="form-input-wrapper">
            <input
              id="topic-input"
              type="text"
              className="form-input"
              placeholder="e.g., Redis, React, Docker"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <span className="form-help-text">Enter the topic you want a cheatsheet for</span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="subject-select">
            <BookOpen />
            2. Subject
          </label>
          <select
            id="subject-select"
            className="form-select"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (e.target.value !== 'custom') {
                setCustomSubject('');
              }
            }}
            disabled={isGenerating}
          >
            <option value="">Select a subject</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
            <option value="custom">Other (type custom subject)</option>
          </select>
          {subject === 'custom' && (
            <div className="form-input-wrapper" style={{ marginTop: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Science, History, Biology"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                disabled={isGenerating}
              />
            </div>
          )}
          <span className="form-help-text">Choose the category of the cheatsheet</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <GraduationCap />
          3. Level
        </label>
        <div className="level-cards-container">
          <div
            className={`level-card ${level === 'school' ? 'selected' : ''}`}
            onClick={() => !isGenerating && setLevel('school')}
          >
            <div className="level-radio-dot"></div>
            <div className="level-icon-badge school">
              <GraduationCap size={22} />
            </div>
            <div className="level-info">
              <span className="level-title">School</span>
              <span className="level-desc">Basics & Fundamentals</span>
            </div>
          </div>

          <div
            className={`level-card ${level === 'college' ? 'selected' : ''}`}
            onClick={() => !isGenerating && setLevel('college')}
          >
            <div className="level-radio-dot"></div>
            <div className="level-icon-badge college">
              <Landmark size={20} />
            </div>
            <div className="level-info">
              <span className="level-title">College</span>
              <span className="level-desc">In-depth Concepts</span>
            </div>
          </div>

          <div
            className={`level-card ${level === 'expert' ? 'selected' : ''}`}
            onClick={() => !isGenerating && setLevel('expert')}
          >
            <div className="level-radio-dot"></div>
            <div className="level-icon-badge expert">
              <Gem size={20} />
            </div>
            <div className="level-info">
              <span className="level-title">Expert</span>
              <span className="level-desc">Advanced & Pro Level</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600, padding: '4px 0' }}>
          Error: {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn-generate"
        disabled={isGenerating}
      >
        <Send size={18} />
        {isGenerating ? 'Generating Cheatsheet...' : 'Generate Cheatsheet'}
      </button>
    </form>
  );
}
