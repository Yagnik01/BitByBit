/**
 * Centralised API client
 */
const BASE = "/api";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleRes = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

export const api = {
  // ── AUTH ─────────────────────────────────────────────────────────────────
  login:  (email, password) =>
    fetch(`${BASE}/auth/login`,  { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({email,password}) }).then(handleRes),
  signup: (name, email, password) =>
    fetch(`${BASE}/auth/signup`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({name,email,password}) }).then(handleRes),

  // ── PROJECTS ─────────────────────────────────────────────────────────────
  getAllProjects:      (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${BASE}/projects/${qs ? "?"+qs : ""}`, { headers: authHeaders() }).then(handleRes);
  },
  getProjectById:     (id)          => fetch(`${BASE}/projects/${id}`,           { headers: authHeaders() }).then(handleRes),
  createProject:      (payload)     => fetch(`${BASE}/projects/create`,           { method:"POST", headers: authHeaders(), body: JSON.stringify(payload) }).then(handleRes),
  updateProject:      (id, payload) => fetch(`${BASE}/projects/${id}`,            { method:"PUT",  headers: authHeaders(), body: JSON.stringify(payload) }).then(handleRes),
  analyzeProject:     (desc, budget, timeline) =>
    fetch(`${BASE}/projects/analyze`, { method:"POST", headers: authHeaders(), body: JSON.stringify({description:desc, budget, timeline}) }).then(handleRes),
  applyToProject:     (id, coverLetter, bidAmount) =>
    fetch(`${BASE}/projects/${id}/apply`, { method:"POST", headers: authHeaders(), body: JSON.stringify({coverLetter, bidAmount}) }).then(handleRes),
  acceptApplication:  (projectId, applicationId) =>
    fetch(`${BASE}/projects/${projectId}/accept/${applicationId}`, { method:"POST", headers: authHeaders() }).then(handleRes),
  getMyProjects:      (userId)      => fetch(`${BASE}/projects/my-projects/${userId}`,      { headers: authHeaders() }).then(handleRes),
  getEmployerProjects:(userId)      => fetch(`${BASE}/projects/employer-projects/${userId}`,{ headers: authHeaders() }).then(handleRes),

  // ── MILESTONES ────────────────────────────────────────────────────────────
  getMilestones:      (projectId)   => fetch(`${BASE}/milestones/${projectId}`,             { headers: authHeaders() }).then(handleRes),
  submitMilestone:    (projectId, milestoneId, payload) =>
    fetch(`${BASE}/milestones/${projectId}/${milestoneId}/submit`, { method:"POST", headers: authHeaders(), body: JSON.stringify(payload) }).then(handleRes),
  getWallet:          ()            => fetch(`${BASE}/milestones/wallet`,                   { headers: authHeaders() }).then(handleRes),
  getTransactions:    ()            => fetch(`${BASE}/milestones/transactions`,              { headers: authHeaders() }).then(handleRes),

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────
  getNotifications:   ()   => fetch(`${BASE}/notifications/`,            { headers: authHeaders() }).then(handleRes),
  getUnreadCount:     ()   => fetch(`${BASE}/notifications/unread-count`, { headers: authHeaders() }).then(handleRes),
  markAllRead:        ()   => fetch(`${BASE}/notifications/read-all`,     { method:"PUT", headers: authHeaders() }).then(handleRes),
  markNotifRead:      (id) => fetch(`${BASE}/notifications/${id}/read`,   { method:"PUT", headers: authHeaders() }).then(handleRes),

  // ── CHAT ──────────────────────────────────────────────────────────────────
  getConversations:        ()                        => fetch(`${BASE}/chat/conversations`,                   { headers: authHeaders() }).then(handleRes),
  getOrCreateConversation: (projectId, otherUserId)  =>
    fetch(`${BASE}/chat/conversations`, { method:"POST", headers: authHeaders(), body: JSON.stringify({projectId, otherUserId}) }).then(handleRes),
  getMessages:     (convId, page=1) => fetch(`${BASE}/chat/conversations/${convId}/messages?page=${page}`, { headers: authHeaders() }).then(handleRes),
  sendMessage:     (convId, content) =>
    fetch(`${BASE}/chat/conversations/${convId}/messages`, { method:"POST", headers: authHeaders(), body: JSON.stringify({content}) }).then(handleRes),

  // ── USER PROFILE ──────────────────────────────────────────────────────────
  getMyProfile:    ()        => fetch(`${BASE}/users/profile`,   { headers: authHeaders() }).then(handleRes),
  updateProfile:   (payload) => fetch(`${BASE}/users/profile`,   { method:"PUT", headers: authHeaders(), body: JSON.stringify(payload) }).then(handleRes),
};
