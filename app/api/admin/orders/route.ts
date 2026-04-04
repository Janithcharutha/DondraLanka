import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Order } from "@/models/order"

export async function GET() {
  try {
    const db = await connectToDatabase()
    
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    
    const order = await Order.create({
      ...body,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}