"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, Lock } from "lucide-react"

export default function SetupMasterPasswordPage() {
  const router = useRouter()
  const [masterPassword, setMasterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (masterPassword.length < 12) {
      setError("Master password must be at least 12 characters long")
      return
    }

    if (!/[A-Z]/.test(masterPassword)) {
      setError("Master password must contain at least one uppercase letter")
      return
    }

    if (!/[a-z]/.test(masterPassword)) {
      setError("Master password must contain at least one lowercase letter")
      return
    }

    if (!/[0-9]/.test(masterPassword)) {
      setError("Master password must contain at least one number")
      return
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(masterPassword)) {
      setError("Master password must contain at least one special character")
      return
    }

    if (masterPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/user/setup-master-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ masterPassword }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to set master password")
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set master password. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-center">Set Up Master Password</CardTitle>
          <CardDescription className="text-center">
            Create a master password to encrypt and protect your stored passwords
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Your master password is used to encrypt your stored passwords. 
                Make sure it&apos;s strong and memorable - if you forget it, 
                you won&apos;t be able to access your passwords.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter master password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                required
                minLength={12}
              />
              <Input
                type="password"
                placeholder="Confirm master password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={12}
              />
            </div>

            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <p>Your master password must:</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Be at least 12 characters long</li>
                <li>Contain at least one uppercase letter</li>
                <li>Contain at least one lowercase letter</li>
                <li>Contain at least one number</li>
                <li>Contain at least one special character</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Setting up..." : "Set Master Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 