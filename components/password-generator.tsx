"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { PasswordStrengthMeter } from "@/components/password-strength-meter"
import { Copy, RefreshCw, Save, Check, ShieldCheck, Dices } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast-provider"
import type { Password } from "@/lib/types"
import { createPassword } from "@/lib/passwords"

export function PasswordGenerator({
  setPasswords,
}: { setPasswords: React.Dispatch<React.SetStateAction<Password[]>> }) {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [generatedPasswordDialogOpen, setGeneratedPasswordDialogOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    title: "",
    username: "",
    url: "",
    category: "application" as "device" | "application",
  })
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const generatePassword = () => {
    let charset = ""
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (charset === "") {
      setError("Please select at least one character type")
      return
    }

    // Check if either lowercase or numbers are selected
    if (!includeLowercase && !includeNumbers) {
      setError("Either lowercase letters or numbers must be selected")
      return
    }

    let newPassword = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      newPassword += charset[randomIndex]
    }

    setPassword(newPassword)
    setError("")
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        setCopied(true)
        toast.success("Password copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast.error("Failed to copy password")
      })
  }

  const handleSavePassword = async () => {
    try {
      if (!passwordData.title) {
        setError("Title is required")
        return
      }

      const newPassword = await createPassword({
        name: passwordData.title,
        accountName: passwordData.username,
        password: password,
        url: passwordData.url,
        category: passwordData.category === "device" ? "device" : "application",
      })

      console.log("New Password", newPassword);
      setPasswords((prev) => [...prev, newPassword])
      setGeneratedPasswordDialogOpen(false)
      setPasswordData({ title: "", username: "", url: "", category: "application" })
      setError("")
      toast.success("Password saved successfully")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to save password")
      }
      console.error(err)
    }
  }

  const openSaveDialog = () => {
    if (!password) {
      setError("Please generate a password first")
      return
    }
    setGeneratedPasswordDialogOpen(true)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Password Options</h3>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="length" className="font-medium">
                    Length: {length}
                  </Label>
                </div>
                <Slider
                  id="length"
                  min={8}
                  max={32}
                  step={1}
                  value={[length]}
                  onValueChange={(value) => setLength(value[0])}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>8</span>
                  <span>20</span>
                  <span>32</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-medium">Character Types</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="uppercase" className="text-sm">
                        Uppercase (A-Z)
                      </Label>
                    </div>
                    <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="lowercase" className="text-sm">
                        Lowercase (a-z)
                      </Label>
                    </div>
                    <Switch
                      id="lowercase"
                      checked={includeLowercase}
                      onCheckedChange={(checked) => {
                        setIncludeLowercase(checked)
                        // If turning off lowercase, make sure numbers is on
                        if (!checked && !includeNumbers) {
                          setIncludeNumbers(true)
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="numbers" className="text-sm">
                        Numbers (0-9)
                      </Label>
                    </div>
                    <Switch
                      id="numbers"
                      checked={includeNumbers}
                      onCheckedChange={(checked) => {
                        setIncludeNumbers(checked)
                        // If turning off numbers, make sure lowercase is on
                        if (!checked && !includeLowercase) {
                          setIncludeLowercase(true)
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="symbols" className="text-sm">
                        Symbols (!@#$%^&*)
                      </Label>
                    </div>
                    <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <Button onClick={generatePassword} className="w-full gap-2">
            <Dices className="h-4 w-4" />
            Generate Password
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Generated Password</h3>
          {password && (
            <Badge variant="outline" className="bg-primary/10">
              <ShieldCheck className="mr-1 h-3 w-3" />
              {length >= 12 ? "Strong" : length >= 8 ? "Good" : "Weak"}
            </Badge>
          )}
        </div>

        <Card className="border-dashed">
          <CardContent className="pt-6">
            {!password ? (
              <div className="flex h-32 flex-col items-center justify-center text-center text-muted-foreground">
                <Dices className="mb-2 h-8 w-8 opacity-50" />
                <p>Click the Generate button to create a password</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input value={password} readOnly className="font-mono text-lg" />
                  <Button variant="outline" size="icon" onClick={copyToClipboard} className="flex-shrink-0">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <PasswordStrengthMeter password={password} />

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={generatePassword} className="flex-1 gap-1">
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button onClick={openSaveDialog} className="flex-1 gap-1">
                    <Save className="h-4 w-4" />
                    Save Password
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Password Dialog */}
      <Dialog open={generatedPasswordDialogOpen} onOpenChange={setGeneratedPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Password</DialogTitle>
            <DialogDescription>Save this password to your secure vault</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="save-category">Password Type</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="save-category-device"
                    name="save-category"
                    value="device"
                    checked={passwordData.category === "device"}
                    onChange={() => setPasswordData({ ...passwordData, category: "device" })}
                    className="h-4 w-4 border-primary text-primary"
                  />
                  <Label htmlFor="save-category-device">Device</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="save-category-application"
                    name="save-category"
                    value="application"
                    checked={passwordData.category === "application"}
                    onChange={() => setPasswordData({ ...passwordData, category: "application" })}
                    className="h-4 w-4 border-primary text-primary"
                  />
                  <Label htmlFor="save-category-application">Application</Label>
                </div>
              </div>
            </div>

            {passwordData.category === "device" ? (
              <div className="space-y-2">
                <Label htmlFor="title">Device Name</Label>
                <Input
                  id="title"
                  placeholder="e.g. iPhone, Laptop"
                  value={passwordData.title}
                  onChange={(e) => setPasswordData({ ...passwordData, title: e.target.value })}
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="save-title">Platform Name</Label>
                  <Input
                    id="save-title"
                    placeholder="e.g. Gmail, Netflix"
                    value={passwordData.title}
                    onChange={(e) => setPasswordData({ ...passwordData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="save-url">Platform URL</Label>
                  <Input
                    id="save-url"
                    type="url"
                    placeholder="https://example.com"
                    value={passwordData.url}
                    onChange={(e) => setPasswordData({ ...passwordData, url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="save-username">Username/Email</Label>
                  <Input
                    id="save-username"
                    placeholder="username or email"
                    value={passwordData.username}
                    onChange={(e) => setPasswordData({ ...passwordData, username: e.target.value })}
                  />
                </div>
              </>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGeneratedPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePassword}>
              <Save className="mr-2 h-4 w-4" />
              Save to Vault
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

