import nodemailer from 'nodemailer'

// Create reusable transporter with Gmail settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'charuthajanith@gmail.com',
    pass: 'uhfu ioxp fkcx alum'
  },
  logger: true,
  debug: true
})

interface EmailError extends Error {
  code?: string;
  command?: string;
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  console.log('Starting email send process...')

  try {
    await transporter.verify()
  } catch (error) {
    const verifyError = error as EmailError
    console.error('SMTP Verification Error:', {
      name: verifyError.name,
      message: verifyError.message,
      stack: verifyError.stack
    })
    throw new Error(`SMTP Verification failed: ${verifyError.message}`)
  }

  // Use environment variable or fallback for base URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000'
  const resetUrl = `${baseUrl}/admin/auth/reset-password?token=${resetToken}`

  const mailOptions = {
    from: '"DONDRA-LANKA Support" <charuthajanith@gmail.com>',
    to: email,
    subject: 'Password Reset Request',
    text: `Click this link to reset your password: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #00957a;">Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="background-color: #00957a; 
                  color: white; 
                  padding: 10px 20px; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  display: inline-block; 
                  margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `
  }

  try {
    console.log('Sending email with options:', {
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject
    })

    const info = await transporter.sendMail(mailOptions)
    
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      envelope: info.envelope
    })

    return true
  } catch (error) {
    const emailError = error as EmailError
    console.error('Email Send Error:', {
      name: emailError.name,
      message: emailError.message,
      code: emailError.code,
      command: emailError.command,
      stack: emailError.stack
    })
    throw new Error(`Failed to send email: ${emailError.message}`)
  }
}