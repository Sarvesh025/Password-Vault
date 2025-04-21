"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    // Calculate password strength
    const calculateStrength = (pwd: string) => {
      if (!pwd) return 0

      let score = 0

      // Length check
      if (pwd.length >= 8) score += 20
      if (pwd.length >= 12) score += 10

      // Character variety checks
      if (/[a-z]/.test(pwd)) score += 10
      if (/[A-Z]/.test(pwd)) score += 10
      if (/[0-9]/.test(pwd)) score += 10
      if (/[^a-zA-Z0-9]/.test(pwd)) score += 20

      // Penalize for common patterns
      if (/^[a-zA-Z]+$/.test(pwd)) score -= 10
      if (/^[0-9]+$/.test(pwd)) score -= 10
      if (/(.)\1{2,}/.test(pwd)) score -= 10 // Repeated characters

      // Cap the score between 0 and 100
      return Math.max(0, Math.min(100, score))
    }

    const getStrengthFeedback = (score: number) => {
      if (score < 30) return "Very weak - easily guessable"
      if (score < 50) return "Weak - consider a stronger password"
      if (score < 70) return "Moderate - could be stronger"
      if (score < 90) return "Strong - good password"
      return "Very strong - excellent password"
    }

    const score = calculateStrength(password)
    setStrength(score)
    setFeedback(getStrengthFeedback(score))
  }, [password])

  const getStrengthColor = () => {
    if (strength < 30) return "bg-destructive"
    if (strength < 50) return "bg-orange-500"
    if (strength < 70) return "bg-yellow-500"
    if (strength < 90) return "bg-emerald-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs">Password Strength</span>
        <span className="text-xs">{feedback}</span>
      </div>
      <Progress value={strength} className={getStrengthColor()} />
    </div>
  )
}

