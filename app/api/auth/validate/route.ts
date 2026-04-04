import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
      userId: string
      role: string
    }

    await connectToDatabase()
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}