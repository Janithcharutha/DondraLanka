import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { productId } = params

    if (!ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const db = await connectToDatabase()

    const today = new Date().toISOString().split("T")[0]

    const offer = await db
      .collection("offers")
      .aggregate([
        {
          $match: {
            productId: new ObjectId(productId),
            status: "active",
            startDate: { $lte: today },
            endDate: { $gte: today },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 1,
            discountedPrice: 1,
            discountPercentage: 1,
            product: 1,
          },
        },
      ])
      .toArray()

    if (!offer[0]) {
      return NextResponse.json({ error: "No active offer found for this product" }, { status: 404 })
    }

    return NextResponse.json(offer[0])
  } catch (error) {
    console.error("Error fetching offer:", error)
    return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 })
  }
}
