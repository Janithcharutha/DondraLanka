import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Cart } from "@/models/cart"
import type { CartItem } from "@/types/cart"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session?.userId
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await connectToDatabase()
    const body = await req.json()
    const { item } = body as { item: CartItem }
    
    let cart = await Cart.findOne({ userId })
    
    if (!cart) {
      cart = new Cart({
        userId,
        items: [item]
      })
    } else {
      const existingItemIndex = cart.items.findIndex(
        (i: CartItem) => i.itemId === item.itemId && i.type === item.type
      )

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += item.quantity
      } else {
        cart.items.push(item)
      }
    }

    await cart.save()
    return NextResponse.json(cart)

  } catch (error) {
    console.error('Error saving cart:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    const userId = session?.userId

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await connectToDatabase()
    const cart = await Cart.findOne({ userId })
    
    return NextResponse.json(cart || { userId, items: [] })
  } catch (error) {
    console.error('Cart API Error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}