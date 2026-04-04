import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import mongoose from 'mongoose'
import { connectToDatabase } from "@/lib/mongodb"
import { Order } from "@/models/order"

function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD-${year}${month}-${random}`
}

export async function POST(req: Request) {
  try {
    const db = await connectToDatabase()
    const body = await req.json()

    // Log incoming data
    console.log('Creating order with data:', {
      paymentMethod: body.paymentMethod,
      paymentProof: body.paymentProof
    })

    // Create order with payment proof for bank transfer
    const orderData = {
      orderNumber: body.orderNumber,
      userId: body.userId,
      billingDetails: body.billingDetails,
      items: body.items,
      total: body.total,
      paymentMethod: body.paymentMethod,
      status: body.status,
      // Only include paymentProof for bank transfer
      ...(body.paymentMethod === 'bank-transfer' && {
        paymentProof: body.paymentProof,
        orderReference: `${body.billingDetails.firstName} ${body.billingDetails.lastName}`.toUpperCase()
      })
    }

    const result = await db.collection("orders").insertOne(orderData)
    const createdOrder = await db.collection("orders").findOne({ _id: result.insertedId })

    // Log created order
    console.log('Created order:', createdOrder)

    return NextResponse.json(createdOrder)
  } catch (error) {
    console.error('Error creating order:', error)
    return new NextResponse("Error creating order", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    const userId = session?.userId
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await connectToDatabase()
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-__v')

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch orders" }), 
      { status: 500 }
    )
  }
}