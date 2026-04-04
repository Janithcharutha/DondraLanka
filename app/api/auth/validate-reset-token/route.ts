import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' }, 
        { status: 400 }
      )
    }

    // Verify token
    const decoded = verify(
      token, 
      process.env.JWT_SECRET || 'fallback-secret'
    )

    if (!decoded) {
      throw new Error('Invalid token')
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { error: 'Invalid or expired token' }, 
      { status: 401 }
    )
  }
}