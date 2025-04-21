"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { PasswordList } from "@/components/password-list"
import { PasswordGenerator } from "@/components/password-generator"
import { SecurityDashboard } from "@/components/security-dashboard"
import { DashboardHeader } from "@/components/dashboard-header"
import { Password, getPasswords, createPassword } from '@/lib/passwords'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "passwords"
  const [passwords, setPasswords] = useState<Password[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pageTitle, setPageTitle] = useState("Password Vault")

  useEffect(() => {
    const checkMasterPassword = async () => {
      try {
        const response = await fetch("/api/user/check-master-password")
        if (!response.ok) {
          // If user hasn't set up master password, redirect to setup page
          router.push("/setup-master-password")
          return
        }
        const data = await response.json();
        if(data.hasMasterPassword){
          loadPasswords()
        }
        else{
          router.push("/setup-master-password")
        }
      } catch (error) {
        console.error("Error checking master password:", error)
        setError("Failed to verify master password setup")
      }
    }

    checkMasterPassword()
  }, [])

  const loadPasswords = async () => {
    try {
      setLoading(true)
      const data = await getPasswords()
      setPasswords(data)
      setError("")
    } catch (err) {
      setError("Failed to load passwords")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Update page title based on active tab
    switch (tab) {
      case "generator":
        setPageTitle("Password Generator")
        break
      case "security":
        setPageTitle("Security Dashboard")
        break
      default:
        setPageTitle("Password Vault")
    }
  }, [tab])

  const handleTabChange = (value: string) => {
    router.push(`/dashboard?tab=${value}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader activeTab={tab} onTabChange={handleTabChange} />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
        </div>
        <Tabs value={tab} onValueChange={handleTabChange} className="space-y-4">
          <TabsContent value="passwords" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <span className="ml-2">Loading passwords...</span>
              </div>
            ) : error ? (
              <div className="text-center p-4 text-red-500 bg-red-50 rounded-lg">
                {error}
              </div>
            ) : (
              <PasswordList passwords={passwords} setPasswords={setPasswords} />
            )}
          </TabsContent>
          <TabsContent value="generator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Strong Passwords</CardTitle>
                <CardDescription>Generate secure, unique passwords for your accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordGenerator setPasswords={setPasswords} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security" className="space-y-4">
            <SecurityDashboard passwords={passwords} setPasswords={setPasswords} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

