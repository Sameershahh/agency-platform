"use client";

const API_BASE = "http://127.0.0.1:8000/api/"; 

async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${API_BASE}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");
  const data = await res.json();
  localStorage.setItem("access", data.access);
  return data.access;
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const access = localStorage.getItem("access");
  const headers = {
    "Content-Type": "application/json",
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
    ...(options.headers || {}),
  };

  let res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  // If access token expired → refresh
  if (res.status === 401 && localStorage.getItem("refresh")) {
    try {
      const newAccess = await refreshToken();
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${newAccess}`,
      };
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: retryHeaders,
      });
    } catch {
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "API request failed");
  }

  return res.json();
}
