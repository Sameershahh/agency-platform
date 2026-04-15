import { API_BASE_URL, apiRequest } from "./api";

/**
 * Log in a user. Uses HttpOnly cookies (access_token, refresh_token).
 */
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", 
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Invalid login credentials");
  }

  const data = await res.json();
  // Tokens are now set in HttpOnly cookies by the backend.
  // Note: localStorage.setItem is no longer used for access/refresh tokens.
  return data;
}

/**
 * Register a user.
 */
export async function registerUser(email: string, full_name: string, password1: string, password2: string) {
  const res = await fetch(`${API_BASE_URL}/api/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, full_name, password: password1, confirm_password: password2 }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || JSON.stringify(err) || "Registration failed");
  }

  const data = await res.json();
  return data;
}

/**
 * Log out the user and clear cookies.
 */
export async function logoutUser() {
  return apiRequest("/api/logout/", { method: "POST" });
}

/**
 * Check if the user is authenticated by calling the /me/ endpoint.
 */
export async function checkAuthStatus() {
  try {
    return await apiRequest("/api/me/");
  } catch (error) {
    console.debug("Check auth status failed:", error);
    return null;
  }
}