import { getOrCreateGuestId } from '../utils/guestId.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getHeaders(customHeaders = {}, isAuthUser = false) {
  const headers = { ...customHeaders };
  if (!isAuthUser) {
    headers['X-Guest-ID'] = getOrCreateGuestId();
  }
  return headers;
}

// Sends a POST request to trigger a cheatsheet generation job.
export async function generateCheatsheet(data, isAuthUser = false) {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }, isAuthUser),
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.error || errorData.details || 'Failed to start cheatsheet generation.');
    error.code = errorData.code;
    throw error;
  }

  return response.json();
}

// Queries the backend to fetch the status of a specific cheatsheet job.
export async function getJobStatus(jobId, isAuthUser = false) {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    headers: getHeaders({}, isAuthUser),
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error('Failed to retrieve job status.');
  }
  return response.json();
}

// Opens a 1-way Server-Sent Events (SSE) stream for real-time progress updates.
export function subscribeJobStream(jobId, onMessage, onError) {
  const url = `${API_BASE_URL}/jobs/${jobId}/stream`;
  const eventSource = new EventSource(url, { withCredentials: true });

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('Failed to parse SSE event payload:', err);
    }
  };

  eventSource.onerror = (err) => {
    eventSource.close();
    if (onError) onError(err);
  };

  return () => {
    eventSource.close();
  };
}

// Fetches a list of recent cheatsheet generation jobs.
export async function getRecentJobs(isAuthUser = false) {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    headers: getHeaders({}, isAuthUser),
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error('Failed to retrieve recent cheatsheets.');
  }
  return response.json();
}

// Sends a DELETE request to delete a specific cheatsheet job and its PDF file.
export async function deleteJob(jobId, isAuthUser = false) {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: getHeaders({}, isAuthUser),
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error('Failed to delete cheatsheet.');
  }
  return response.json();
}
