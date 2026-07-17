import React from 'react';
import { Home, FileText, Star, User, Folder } from 'lucide-react';

// Desktop navigation sidebar containing navigation tabs and theme toggles.
export default function Sidebar({ activeTab, setActiveTab, theme, setTheme }) {
  const toggleTheme = (e) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="logo-section">
          <img src="/bear_logo.png" className="logo-icon" alt="Logo" />
          <h1 className="logo-text">
            CheatSheet
            <span>Generator</span>
          </h1>
        </div>

        <nav>
          <ul className="nav-menu">
            <li 
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <Home size={18} />
              Home
            </li>
            <li 
              className={`nav-item ${activeTab === 'my-cheatsheets' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-cheatsheets')}
            >
              <FileText size={18} />
              My Cheatsheets
            </li>
            <li 
              className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <Star size={18} />
              Favorites
            </li>
            <li 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              Profile
            </li>
          </ul>
        </nav>
      </div>

      <div>
        <div className="promo-card">
          <div style={{ color: 'var(--brand-primary)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
            <Folder size={32} />
          </div>
          <h3 className="promo-title">Save & Organize Your Cheatsheets</h3>
          <p className="promo-desc">
            Create an account to save, organize and access your cheatsheets anywhere.
          </p>
          <button className="promo-btn" onClick={() => alert('Account authentication modal would trigger here!')}>
            Sign Up / Log In
          </button>
        </div>

        <div className="theme-switch-container">
          <span className="theme-label">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <label className="switch-toggle">
            <input 
              type="checkbox" 
              checked={theme === 'dark'}
              onChange={toggleTheme} 
            />
            <span className="switch-slider"></span>
          </label>
        </div>
      </div>
    </aside>
  );
}
