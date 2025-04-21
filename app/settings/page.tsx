"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { checkAuth, getCurrentUser, verifyMasterPassword } from "@/lib/auth"
import { toast } from "@/components/ui/toast-provider"
import { User, Shield, Bell, Lock, Sun, Moon, Laptop } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email: string; createdAt: string } | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [mounted, setMounted] = useState(false)

  // This useEffect ensures we only access theme on the client side
  // to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
          router.push("/login")
          return
        }

        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Settings initialization error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long")
      return
    }

    try {
      const isValid = await verifyMasterPassword(currentPassword)
      if (!isValid) {
        setError("Current password is incorrect")
        return
      }

      // In a real app, you would update the password here
      // For this demo, we'll just show a success message
      setSuccess("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password updated successfully")
    } catch (err) {
      setError("Failed to change password")
      console.error(err)
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    toast.success(`Theme changed to ${newTheme}`)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader activeTab="passwords" onTabChange={(tab) => router.push(`/dashboard?tab=${tab}`)} />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} readOnly />
                  <p className="text-sm text-muted-foreground">Your email is used for login and account recovery</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-since">Member Since</Label>
                  <Input
                    id="member-since"
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
                    readOnly
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled>Update Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Master Password</CardTitle>
                <CardDescription>Update your master password used to encrypt your vault</CardDescription>
              </CardHeader>
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  {success && <p className="text-sm text-green-600">{success}</p>}
                </CardContent>
                <CardFooter>
                  <Button type="submit">Change Password</Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require a verification code when logging in</p>
                  </div>
                  <Switch disabled />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled>
                  <Lock className="mr-2 h-4 w-4" />
                  Setup 2FA
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize the appearance of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {mounted && (
                  <div className="space-y-4">
                    <Label className="text-base">Theme Mode</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:bg-accent ${theme === "light" ? "border-primary bg-accent" : ""}`}
                        onClick={() => handleThemeChange("light")}
                      >
                        <div className="rounded-full bg-primary/10 p-2">
                          <Sun className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">Light</span>
                      </div>

                      <div
                        className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:bg-accent ${theme === "dark" ? "border-primary bg-accent" : ""}`}
                        onClick={() => handleThemeChange("dark")}
                      >
                        <div className="rounded-full bg-primary/10 p-2">
                          <Moon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">Dark</span>
                      </div>

                      <div
                        className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:bg-accent ${theme === "system" ? "border-primary bg-accent" : ""}`}
                        onClick={() => handleThemeChange("system")}
                      >
                        <div className="rounded-full bg-primary/10 p-2">
                          <Laptop className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">System</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts about suspicious activity</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Password Expiry Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get notified when passwords are older than 90 days</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

