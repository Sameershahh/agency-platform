import { API_BASE_URL } from "./api";

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Invalid login credentials");
  }

  const data = await res.json();
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export async function registerUser(email: string, password1: string, password2: string) {
  const res = await fetch(`${API_BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password1, password2 }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Registration failed");
  }

  const data = await res.json();
  return data;
}


export async function loginUser(username: string, password: string) {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await res.json();

    // Store tokens in localStorage
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);

    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}