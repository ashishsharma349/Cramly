import React from 'react';
import { Menu, User } from 'lucide-react';

// Mobile layout top header containing navigation toggles and brand logo.
export default function MobileHeader({ onBurgerClick, onProfileClick }) {
  return (
    <header className="mobile-header">
      <button 
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        onClick={onBurgerClick}
      >
        <Menu size={24} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="/bear_logo.png" className="logo-icon" style={{ width: '28px', height: '28px' }} alt="Logo" />
        <h1 className="logo-text" style={{ fontSize: '16px', margin: 0 }}>
          CheatSheet <span style={{ display: 'inline', fontSize: '14px' }}>Generator</span>
        </h1>
      </div>

      <button 
        className="profile-avatar" 
        style={{ width: '32px', height: '32px', fontSize: '13px' }}
        onClick={onProfileClick}
      >
        <User size={14} />
      </button>
    </header>
  );
}
