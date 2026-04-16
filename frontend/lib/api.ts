"use client";

// Ensure the API URL has a protocol and no trailing slash
const rawUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
export const API_BASE_URL = (rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`).replace(/\/$/, "");

if (typeof window !== "undefined") {
  console.log("🚀 NeuraStack API Base:", API_BASE_URL);
}

async function refreshToken() {
  const res = await fetch(`${API_BASE_URL}/api/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // With credentials 'include', the backend will read the refresh token from the cookie
    // and set a new access token in the cookie.
    body: JSON.stringify({}), 
  });

  if (!res.ok) throw new Error("Failed to refresh token");
  return true;
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Always include credentials to send/receive cookies
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include", 
  };

  // Ensure endpoint has a trailing slash for Django
  const cleanEndpoint = endpoint.endsWith("/") ? endpoint : `${endpoint}/`;
  
  let res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, { ...fetchOptions });

  // If 401, try to refresh once
  if (res.status === 401) {
    try {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry with same options
        res = await fetch(`${API_BASE_URL}${endpoint}`, { ...fetchOptions });
      }
    } catch {
      // Refresh failed, possibly clear any client state or redirect to login
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    const err = await res.text();
    let errorMsg = "API request failed";
    try {
      const jsonErr = JSON.parse(err);
      errorMsg = jsonErr.detail || jsonErr.message || errorMsg;
    } catch {
      errorMsg = err || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export async function getCurrentUser() {
  return apiRequest("/api/me/");
}

export async function verifyEmailCode(email: string, code: string) {
  return apiRequest("/api/verify-email/", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function resendVerificationCode(email: string) {
  return apiRequest("/api/resend-verification/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function requestPasswordReset(email: string) {
  return apiRequest("/api/password-reset-request/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyPasswordResetToken(token: string) {
  return apiRequest(`/api/password-reset-verify/${token}/`, {
    method: "GET",
  });
}

export async function confirmPasswordReset(data: { 
  token?: string; 
  code?: string; 
  new_password: string 
}) {
  return apiRequest("/api/password-reset-confirm/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function sendChatMessage(
  message: string,
  history: Array<{ role: string; text: string }> = []
) {
  const res = await fetch(`${API_BASE_URL}/api/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || "Failed to reach AI assistant.");
  }

  return res.json();
}
