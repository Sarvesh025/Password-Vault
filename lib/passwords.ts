// This is a mock implementation for demo purposes
// In a real app, you would use proper encryption and secure storage

import type { Password } from "./types"
export type { Password }
import { getCurrentUser, verifyMasterPassword } from "./auth"
import { handleFetchError } from "./utils"

// Mock password storage
const passwordsByUser: Record<string, Password[]> = {}

export async function getPasswords(): Promise<Password[]> {
  try {
    const response = await fetch('/api/passwords', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw response;
    }

    return response.json();
  } catch (error) {
    await handleFetchError(error);
    return [];
  }
}

export async function addPassword(
  name: string,
  accountName: string,
  password: string,
  category: "device" | "application" = "application",
): Promise<Password> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Not authenticated")
  }

  // Initialize user's password array if it doesn't exist
  if (!passwordsByUser[user.id]) {
    passwordsByUser[user.id] = []
  }

  const existingPasswords = passwordsByUser[user.id]

  // Check for duplicates based on category
  if (category === "device") {
    // For devices, check if device name already exists
    const deviceExists = existingPasswords.some(
      (p) => p.category === "device" && p.name.toLowerCase() === name.toLowerCase(),
    )

    if (deviceExists) {
      throw new Error("A device with this name already exists")
    }
  } else {
    // For applications, check if application name + account name combination already exists
    const accountExists = existingPasswords.some(
      (p) =>
        p.category === "application" &&
        p.name.toLowerCase() === name.toLowerCase() &&
        p.accountName.toLowerCase() === accountName.toLowerCase(),
    )

    if (accountExists) {
      throw new Error("An account with this application name and account name already exists")
    }
  }

  const now = new Date().toISOString()

  const newPassword: Password = {
    id: Math.random().toString(36).substring(2, 15),
    name,
    accountName,
    password,
    category,
    createdAt: now,
    updatedAt: now,
  }

  passwordsByUser[user.id].push(newPassword)

  return newPassword
}

export async function deletePassword(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/passwords/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw response;
    }
  } catch (error) {
    await handleFetchError(error);
    throw error;
  }
}

export async function viewPassword(id: string): Promise<Password> {
  try {
    const response = await fetch(`/api/passwords/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw response;
    }

    return response.json();
  } catch (error) {
    await handleFetchError(error);
    throw error;
  }
}

export async function updatePassword(id: string, newPassword: string): Promise<Password> {
  try {
    const response = await fetch(`/api/passwords/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: newPassword })
    });

    console.log("Response : -", response);

    if (!response.ok) {
      throw response;
    }

    return response.json();
  } catch (error) {
    await handleFetchError(error);
    throw error;
  }
}

export async function createPassword(passwordData: Omit<Password, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'tenantId' | 'user'>): Promise<Password> {
  try {
    const response = await fetch('/api/passwords', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      throw response;
    }

    return response.json();
  } catch (error) {
    await handleFetchError(error);
    throw error;
  }
}

export async function getPasswordHistory(id: string): Promise<Array<{ id: number; value: string; createdAt: string; passwordId: number }>> {
  try {
    const response = await fetch(`/api/passwords/${id}/history`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw response;
    }

    return response.json();
  } catch (error) {
    await handleFetchError(error);
    throw error;
  }
}

