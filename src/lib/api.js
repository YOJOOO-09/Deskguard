export const API_BASE = 'http://localhost:4000';
export const WS_BASE = 'ws://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const fetchDesks = () => request('/api/desks');
export const fetchActivity = () => request('/api/activity');
export const fetchQueue = (studentId) => request(`/api/queue?studentId=${encodeURIComponent(studentId)}`);

export const joinQueue = (studentId, name) =>
  request('/api/queue/join', { method: 'POST', body: JSON.stringify({ studentId, name }) });

export const leaveQueue = (studentId) =>
  request('/api/queue/leave', { method: 'POST', body: JSON.stringify({ studentId }) });

export const checkInDesk = (deskId, studentId, name) =>
  request(`/api/desks/${deskId}/checkin`, { method: 'POST', body: JSON.stringify({ studentId, name }) });

export const checkOutDesk = (deskId) => request(`/api/desks/${deskId}/checkout`, { method: 'POST' });

export const markDeskAway = (deskId) => request(`/api/desks/${deskId}/away`, { method: 'POST' });

export const markDeskBack = (deskId) => request(`/api/desks/${deskId}/back`, { method: 'POST' });

export const claimDesk = (deskId, studentId, name) =>
  request(`/api/desks/${deskId}/claim`, { method: 'POST', body: JSON.stringify({ studentId, name }) });

export const findCluster = (count, floorIndex = null) =>
  request('/api/group-booking/find', { method: 'POST', body: JSON.stringify({ count, floorIndex }) });

export const reserveCluster = (deskIds, members) =>
  request('/api/group-booking/reserve', { method: 'POST', body: JSON.stringify({ deskIds, members }) });
