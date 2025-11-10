  "use client";

  export const API_BASE_URL = "http://127.0.0.1:8000/api/"; 

  async function refreshToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) throw new Error("No refresh token");

    const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
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

    let res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    // If access token expired → refresh
    if (res.status === 401 && localStorage.getItem("refresh")) {
      try {
        const newAccess = await refreshToken();
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${newAccess}`,
        };
        res = await fetch(`${API_BASE_URL}${endpoint}`, {
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


  export async function verifyEmailCode(email: string, code: string) {
    const res = await fetch(`http://127.0.0.1:8000/api/verify-email/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    // Try safely parsing the response
    let data;
    try {
      data = await res.json();
    } catch {
      const text = await res.text();
      throw new Error(`Server returned non-JSON response: ${text.slice(0, 200)}`);
    }

    if (!res.ok) {
      throw new Error(data.detail || data.message || "Invalid code");
    }

    return data;
  }

  export async function resendVerificationCode(email: string) {
    const res = await fetch(`http://127.0.0.1:8000/api/resend-verification/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.message || "Failed to resend code");
    return data;
  }


  export async function requestPasswordReset(email: string) {
    const res = await fetch(`http://127.0.0.1:8000/api/password-reset-request/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.message || "Failed to send reset link");
    return data;
  }

  //  Confirm password reset
 export async function confirmPasswordReset(data: { token: string; new_password: string }) {
  const res = await fetch(`http://127.0.0.1:8000/api/password-reset-confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || result.message || "Failed to reset password");
  return result;
}


  export async function sendChatMessage(message: string) {
    const res = await fetch(`http://127.0.0.1:8000/api/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to send message");
    }

    return res.json(); // Expected to return { reply: "..." }
  }
