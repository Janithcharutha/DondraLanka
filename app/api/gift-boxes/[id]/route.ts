import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid gift box ID" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const giftBox = await db.collection("giftBoxes").findOne({ _id: new ObjectId(id) })

    if (!giftBox) {
      return NextResponse.json({ error: "Gift box not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...giftBox,
      _id: giftBox._id.toString(),
      products: giftBox.products.map((product: any) => ({
        ...product,
        productId: product.productId.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching gift box:", error)
    return NextResponse.json({ error: "Failed to fetch gift box" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: any) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, slug, description, price, discountedPrice, images, products, featured, status, isCustomizable } = body

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid gift box ID" }, { status: 400 })
    }

    if (!name || !slug || !products || products.length === 0) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    const db = await connectToDatabase()

    const existingGiftBox = await db
      .collection("giftBoxes")
      .findOne({ slug, _id: { $ne: new ObjectId(id) } })

    if (existingGiftBox) {
      return NextResponse.json({ error: "Another gift box with this slug already exists" }, { status: 400 })
    }

    const processedProducts = products.map((product: any) => ({
      ...product,
      productId: typeof product.productId === "string" ? new ObjectId(product.productId) : product.productId,
    }))

    const updatedGiftBox = {
      name,
      slug,
      description: description || "",
      price: Number(price),
      discountedPrice: discountedPrice ? Number(discountedPrice) : null,
      images: images || [],
      products: processedProducts,
      featured: featured || false,
      status: status || "active",
      isCustomizable: isCustomizable || false,
      updatedAt: new Date(),
    }

    const result = await db
      .collection("giftBoxes")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updatedGiftBox }, { returnDocument: "after" })

    if (!result) {
      return NextResponse.json({ error: "Gift box not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...result,
      _id: result._id.toString(),
      products: result.products.map((product: any) => ({
        ...product,
        productId: product.productId.toString(),
      })),
    })
  } catch (error) {
    console.error("Error updating gift box:", error)
    return NextResponse.json({ error: "Failed to update gift box" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid gift box ID" }, { status: 400 })
    }

    const db = await connectToDatabase()

    const giftBox = await db.collection("giftBoxes").findOne({ _id: new ObjectId(id) })

    if (!giftBox) {
      return NextResponse.json({ error: "Gift box not found" }, { status: 404 })
    }

    await db.collection("giftBoxes").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Gift box deleted successfully" })
  } catch (error) {
    console.error("Error deleting gift box:", error)
    return NextResponse.json({ error: "Failed to delete gift box" }, { status: 500 })
  }
}
