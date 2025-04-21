export interface Password {
  id: string
  name: string
  accountName: string
  password: string
  url?: string
  category: "device" | "application"
  createdAt?: string
  updatedAt?: string
  lastViewed?: string
  userId?: number
  tenantId?: number
  user?: {
    id: number
    email: string
    name: string
  }
}

export interface User {
  id: string
  email: string
  createdAt: string
}

