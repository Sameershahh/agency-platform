import { API_BASE_URL, apiRequest } from "./api";

/**
 * Log in a user. Uses HttpOnly cookies (access_token, refresh_token).
 */
export async function loginUser(email: string, password: string) {
  return apiRequest("/api/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Register a user.
 */
export async function registerUser(email: string, full_name: string, password1: string, password2: string) {
  return apiRequest("/api/register/", {
    method: "POST",
    body: JSON.stringify({ email, full_name, password: password1, confirm_password: password2 }),
  });
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