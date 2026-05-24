const BASE = 'https://space-agency.onrender.com/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Token ${getToken()}` } : {}),
});

export const getPlanets = async () => {
  const res = await fetch(`${BASE}/planets/`);
  if (!res.ok) throw new Error('Sayyoralar yuklanmadi');
  return res.json();
};

export const register = async (data) => {
  const res = await fetch(`${BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
};

export const login = async (data) => {
  const res = await fetch(`${BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
};

export const createBooking = async (data) => {
  const res = await fetch(`${BASE}/bookings/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
};

export const getMyBookings = async () => {
  const res = await fetch(`${BASE}/bookings/`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Bronlar yuklanmadi');
  return res.json();
};
