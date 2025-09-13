import { NextRequest, NextResponse } from 'next/server'
import { generateToken, demoUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // For demo purposes, accept any email/password combination
    // In a real app, you'd validate against a database
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Generate token for demo user
    const token = generateToken(demoUser)

    return NextResponse.json({
      token,
      user: demoUser,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
