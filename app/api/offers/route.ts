import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import mongoose from 'mongoose'

export async function GET() {
  try {
    const db = await connectToDatabase()
    
    const offers = await db
      .collection("offers")
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 1,
            productId: 1,
            productName: 1,
            productSlug: 1,
            productImage: 1,
            originalPrice: 1,
            discountedPrice: 1,
            discountPercentage: 1,
            startDate: 1,
            endDate: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            product: {
              name: "$product.name",
              price: "$product.price",
              images: "$product.images",
              description: "$product.description"
            }
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      .toArray()

    // Convert ObjectIds to strings
    const formattedOffers = offers.map(offer => ({
      ...offer,
      _id: offer._id.toString(),
      productId: offer.productId.toString()
    }))

    return NextResponse.json(formattedOffers)
  } catch (error) {
    console.error("Error fetching offers:", error)
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, discountPercentage, startDate, endDate } = body

    // Validate required fields
    if (!productId || !discountPercentage || !startDate || !endDate) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Check if product exists
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const product = await db.collection("products").findOne({ _id: new mongoose.Types.ObjectId(productId) as any })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if offer for this product already exists
    const existingOffer = await db.collection("offers").findOne({ productId: new mongoose.Types.ObjectId(productId) })

    if (existingOffer) {
      return NextResponse.json({ error: "Offer for this product already exists" }, { status: 400 })
    }

    // Calculate discounted price
    const discountedPrice = Math.round(product.price * (1 - Number(discountPercentage) / 100))

    // Create new offer
    const newOffer = {
      productId: new mongoose.Types.ObjectId(productId),
      productName: product.name,
      productSlug: product.slug,
      productImage: product.images?.[0] || null,
      originalPrice: product.price,
      discountedPrice,
      discountPercentage: Number(discountPercentage),
      startDate,
      endDate,
      status: "active",
      createdAt: new Date(),
    }

    const result = await db.collection("offers").insertOne(newOffer)

    // Update product with discounted price
    await db.collection("products").updateOne({ _id: new mongoose.Types.ObjectId(productId) as any }, { $set: { discountedPrice } })

    // Return the created offer with string ID
    return NextResponse.json({
      ...newOffer,
      _id: result.insertedId.toString(),
      productId: productId,
    })
  } catch (error) {
    console.error("Error creating offer:", error)
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 })
  }
}
