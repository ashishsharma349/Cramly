import React, { useState } from 'react';
import { Eye, Download, Trash2, MoreVertical, Database, Cpu, Layout, Layers, Code2, LineChart, Cloud, ShieldAlert, Terminal, Brain, RefreshCw } from 'lucide-react';

// Maps subjects to representative Lucide React icons.
const getSubjectIcon = (subject) => {
  switch (subject) {
    case 'Databases': return <Database size={20} />;
    case 'Backend': return <Cpu size={20} />;
    case 'Frontend': return <Layout size={20} />;
    case 'DevOps': return <Layers size={20} />;
    case 'Languages': return <Code2 size={20} />;
    case 'Data Science': return <LineChart size={20} />;
    case 'Cloud': return <Cloud size={20} />;
    case 'Testing': return <ShieldAlert size={20} />;
    case 'General': return <Terminal size={20} />;
    case 'AI/ML': return <Brain size={20} />;
    default: return <Terminal size={20} />;
  }
};

// Renders the list of generated cheatsheets with status details and download links.
export default function RecentCheatsheets({ jobs, onPreview, onDelete, onViewAllClick }) {
  const [activeMenuJobId, setActiveMenuJobId] = useState(null);

  const toggleMenu = (jobId, e) => {
    e.stopPropagation();
    setActiveMenuJobId(activeMenuJobId === jobId ? null : jobId);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDownload = (job, e) => {
    e.stopPropagation();
    if (!job.downloadUrl) return;
    window.open(job.downloadUrl, '_blank');
  };

  return (
    <section className="recent-section">
      <div className="recent-header">
        <h2 className="recent-title">Recent Cheatsheets</h2>
        <button 
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={onViewAllClick}
        >
          <span className="recent-view-all">View all &gt;</span>
        </button>
      </div>

      <div className="recent-list">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>No cheatsheets generated yet. Try creating one above!</p>
          </div>
        ) : (
          jobs.map((job) => {
            const isCompleted = job.status === 'done';
            const isFailed = job.status === 'error';
            const isProcessing = job.status === 'processing' || job.status === 'pending';

            return (
              <div key={job.jobId} className="cheatsheet-row">
                <div className="row-left">
                  <div className="subject-icon-badge" title={job.subject}>
                    {getSubjectIcon(job.subject)}
                  </div>

                  <div className="sheet-details">
                    <div className="sheet-name-row">
                      <span className="sheet-title">{job.topic} Cheatsheet</span>
                      <span className={`badge-level ${job.level}`}>
                        {job.level}
                      </span>
                    </div>

                    <div className="sheet-meta">
                      {isCompleted && (
                        <>
                          <span>{formatDate(job.completedAt || job.createdAt)}</span>
                          <span className="bullet-separator">•</span>
                          <span>{job.fileSize || '24 KB'}</span>
                        </>
                      )}
                      
                      {isProcessing && (
                        <span style={{ color: '#0f766e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <RefreshCw size={12} className="spin-animation" style={{ animation: 'spin 1.5s linear infinite' }} />
                          Generating...
                        </span>
                      )}

                      {isFailed && (
                        <span style={{ color: '#dc2626', fontWeight: 600 }} title={job.errorMessage}>
                          Generation Failed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row-actions">
                  {isCompleted && (
                    <>
                      <button 
                        className="btn-action-outline"
                        onClick={() => onPreview(job)}
                      >
                        <Eye size={14} />
                        Preview
                      </button>
                      <button 
                        className="btn-action-outline"
                        onClick={(e) => handleDownload(job, e)}
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </>
                  )}

                  <div style={{ position: 'relative' }}>
                    <button 
                      className="btn-action-delete"
                      onClick={(e) => toggleMenu(job.jobId, e)}
                      title="Actions"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeMenuJobId === job.jobId && (
                      <div 
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          boxShadow: 'var(--shadow-md)',
                          zIndex: 10,
                          minWidth: '120px',
                          padding: '4px 0'
                        }}
                      >
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '8px 12px',
                            border: 'none',
                            background: 'none',
                            fontSize: '13px',
                            color: '#dc2626',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                          onClick={() => {
                            onDelete(job.jobId);
                            setActiveMenuJobId(null);
                          }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="row-actions-mobile">
                  {isCompleted && (
                    <>
                      <button 
                        className="btn-mobile-action"
                        onClick={() => onPreview(job)}
                        title="Preview"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn-mobile-action"
                        onClick={(e) => handleDownload(job, e)}
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                    </>
                  )}
                  <button 
                    className="btn-mobile-action"
                    style={{ color: '#dc2626' }}
                    onClick={() => onDelete(job.jobId)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
