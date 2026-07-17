import React, { useState, useEffect, useRef } from 'react';
import InputForm from '../components/InputForm.jsx';
import StatusPoller from '../components/StatusPoller.jsx';
import RecentCheatsheets from '../components/RecentCheatsheets.jsx';
import { generateCheatsheet, getJobStatus, getRecentJobs, deleteJob } from '../api/client.js';

// Main dashboard generator page coordinating the form submission and status polling.
export default function Generator({ onPreviewJob }) {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const pollTimerRef = useRef(null);

  const fetchRecentJobs = async () => {
    try {
      const data = await getRecentJobs();
      setJobs(data);
    } catch (err) {
      console.error('Failed to load recent cheatsheets:', err);
    }
  };

  useEffect(() => {
    fetchRecentJobs();
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const startPolling = (jobId) => {
    setIsGenerating(true);
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    pollTimerRef.current = setInterval(async () => {
      try {
        const statusData = await getJobStatus(jobId);
        setActiveJob(statusData);

        if (statusData.status === 'done') {
          clearInterval(pollTimerRef.current);
          setActiveJob(null);
          setIsGenerating(false);
          fetchRecentJobs();
          onPreviewJob(statusData);
        } else if (statusData.status === 'error') {
          clearInterval(pollTimerRef.current);
          setActiveJob(null);
          setIsGenerating(false);
          fetchRecentJobs();
          alert(`Generation error: ${statusData.errorMessage || 'Unknown error occurred.'}`);
        }
      } catch (err) {
        console.error('Error polling job status:', err);
      }
    }, 2000);
  };

  const handleGenerateSubmit = async (formData) => {
    try {
      setIsGenerating(true);
      setActiveJob({ topic: formData.topic, level: formData.level, attempts: 0, status: 'pending' });
      const response = await generateCheatsheet(formData);
      startPolling(response.jobId);
    } catch (err) {
      setActiveJob(null);
      setIsGenerating(false);
      alert(`Failed to start generation: ${err.message}`);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this cheatsheet?')) {
      return;
    }

    try {
      await deleteJob(jobId);
      setJobs(prevJobs => prevJobs.filter(j => j.jobId !== jobId));
    } catch (err) {
      alert(`Failed to delete cheatsheet: ${err.message}`);
    }
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>


      <section className="hero-banner">
        <div className="hero-text">
          <h2 className="hero-title">
            Create Cheatsheets.<br />
            The <span>Smart</span> Way.
          </h2>
          <p className="hero-desc">
            Generate concise, well-structured cheatsheets for any topic.
            Learn faster. Save time. Boost productivity.
          </p>
        </div>
        <div className="hero-illustration-container">
          <div className="illustration-blob"></div>
          
          <div className="floating-star star-1"></div>
          <div className="floating-star star-2"></div>
          
          <div className="floating-dots">
            <div className="dot-grid">
              <span>.</span><span>.</span><span>.</span>
              <span>.</span><span>.</span><span>.</span>
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>

          <div className="illustration-card">
            <div className="card-line-item">
              <span className="bullet"></span>
              <span className="line short"></span>
            </div>
            <div className="card-line-item">
              <span className="bullet"></span>
              <span className="line long"></span>
            </div>
            <div className="card-line-item">
              <span className="bullet"></span>
              <span className="line medium"></span>
            </div>
          </div>

          <div className="illustration-code-badge">
            <span>&lt;/&gt;</span>
          </div>

          <div className="illustration-leaves">
            <div className="leaf leaf-1"></div>
            <div className="leaf leaf-2"></div>
            <div className="leaf leaf-3"></div>
          </div>
        </div>
      </section>

      <InputForm onSubmit={handleGenerateSubmit} isGenerating={isGenerating} />
      <StatusPoller currentJob={activeJob} />
      <RecentCheatsheets 
        jobs={jobs} 
        onPreview={onPreviewJob} 
        onDelete={handleDeleteJob}
        onViewAllClick={fetchRecentJobs}
      />
    </div>
  );
}
