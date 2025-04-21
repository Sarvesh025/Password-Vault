import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow as formatDistance } from "date-fns"
import { toast } from "@/components/ui/toast-provider"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return format(new Date(date), "MMM d, yyyy")
}

export function formatTimeAgo(date: string) {
  return formatDistance(new Date(date))
}

export function handleFetchError(error: unknown): never {
  if (error instanceof Response) {
    if (error.status === 401) {
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
      throw new Error('Unauthorized')
    }
    throw new Error(`HTTP error! status: ${error.status}`)
  }
  if (error instanceof Error) {
    throw error
  }
  throw new Error('An unknown error occurred')
}

// utils/api.ts
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

