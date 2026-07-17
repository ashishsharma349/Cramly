import React from 'react';
import { Home, FileText, Star, User } from 'lucide-react';

// Mobile layout bottom navigation bar.
export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-nav-container">
        <button 
          className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'my-cheatsheets' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-cheatsheets')}
        >
          <FileText size={20} />
          <span>My Cheats</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Star size={20} />
          <span>Favorites</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
}
