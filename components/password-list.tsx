"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Copy, Lock, Search } from "lucide-react"
import type { Password } from "@/lib/types"
import { createPassword, deletePassword, viewPassword } from "@/lib/passwords"
import { formatTimeAgo } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast-provider"
import { handleFetchError } from "@/lib/utils"

interface PasswordListProps {
  passwords: Password[]
  setPasswords: React.Dispatch<React.SetStateAction<Password[]>>
}

export function PasswordList({ passwords, setPasswords }: PasswordListProps) {
  const [newPasswordData, setNewPasswordData] = useState({
    name: "",
    accountName: "",
    password: "",
    url: "",
    category: "application" as "device" | "application",
  })
  const [masterPassword, setMasterPassword] = useState("")
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [verifyDeletePasswordOpen, setVerifyDeletePasswordOpen] = useState(false)
  const [passwordToDelete, setPasswordToDelete] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [viewPasswordDialogOpen, setViewPasswordDialogOpen] = useState(false)
  const [verifyMasterPasswordOpen, setVerifyMasterPasswordOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>(passwords)
  const [passwordHistory, setPasswordHistory] = useState<Array<{ id: number; value: string; createdAt: string; passwordId: number }>>([])
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)

  useEffect(() => {
    // Filter passwords based on search term
    if (searchTerm.trim() === "") {
      setFilteredPasswords(passwords)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredPasswords(
        passwords.filter(
          (password) =>
            password.name.toLowerCase().includes(term) ||
            password.accountName.toLowerCase().includes(term) ||
            password.category.toLowerCase().includes(term),
        ),
      )
    }
  }, [searchTerm, passwords])

  const handleAddPassword = async () => {
    try {
      // Validate required fields
      if (!newPasswordData.name.trim()) {
        toast.error("Name is required");
        return;
      }

      if (!newPasswordData.password.trim()) {
        toast.error("Password is required");
        return;
      }

      // For applications, validate account name
      if (newPasswordData.category === "application" && !newPasswordData.accountName.trim()) {
        toast.error("Account name is required for applications");
        return;
      }

      const newPassword = await createPassword({
        name: newPasswordData.name,
        accountName: newPasswordData.accountName,
        password: newPasswordData.password,
        url: newPasswordData.url,
        category: newPasswordData.category,
      });

      setPasswords((prev) => [...prev, newPassword]);
      setNewPasswordData({
        name: "",
        accountName: "",
        password: "",
        url: "",
        category: "application",
      });
      setAddDialogOpen(false);
      setError("");
      toast.success("Password saved successfully");
    } catch (error) {
      await handleFetchError(error);
      setError("Failed to save password");
    }
  };

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPasswordToDelete(id)
    setVerifyDeletePasswordOpen(true)
  }

  const handleVerifyDeletePassword = async () => {
    try {
      const response = await fetch('/api/user/check-master-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ masterPassword })
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      
      if (data.isMatch) {
        // If master password is verified, proceed with deletion
        await handleDeletePassword();
      } else {
        toast.error("Invalid master password");
        setMasterPassword("");
      }
    } catch (error) {
      await handleFetchError(error);
      setMasterPassword("");
    }
  }

  const handleDeletePassword = async () => {
    if (!passwordToDelete) return;

    try {
      const response = await fetch(`api/passwords/${passwordToDelete}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      setPasswords(passwords.filter((p) => p.id !== passwordToDelete));
      setVerifyDeletePasswordOpen(false);
      setPasswordToDelete(null);
      setMasterPassword("");
      toast.success(data.message);
    } catch (error) {
      await handleFetchError(error);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Could add a toast notification here
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const handleViewPassword = async (password: Password) => {
    setSelectedPassword(password)
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

      const data = await response.json();
      
      if (data.isMatch) {
        setVerifyMasterPasswordOpen(false);
        setViewPasswordDialogOpen(true);
        setMasterPassword("");
      } else {
        toast.error("Invalid master password");
        setMasterPassword("");
      }
    } catch (err) {
      toast.error("Failed to verify master password");
      setMasterPassword("");
    }
  }

  const handleViewHistory = async (passwordId: string) => {
    console.log("Viewing history for password:", passwordId);
    try {
      const response = await fetch(`/api/passwords/${passwordId}/history`);

      if (!response.ok) {
        throw response;
      }

      const history = await response.json();
      setPasswordHistory(history);
      setViewPasswordDialogOpen(false);
      setHistoryDialogOpen(true);
    } catch (error) {
      await handleFetchError(error);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Passwords</h2>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Password
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Password</DialogTitle>
              <DialogDescription>Add a new password to your secure vault</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="category-device"
                      name="category"
                      value="device"
                      checked={newPasswordData.category === "device"}
                      onChange={() => setNewPasswordData({ ...newPasswordData, category: "device" })}
                      className="h-4 w-4 border-primary text-primary"
                    />
                    <Label htmlFor="category-device">Device</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="category-application"
                      name="category"
                      value="application"
                      checked={newPasswordData.category === "application"}
                      onChange={() => setNewPasswordData({ ...newPasswordData, category: "application" })}
                      className="h-4 w-4 border-primary text-primary"
                    />
                    <Label htmlFor="category-application">Application</Label>
                  </div>
                </div>
              </div>

              {newPasswordData.category === "device" ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Device Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. iPhone, Laptop"
                    value={newPasswordData.name}
                    onChange={(e) => setNewPasswordData({ ...newPasswordData, name: e.target.value })}
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Application Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Gmail, Netflix"
                      value={newPasswordData.name}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">Application URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com"
                      value={newPasswordData.url}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name/Email</Label>
                    <Input
                      id="accountName"
                      placeholder="username or email"
                      value={newPasswordData.accountName}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, accountName: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newPasswordData.password}
                  onChange={(e) => setNewPasswordData({ ...newPasswordData, password: e.target.value })}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPassword}>Save Password</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {passwords.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No passwords yet</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Add your first password to get started with your secure vault
            </p>
            <Button className="mt-4 gap-1" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Add Password
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPasswords.map((password) => (
                    <TableRow
                      key={password.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewPassword(password)}
                    >
                      <TableCell className="font-medium">{password.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{password.category === "device" ? "Device" : "Application"}</Badge>
                      </TableCell>
                      <TableCell>{password.accountName}</TableCell>
                      <TableCell>{password.createdAt ? `${formatTimeAgo(password.createdAt)} ago` : "Never"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => confirmDelete(password.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Master Password Verification Dialog */}
      <Dialog open={verifyMasterPasswordOpen} onOpenChange={setVerifyMasterPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Master Password</DialogTitle>
            <DialogDescription>
              Please enter your master password to view the password details
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
              setError("")
            }}>
              Cancel
            </Button>
            <Button onClick={handleVerifyMasterPassword}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Password Dialog */}
      <Dialog open={viewPasswordDialogOpen} onOpenChange={setViewPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPassword?.name}</DialogTitle>
            <DialogDescription>
              {selectedPassword?.category === "device" ? "Device" : "Application"} password details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPassword?.category === "application" && (
              <>
                <div className="space-y-2">
                  <Label>Account Name/Email</Label>
                  <div className="flex items-center gap-2">
                    <Input value={selectedPassword.accountName} readOnly />
                    <Button variant="outline" size="icon" onClick={() => selectedPassword.accountName && copyToClipboard(selectedPassword.accountName)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {selectedPassword.url && (
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <div className="flex items-center gap-2">
                      <Input value={selectedPassword.url} readOnly />
                      <Button variant="outline" size="icon" onClick={() => selectedPassword.url && copyToClipboard(selectedPassword.url)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex items-center gap-2">
                <Input type="text" value={selectedPassword?.password || ""} readOnly className="font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => selectedPassword && copyToClipboard(selectedPassword.password)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {selectedPassword?.lastViewed && (
              <p className="text-sm text-muted-foreground">
                Last viewed: {formatTimeAgo(selectedPassword.lastViewed)}
              </p>
            )}
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => selectedPassword && handleViewHistory(selectedPassword.id)}>
              Show History
            </Button>
            <Button onClick={() => setViewPasswordDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password History - {selectedPassword?.name}</DialogTitle>
            <DialogDescription>
              Previous versions of this password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {
              passwordHistory.length > 0 ?
              <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Password</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passwordHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className="font-mono">{history.value}</TableCell>
                      <TableCell>{formatTimeAgo(history.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(history.value)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            :
            <p className="text-sm text-muted-foreground">No history found</p>
          }
          </div>
          <DialogFooter>
            <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Master Password Verification for Delete Dialog */}
      <Dialog open={verifyDeletePasswordOpen} onOpenChange={setVerifyDeletePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Master Password</DialogTitle>
            <DialogDescription>
              Please enter your master password to delete this password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="delete-master-password">Master Password</Label>
              <Input
                id="delete-master-password"
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setVerifyDeletePasswordOpen(false)
              setMasterPassword("")
              setPasswordToDelete(null)
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleVerifyDeletePassword}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

