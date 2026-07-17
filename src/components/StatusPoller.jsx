import React from 'react';

// Renders the background job generation status card with loader indicators.
export default function StatusPoller({ currentJob }) {
  if (!currentJob) return null;

  const stage = currentJob.progressStage || 'Initializing...';

  return (
    <div className="status-poller-card">
      <div className="poller-spinner"></div>
      <div className="poller-info">
        <h4 className="poller-title">Generating Cheatsheet...</h4>
        <p className="poller-desc">
          Building your cheatsheet for <strong>{currentJob.topic}</strong> ({currentJob.level}). This normally takes 30 to 60 seconds. Please wait.
        </p>
        <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 500 }}>
            Current Stage: <span style={{ color: 'var(--brand-primary)' }}>{stage}</span>
          </span>
        </div>
        {currentJob.attempts > 0 && (
          <span style={{ fontSize: '11px', color: 'var(--brand-primary)', fontWeight: 600, marginTop: '4px', display: 'block' }}>
            Attempt {currentJob.attempts} of {currentJob.maxAttempts || 3}
          </span>
        )}
      </div>
    </div>
  );
}
