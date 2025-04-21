// This is a mock implementation for demo purposes
// In a real app, you would use a proper authentication library and encryption

import type { User } from "./types"
import { handleFetchError } from "./utils"

// Mock storage
let currentUser: User | null = null

// Mock user database
const users: Record<string, { id: string; email: string; password: string; createdAt: string; provider?: string }> = {}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find(row => row.startsWith('access_token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
}

export async function createUser(email: string, password: string, name?: string): Promise<User> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Registration failed');
    }

    const data = await response.json();
    // Store access token in cookie
    document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; secure; samesite=strict`;
    return data.user;
  } catch (error) {
    await handleFetchError(error);
    throw error;
  }
}

export async function createUserWithGoogle(): Promise<User> {
  // This is a mock implementation
  // In a real app, you would use the Google OAuth API
  const id = Math.random().toString(36).substring(2, 15)
  const now = new Date().toISOString()
  const email = `user${id}@gmail.com` // Mock email

  users[id] = {
    id,
    email,
    password: "", // No password for Google auth
    createdAt: now,
    provider: "google",
  }

  // Set the current user
  currentUser = {
    id,
    email,
    createdAt: now,
  }

  // In a real app, you would store a session token in a secure HTTP-only cookie
  localStorage.setItem("userId", id)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return currentUser
}

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Login failed');
    }

    const data = await response.json();
    // Store access token in cookie
    document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; secure; samesite=strict`;
    return data.user;
  } catch (error) {
    await handleFetchError(error);
    throw error;
  }
}

export async function loginWithGoogle(): Promise<User> {
  // This is a mock implementation
  // In a real app, you would use the Google OAuth API

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo purposes, we'll create a new user if one doesn't exist
  const existingUser = Object.values(users).find((u) => u.provider === "google")

  if (existingUser) {
    currentUser = {
      id: existingUser.id,
      email: existingUser.email,
      createdAt: existingUser.createdAt,
    }

    localStorage.setItem("userId", existingUser.id)
    return currentUser
  }

  // If no Google user exists, create one
  return createUserWithGoogle()
}

export async function logoutUser(): Promise<void> {
  try {
    // Call the logout API endpoint
    const response = await fetch('/api/auth/logout');
    
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    
    // Clear localStorage
    localStorage.clear();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return response.json();
  } catch (error) {
    return null;
  }
}

export async function checkAuth(): Promise<boolean> {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const response = await fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function verifyMasterPassword(password: string): Promise<boolean> {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const response = await fetch('/api/auth/passwords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      throw new Error('Password verification failed');
    }

    const data = await response.json();
    return data.isMatch;
  } catch (error) {
    await handleFetchError(error);
    return false;
  }
}

export async function updateMasterPassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const response = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!response.ok) {
      throw new Error('Password update failed');
    }

    return true;
  } catch (error) {
    await handleFetchError(error);
    return false;
  }
}

