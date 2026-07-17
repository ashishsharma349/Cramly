import React, { useState } from 'react';
import { X, Copy, Check, Download, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

// Displays a detailed modal preview of the compiled cheatsheet JSON content.
export default function PreviewModal({ isOpen, job, onClose }) {
  if (!isOpen || !job || !job.cheatsheetJSON) return null;

  const data = job.cheatsheetJSON;
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleDownload = () => {
   window.open(job.fileUrl, '_blank');
  };

  const getVerificationBadge = (verification) => {
    if (!verification) return null;

    const { status, confidence } = verification;
    let icon, bgColor, textColor, label;

    switch (status) {
      case 'verified':
        icon = <CheckCircle size={12} />;
        bgColor = 'rgba(16, 185, 129, 0.1)';
        textColor = '#059669';
        label = 'Verified';
        break;
      case 'partially_verified':
        icon = <AlertCircle size={12} />;
        bgColor = 'rgba(245, 158, 11, 0.1)';
        textColor = '#d97706';
        label = 'Partially Verified';
        break;
      case 'syntax_verified':
        icon = <CheckCircle size={12} />;
        bgColor = 'rgba(13, 148, 136, 0.1)';
        textColor = '#0d9488';
        label = 'Syntax Verified';
        break;
      default:
        icon = <HelpCircle size={12} />;
        bgColor = 'rgba(100, 116, 139, 0.1)';
        textColor = '#64748b';
        label = 'AI Knowledge Only';
    }

    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: bgColor,
        color: textColor,
        fontSize: '10px',
        fontWeight: 600,
        padding: '3px 8px',
        borderRadius: '6px',
        textTransform: 'uppercase',
        marginTop: '4px'
      }}>
        {icon}
        <span>{label}</span>
        {confidence > 0 && <span>({confidence}%)</span>}
      </div>
    );
  };

  const getSourcesList = (verification) => {
    if (!verification || !verification.sources || verification.sources.length === 0) return null;

    return (
      <div style={{ marginTop: '6px' }}>
        <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontWeight: 500 }}>Sources: </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
          {verification.sources.slice(0, 3).map((source, idx) => (
            <a
              key={idx}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '9px',
                color: 'var(--brand-primary)',
                textDecoration: 'none',
                backgroundColor: 'rgba(15, 118, 110, 0.05)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(15, 118, 110, 0.15)'
              }}
            >
              {source.title.length > 25 ? source.title.slice(0, 25) + '...' : source.title}
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{data.title || `${job.topic} Cheatsheet`}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Subject: {job.subject} | Level: <span style={{ textTransform: 'capitalize' }}>{job.level}</span>
            </p>
          </div>
          <button className="btn-close-modal" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="preview-rendered-container">
            {data.description && (
              <div 
                style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  border: '1px solid var(--border-color)', 
                  padding: '16px', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Note: {data.description}
              </div>
            )}

            <div className="preview-rendered-sections">
              {data.sections && data.sections.map((section, idx) => (
                <div key={idx} className="preview-rendered-section-card">
                  <div className="preview-rendered-section-title">
                    <span>{section.name}</span>
                    {section.language && (
                      <span className="badge-level school" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                        {section.language}
                      </span>
                    )}
                  </div>
                  {getVerificationBadge(section.verification)}
                  {getSourcesList(section.verification)}
                  <p className="preview-rendered-section-desc">
                    {section.description}
                  </p>
                  <div className="preview-code-block">
                    <pre className="preview-code-text">
                      <code>{section.code}</code>
                    </pre>
                    <button 
                      className="preview-copy-btn"
                      onClick={() => handleCopyCode(section.code, idx)}
                    >
                      {copiedIndex === idx ? <Check size={12} /> : <Copy size={12} />}
                      <span style={{ marginLeft: '4px' }}>
                        {copiedIndex === idx ? 'Copied' : 'Copy'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-action-outline" onClick={onClose}>
            Close
          </button>
          <button className="btn-generate" style={{ padding: '8px 18px', fontSize: '14px' }} onClick={handleDownload}>
            <Download size={14} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
