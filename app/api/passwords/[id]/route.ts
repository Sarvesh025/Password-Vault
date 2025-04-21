import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Get a specific password
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/passwords/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${request.headers.get('authorization')}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching password:', error)
    return NextResponse.json(
      { error: 'Failed to fetch password' },
      { status: 500 }
    )
  }
}

// Update a password
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if(params.id === null){
      return NextResponse.json({ error: "Invalid password id" }, { status: 400 });
    }


    const { password } = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/passwords/${params.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    )
  }
}

// Delete a password
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/passwords/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting password:', error)
    return NextResponse.json(
      { error: 'Failed to delete password' },
      { status: 500 }
    )
  }
} 