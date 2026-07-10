// Central API client — all calls to the Express backend go through here.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("bathease:token");
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export const api = {
  // POST /api/auth/login
  login: (email, password) =>
    request("POST", "/auth/login", { email, password }),

  // POST /api/auth/register
  register: (name, email, password) =>
    request("POST", "/auth/register", { name, email, password }),

  // POST /api/auth/forgot-password
  forgotPassword: (email) =>
    request("POST", "/auth/forgot-password", { email }),

  // POST /api/auth/reset-password
  resetPassword: (email, otp, newPassword) =>
    request("POST", "/auth/reset-password", { email, otp, newPassword }),

  // GET /api/auth/me
  me: () => request("GET", "/auth/me"),

  // ─── Users ──────────────────────────────────────────────────────────────

  // GET /api/users  (admin only)
  allUsers: () => request("GET", "/users"),

  // PUT /api/users/profile
  updateProfile: (patch) => request("PUT", "/users/profile", patch),

  // ─── Content (admin managed) ────────────────────────────────────────────

  // GET /api/content/:type  — public
  getContent: (type) => request("GET", `/content/${type}`),

  // PUT /api/content/:type  — admin only
  saveContent: (type, items) => request("PUT", `/content/${type}`, { items }),

  // POST /api/bookings
  createBooking: (bookingData) => request("POST", "/bookings", bookingData),

  // GET /api/bookings/my
  myBookings: () => request("GET", "/bookings/my"),

  // GET /api/bookings  (admin only)
  allBookings: () => request("GET", "/bookings"),

  // PUT /api/bookings/:id  (admin: update status / staff)
  updateBooking: (id, patch) => request("PUT", `/bookings/${id}`, patch),

  // PUT /api/bookings/:id/cancel
  cancelBooking: (id) => request("PUT", `/bookings/${id}/cancel`),

  // PUT /api/bookings/:id/review
  reviewBooking: (id, rating, comment) =>
    request("PUT", `/bookings/${id}/review`, { rating, comment }),
};

// ─── Session helpers (token stored in localStorage) ──────────────────────────

export const session = {
  save: (userData) => {
    localStorage.setItem("bathease:token", userData.token);
    localStorage.setItem("bathease:user", JSON.stringify(userData));
  },
  clear: () => {
    localStorage.removeItem("bathease:token");
    localStorage.removeItem("bathease:user");
  },
  getUser: () => {
    try {
      const raw = localStorage.getItem("bathease:user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  updateUser: (patch) => {
    const current = session.getUser();
    if (!current) return;
    localStorage.setItem("bathease:user", JSON.stringify({ ...current, ...patch }));
  },
  isLoggedIn: () => !!localStorage.getItem("bathease:token"),
};
