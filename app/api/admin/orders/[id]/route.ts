// import { NextResponse } from "next/server"
// import { ObjectId } from "mongodb"
// import { connectToDatabase } from "@/lib/mongodb"

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   if (!params?.id) {
//     return NextResponse.json({ error: "Missing order ID" }, { status: 400 })
//   }

//   try {
//     const db = await connectToDatabase()
    
//     let orderId: ObjectId
//     try {
//       orderId = new ObjectId(params.id)
//     } catch (error) {
//       return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
//     }

//     const order = await db
//       .collection("orders")
//       .findOne({ _id: orderId })

//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 })
//     }

//     // Format the order data
//     const formattedOrder = {
//       ...order,
//       _id: order._id.toString(),
//       orderReference: order.orderReference || 
//         `${order.billingDetails.firstName} ${order.billingDetails.lastName}`.toUpperCase(),
//       paymentProof: order.paymentProof || null
//     }

//     return NextResponse.json(formattedOrder)
//   } catch (error) {
//     console.error('Error fetching order:', error)
//     return NextResponse.json(
//       { error: "Internal Server Error" }, 
//       { status: 500 }
//     )
//   }
// }

// // Add PATCH handler for uploading payment proof
// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await req.json()
//     const { status, paymentProof } = body
//     const db = await connectToDatabase()
    
//     // Build update object based on provided data
//     const updateData: any = {
//       updatedAt: new Date()
//     }
//     if (status) updateData.status = status
//     if (paymentProof) updateData.paymentProof = paymentProof

//     const order = await db
//       .collection("orders")
//       .findOneAndUpdate(
//         { _id: new ObjectId(params.id) },
//         { $set: updateData },
//         { returnDocument: 'after' }
//       )

//     if (!order) {
//       return new NextResponse("Order not found", { status: 404 })
//     }

//     return NextResponse.json(order)
//   } catch (error) {
//     console.error('Error updating order:', error)
//     return new NextResponse("Internal Server Error", { status: 500 })
//   }
// }

// // Add DELETE method to existing route file
// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const db = await connectToDatabase()
    
//     const orderId = new ObjectId(params.id)
//     const result = await db.collection("orders").deleteOne({ _id: orderId })

//     if (result.deletedCount === 0) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 })
//     }

//     return NextResponse.json({ message: "Order deleted successfully" })
//   } catch (error) {
//     console.error('Error deleting order:', error)
//     return NextResponse.json(
//       { error: "Failed to delete order" }, 
//       { status: 500 }
//     )
//   }
// }

import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

// GET Order
export async function GET(req: Request, { params }: any) {
  if (!params?.id) {
    return NextResponse.json({ error: "Missing order ID" }, { status: 400 })
  }

  try {
    const db = await connectToDatabase()
    
    let orderId: ObjectId
    try {
      orderId = new ObjectId(params.id)
    } catch (error) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    // const order = await db.collection("orders").findOne({ _id: orderId })
    const order = await db.collection("orders").findOne({ _id: orderId as any })


    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const formattedOrder = {
      ...order,
      _id: order._id.toString(),
      orderReference: order.orderReference || 
        `${order.billingDetails.firstName} ${order.billingDetails.lastName}`.toUpperCase(),
      paymentProof: order.paymentProof || null
    }

    return NextResponse.json(formattedOrder)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// PATCH Order
export async function PATCH(req: Request, { params }: any) {
  try {
    const body = await req.json()
    const { status, paymentProof } = body
    const db = await connectToDatabase()
    
    const updateData: any = {
      updatedAt: new Date()
    }
    if (status) updateData.status = status
    if (paymentProof) updateData.paymentProof = paymentProof

    const order = await db.collection("orders").findOneAndUpdate(
      // { _id: new ObjectId(params.id) }
      { _id: new ObjectId(params.id) as any },
      { $set: updateData },
      { returnDocument: "after" }
    )

    if (!order?.value) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order.value)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE Order
export async function DELETE(req: Request, { params }: any) {
  try {
    const db = await connectToDatabase()

    const orderId = new ObjectId(params.id)
    const result = await db.collection("orders").deleteOne({ _id: orderId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Order deleted successfully" })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
