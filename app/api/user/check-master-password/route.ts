import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  console.log("Checking master password status")
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")
    console.log("Access token:", accessToken ? "Present" : "Missing")

    if (!accessToken) {
      console.log("No access token found")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/check-master-password`
    console.log("Making request to:", apiUrl)

    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken.value}`
      }
    })

    console.log("Backend response status:", response.status)

    if (!response.ok) {
      console.log("Backend returned error:", response.status)
      return NextResponse.json(
        { error: "Master password not set up" },
        { status: 404 }
      )
    }

    const data = await response.json()
    console.log("Backend response data:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error checking master password status:", error)
    return NextResponse.json(
      { error: "Failed to check master password status" },
      { status: 500 }
    )
  }
}

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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken.value}`
      },
      body: JSON.stringify({ password: masterPassword })
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Invalid master password" },
        { status: 401 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error verifying master password:", error)
    return NextResponse.json(
      { error: "Failed to verify master password" },
      { status: 500 }
    )
  }
} 