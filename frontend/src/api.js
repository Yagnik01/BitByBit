/**
 * Shared API utility
 * All fetch calls go through /api (proxied to http://localhost:5000 in dev)
 */

const BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  /* AUTH */
  login: (email, password) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  signup: (name, email, password) =>
    fetch(`${BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    }),

  /* PROJECTS */
  getAllProjects: () =>
    fetch(`${BASE}/projects/`, { headers: authHeaders() }),

  analyzeProject: (description, budget, timeline) =>
    fetch(`${BASE}/projects/analyze`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ description, budget, timeline }),
    }),

  createProject: (payload) =>
    fetch(`${BASE}/projects/create`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),

  acquireProject: (projectId, freelancerId) =>
    fetch(`${BASE}/projects/acquire/${projectId}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ freelancerId }),
    }),

  getFreelancerProjects: (userId) =>
    fetch(`${BASE}/projects/my-projects/${userId}`, {
      headers: authHeaders(),
    }),
};
