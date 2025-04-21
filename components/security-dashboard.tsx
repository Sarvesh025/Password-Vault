"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Password } from "@/lib/types"
import { AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react"
import { ChartContainer, ChartTitle, ChartLegend, Chart } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { PasswordListModal } from "@/components/password-list-modal"
import { PasswordFixModal } from "@/components/password-fix-modal"
import { updatePassword } from "@/lib/passwords"
import { toast } from "@/components/ui/toast-provider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"

interface SecurityDashboardProps {
  passwords: Password[]
  setPasswords: React.Dispatch<React.SetStateAction<Password[]>>
}

export function SecurityDashboard({ passwords, setPasswords }: SecurityDashboardProps) {
  const [securityScore, setSecurityScore] = useState(0)
  const [weakPasswords, setWeakPasswords] = useState<Password[]>([])
  const [oldPasswords, setOldPasswords] = useState<Password[]>([])
  const [duplicatePasswords, setDuplicatePasswords] = useState<Password[]>([])
  const [strengthDistribution, setStrengthDistribution] = useState<any[]>([])
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([])

  // State for modals
  const [listModalOpen, setListModalOpen] = useState(false)
  const [listModalType, setListModalType] = useState<"weak" | "old" | "duplicate">("weak")
  const [fixModalOpen, setFixModalOpen] = useState(false)
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null)

  const [masterPassword, setMasterPassword] = useState("")
  const [verifyMasterPasswordOpen, setVerifyMasterPasswordOpen] = useState(false)
  const [passwordToFix, setPasswordToFix] = useState<Password | null>(null)

  useEffect(() => {
    // Calculate security metrics
    if (passwords.length === 0) {
      setSecurityScore(0)
      setWeakPasswords([])
      setOldPasswords([])
      setDuplicatePasswords([])
      setStrengthDistribution([])
      setCategoryDistribution([])
      return
    }

    // Find weak passwords (simplified logic)
    const weak = passwords.filter((p) => {
      const hasUppercase = /[A-Z]/.test(p.password)
      const hasLowercase = /[a-z]/.test(p.password)
      const hasNumber = /[0-9]/.test(p.password)
      const hasSymbol = /[^a-zA-Z0-9]/.test(p.password)
      const isLongEnough = p.password.length >= 12

      // Consider weak if it doesn't meet at least 3 criteria
      const criteria = [hasUppercase, hasLowercase, hasNumber, hasSymbol, isLongEnough]
      return criteria.filter(Boolean).length < 3
    })

    // Find old passwords (older than 90 days)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    const old = passwords.filter((p) => {
      if (!p.createdAt) return false
      const createdDate = new Date(p.createdAt)
      return createdDate < ninetyDaysAgo
    })

    // Find duplicate passwords
    const passwordMap = new Map()
    const duplicates: Password[] = []

    passwords.forEach((p) => {
      if (passwordMap.has(p.password)) {
        duplicates.push(p)
      } else {
        passwordMap.set(p.password, true)
      }
    })

    // Calculate overall security score
    const totalIssues = weak.length + old.length + duplicates.length
    const maxPossibleIssues = passwords.length * 3 // worst case: all passwords have all issues
    const score = Math.max(0, 100 - (totalIssues / maxPossibleIssues) * 100)

    // Calculate strength distribution
    const strengthCounts = {
      weak: 0,
      moderate: 0,
      strong: 0,
      veryStrong: 0,
    }

    passwords.forEach((p) => {
      // Simplified strength calculation
      const hasUppercase = /[A-Z]/.test(p.password)
      const hasLowercase = /[a-z]/.test(p.password)
      const hasNumber = /[0-9]/.test(p.password)
      const hasSymbol = /[^a-zA-Z0-9]/.test(p.password)
      const isLongEnough = p.password.length >= 12

      const criteria = [hasUppercase, hasLowercase, hasNumber, hasSymbol, isLongEnough]
      const metCriteria = criteria.filter(Boolean).length

      if (metCriteria <= 2) strengthCounts.weak++
      else if (metCriteria === 3) strengthCounts.moderate++
      else if (metCriteria === 4) strengthCounts.strong++
      else strengthCounts.veryStrong++
    })

    const distribution = [
      { name: "Weak", value: strengthCounts.weak, color: "#ef4444" },
      { name: "Moderate", value: strengthCounts.moderate, color: "#f97316" },
      { name: "Strong", value: strengthCounts.strong, color: "#10b981" },
      { name: "Very Strong", value: strengthCounts.veryStrong, color: "#059669" },
    ].filter((item) => item.value > 0)

    // Add category distribution data
    const devicePasswords = passwords.filter((p) => p.category === "device").length
    const applicationPasswords = passwords.filter((p) => p.category === "application").length

    const categoryDistribution = [
      { name: "Devices", value: devicePasswords, color: "#3b82f6" },
      { name: "Applications", value: applicationPasswords, color: "#8b5cf6" },
    ].filter((item) => item.value > 0)

    setSecurityScore(Math.round(score))
    setWeakPasswords(weak)
    setOldPasswords(old)
    setDuplicatePasswords(duplicates)
    setStrengthDistribution(distribution)
    setCategoryDistribution(categoryDistribution)
  }, [passwords])

  // Data for the password age chart
  const getPasswordAgeData = () => {
    const ageGroups = {
      "0-30 days": 0,
      "31-90 days": 0,
      "91-180 days": 0,
      "181+ days": 0,
    }

    passwords.forEach((p) => {
      if (!p.createdAt) return

      const createdDate = new Date(p.createdAt)
      const ageInDays = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24))

      if (ageInDays <= 30) ageGroups["0-30 days"]++
      else if (ageInDays <= 90) ageGroups["31-90 days"]++
      else if (ageInDays <= 180) ageGroups["91-180 days"]++
      else ageGroups["181+ days"]++
    })

    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }))
  }

  const openListModal = (type: "weak" | "old" | "duplicate") => {
    setListModalType(type)
    setListModalOpen(true)
  }

  const handleFixPassword = (password: Password) => {
    setPasswordToFix(password)
    setListModalOpen(false)
    setVerifyMasterPasswordOpen(true)
  }

  const handleVerifyMasterPassword = async () => {
    try {
      const response = await fetch('/api/user/check-master-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ masterPassword })
      });

      if (!response.ok) {
        throw new Error('Invalid master password');
      }

      // If verification successful, open the fix modal
      setSelectedPassword(passwordToFix);
      setVerifyMasterPasswordOpen(false);
      setMasterPassword("");
      setTimeout(() => {
        setFixModalOpen(true);
      }, 100);
    } catch (error) {
      console.error('Error verifying master password:', error);
      toast.error('Invalid master password');
    }
  }

  const handleSavePassword = async (id: string, newPassword: string) => {
    try {
      const updatedPassword = await updatePassword(id, newPassword)

      // Update passwords state with the new password
      setPasswords((prevPasswords) => 
        prevPasswords.map((p) => (p.id === updatedPassword.id ? updatedPassword : p))
      )

      // Close the fix modal
      setFixModalOpen(false)
      
      // Reset the selected password
      setSelectedPassword(null)

      // Show success message
      toast.success("Password updated successfully")

      // Force a re-render to update security metrics
      setPasswords((prev) => [...prev])
    } catch (error) {
      toast.error("Failed to update password")
      console.error("Error updating password:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityScore}%</div>
            <p className="text-xs text-muted-foreground">
              {securityScore >= 80
                ? "Excellent security"
                : securityScore >= 60
                  ? "Good security"
                  : securityScore >= 40
                    ? "Fair security"
                    : "Poor security"}
            </p>
          </CardContent>
        </Card>

        <Card
          className={weakPasswords.length > 0 ? "cursor-pointer hover:bg-muted/50" : ""}
          onClick={() => weakPasswords.length > 0 && openListModal("weak")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weak Passwords</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weakPasswords.length}</div>
            <p className="text-xs text-muted-foreground">
              {weakPasswords.length === 0
                ? "No weak passwords found"
                : `${Math.round((weakPasswords.length / passwords.length) * 100)}% of your passwords are weak`}
            </p>
          </CardContent>
        </Card>

        <Card
          className={oldPasswords.length > 0 ? "cursor-pointer hover:bg-muted/50" : ""}
          onClick={() => oldPasswords.length > 0 && openListModal("old")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Old Passwords</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{oldPasswords.length}</div>
            <p className="text-xs text-muted-foreground">
              {oldPasswords.length === 0
                ? "All passwords are up to date"
                : `${oldPasswords.length} passwords older than 90 days`}
            </p>
          </CardContent>
        </Card>

        <Card
          className={duplicatePasswords.length > 0 ? "cursor-pointer hover:bg-muted/50" : ""}
          onClick={() => duplicatePasswords.length > 0 && openListModal("duplicate")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duplicate Passwords</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="8" height="8" x="2" y="2" rx="2" />
              <path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
              <path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
              <path d="M8 14c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2" />
              <path d="M14 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
              <path d="M20 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
              <rect width="8" height="8" x="2" y="14" rx="2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{duplicatePasswords.length}</div>
            <p className="text-xs text-muted-foreground">
              {duplicatePasswords.length === 0
                ? "No duplicate passwords"
                : `${duplicatePasswords.length} passwords are duplicated`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rest of the component remains unchanged */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Password Strength Distribution</CardTitle>
            <CardDescription>Breakdown of your password strength categories</CardDescription>
          </CardHeader>
          <CardContent>
            {strengthDistribution.length > 0 ? (
              <div className="h-80">
                <ChartContainer>
                  <ChartTitle>Password Strength</ChartTitle>
                  <Chart>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={strengthDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {strengthDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Chart>
                  <ChartLegend>
                    <div className="flex flex-wrap gap-4">
                      {strengthDistribution.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-sm">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </ChartLegend>
                </ChartContainer>
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Password Age</CardTitle>
            <CardDescription>How old are your passwords?</CardDescription>
          </CardHeader>
          <CardContent>
            {passwords.length > 0 ? (
              <div className="h-80">
                <ChartContainer>
                  <ChartTitle>Password Age Distribution</ChartTitle>
                  <Chart>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getPasswordAgeData()}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Chart>
                </ChartContainer>
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Password Categories</CardTitle>
            <CardDescription>Distribution of passwords by category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryDistribution.length > 0 ? (
              <div className="h-80">
                <ChartContainer>
                  <ChartTitle>Category Distribution</ChartTitle>
                  <Chart>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Chart>
                  <ChartLegend>
                    <div className="flex flex-wrap gap-4">
                      {categoryDistribution.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-sm">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </ChartLegend>
                </ChartContainer>
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Security Tips</h3>
        <div className="space-y-2">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Use unique passwords for each account</AlertTitle>
            <AlertDescription>
              Using the same password across multiple sites increases your risk if one site is compromised.
            </AlertDescription>
          </Alert>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Update passwords regularly</AlertTitle>
            <AlertDescription>Change your passwords every 90 days, especially for important accounts.</AlertDescription>
          </Alert>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Use strong, complex passwords</AlertTitle>
            <AlertDescription>
              Strong passwords include uppercase and lowercase letters, numbers, and special characters.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Password List Modal */}
      <PasswordListModal
        isOpen={listModalOpen}
        onClose={() => setListModalOpen(false)}
        passwords={
          listModalType === "weak" ? weakPasswords : listModalType === "old" ? oldPasswords : duplicatePasswords
        }
        title={
          listModalType === "weak"
            ? "Weak Passwords"
            : listModalType === "old"
              ? "Old Passwords"
              : "Duplicate Passwords"
        }
        description={
          listModalType === "weak"
            ? "These passwords do not meet the recommended security criteria."
            : listModalType === "old"
              ? "These passwords are older than 90 days and should be updated."
              : "These passwords are duplicated across multiple accounts."
        }
        onFixPassword={handleFixPassword}
      />

      {/* Password Fix Modal */}
      <PasswordFixModal
        password={selectedPassword}
        isOpen={fixModalOpen}
        onClose={() => setFixModalOpen(false)}
        onSave={handleSavePassword}
        type={listModalType}
      />

      {/* Master Password Verification Dialog */}
      <Dialog open={verifyMasterPasswordOpen} onOpenChange={setVerifyMasterPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Master Password</DialogTitle>
            <DialogDescription>
              Please enter your master password to fix this password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="verify-master-password">Master Password</Label>
              <Input
                id="verify-master-password"
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setVerifyMasterPasswordOpen(false)
              setMasterPassword("")
            }}>
              Cancel
            </Button>
            <Button onClick={handleVerifyMasterPassword}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

