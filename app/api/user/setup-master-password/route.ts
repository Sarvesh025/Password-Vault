import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { masterPassword } = await request.json()
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Validate master password requirements
    if (masterPassword.length < 12) {
      return NextResponse.json(
        { error: "Master password must be at least 12 characters long" },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(masterPassword)) {
      return NextResponse.json(
        { error: "Master password must contain at least one uppercase letter" },
        { status: 400 }
      )
    }

    if (!/[a-z]/.test(masterPassword)) {
      return NextResponse.json(
        { error: "Master password must contain at least one lowercase letter" },
        { status: 400 }
      )
    }

    if (!/[0-9]/.test(masterPassword)) {
      return NextResponse.json(
        { error: "Master password must contain at least one number" },
        { status: 400 }
      )
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(masterPassword)) {
      return NextResponse.json(
        { error: "Master password must contain at least one special character" },
        { status: 400 }
      )
    }

    // Call the backend API to set up master password
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/setup-master-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken.value}`
      },
      body: JSON.stringify({ password : masterPassword })
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || "Failed to set master password" },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting master password:", error)
    return NextResponse.json(
      { error: "Failed to set master password" },
      { status: 500 }
    )
  }
} 