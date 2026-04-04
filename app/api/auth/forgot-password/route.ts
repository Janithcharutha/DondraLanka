import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { sendPasswordResetEmail } from '@/lib/email'

interface EmailError extends Error {
  code?: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const { email } = await request.json()
    console.log('Starting password reset process for:', email)

    const user = await User.findOne({ email })
    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json({
        message: 'If an account exists, you will receive a password reset email'
      })
    }

    console.log('User found, creating reset token...')
    const resetToken = sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    )

    try {
      await sendPasswordResetEmail(email, resetToken)
      console.log('Reset email sent successfully to:', email)
      
      return NextResponse.json({
        message: 'Password reset email sent successfully'
      })
    } catch (error) {
      const emailError = error as EmailError
      console.error('Email error:', emailError.message)
      
      return NextResponse.json(
        { error: `Failed to send email: ${emailError.message}` },
        { status: 500 }
      )
    }
  } catch (error) {
    const serverError = error as Error
    console.error('Password reset process failed:', serverError)
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}