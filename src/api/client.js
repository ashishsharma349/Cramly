const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Sends a POST request to trigger a cheatsheet generation job.
export async function generateCheatsheet(data) {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
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
export async function getJobStatus(jobId) {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, { credentials: 'include' });
  if (!response.ok) {
    throw new Error('Failed to retrieve job status.');
  }
  return response.json();
}

// Fetches a list of recent cheatsheet generation jobs.
export async function getRecentJobs() {
  const response = await fetch(`${API_BASE_URL}/jobs`, { credentials: 'include' });
  if (!response.ok) {
    throw new Error('Failed to retrieve recent cheatsheets.');
  }
  return response.json();
}

// Sends a DELETE request to delete a specific cheatsheet job and its PDF file.
export async function deleteJob(jobId) {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error('Failed to delete cheatsheet.');
  }
  return response.json();
}
