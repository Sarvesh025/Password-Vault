"use client"

import type { Password } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface PasswordListModalProps {
  isOpen: boolean
  onClose: () => void
  passwords: Password[]
  title: string
  description: string
  onFixPassword: (password: Password) => void
}

export function PasswordListModal({
  isOpen,
  onClose,
  passwords,
  title,
  description,
  onFixPassword,
}: PasswordListModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 py-4">
            {passwords.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">No passwords found</p>
            ) : (
              passwords.map((password) => (
                <div key={password.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium">{password.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center space-x-2">
                      <Badge variant="outline">{password.category === "device" ? "Device" : "Account"}</Badge>
                      {password.accountName && <span>{password.accountName}</span>}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => onFixPassword(password)}>
                    Fix
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

