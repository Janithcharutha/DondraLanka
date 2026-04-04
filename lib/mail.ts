import nodemailer from 'nodemailer'
import type { Order } from '@/types/order'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendOrderConfirmationEmail(order: Order) {
  if (!order.billingDetails?.email) {
    throw new Error('No recipient email defined')
  }

  // Format items list for email
  const itemsList = order.items
    .map(item => `
      <tr>
        <td style="padding: 8px">${item.name} × ${item.quantity}</td>
        <td style="padding: 8px; text-align: right">Rs. ${item.price * item.quantity}</td>
      </tr>
    `).join('')

  // Create email content
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; text-align: center;">Order Confirmed!</h1>
      <p style="text-align: center;">Your order number is: <strong>${order.orderNumber}</strong></p>

      ${order.paymentMethod === "bank-transfer" ? `
        <div style="background-color: #f0f7ff; padding: 16px; margin: 16px 0; border-radius: 8px;">
          <p style="color: #1e40af; font-weight: 500; margin: 0;">Bank Transfer Reference:</p>
          <p style="color: #1d4ed8; margin: 4px 0 0;">${order.orderReference}</p>
        </div>
      ` : ''}

      <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 2px solid #e5e7eb;">Item</th>
            <th style="text-align: right; padding: 8px; border-bottom: 2px solid #e5e7eb;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
          <tr>
            <td style="padding: 8px; border-top: 1px solid #e5e7eb;">Shipping</td>
            <td style="padding: 8px; text-align: right; border-top: 1px solid #e5e7eb;">Rs. 350</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Total</td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">Rs. ${order.total + 350}</td>
          </tr>
        </tbody>
      </table>

      <p style="color: #666; margin-top: 24px; text-align: center;">
        Thank you for shopping with us!
      </p>
    </div>
  `

  // Send email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.billingDetails.email,
      subject: `Your DONDRA LANKA order has been received! - #${order.orderNumber}`,
      html: emailContent,
    })
    
    console.log('Order confirmation email sent successfully')
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    throw error
  }
}