// import { NextRequest, NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/mongodb"
// import { ObjectId } from "mongodb"
// import type { BundleProduct } from "@/types/bundle-kit"

// // Use a simpler approach with any type to bypass strict type checking
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const db = await connectToDatabase()
//     const bundleKit = await db
//       .collection('bundleKits')
//       .findOne({ slug: params.id })

//     if (!bundleKit) {
//       return new NextResponse('Bundle Kit not found', { status: 404 })
//     }

//     return NextResponse.json(bundleKit)
//   } catch (error) {
//     console.error('Error fetching bundle kit:', error)
//     return new NextResponse('Internal Server Error', { status: 500 })
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: any
// ) {
//   try {
//     const { id } = params

//     // Validate ID format
//     if (!id || !ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
//     }

//     const db = await connectToDatabase()

//     // Check if bundle exists first
//     const existingBundle = await db.collection("bundleKits").findOne({
//       _id: new ObjectId(id) as any,
//     })

//     if (!existingBundle) {
//       return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
//     }

//     const body = await request.json()

//     // Remove immutable fields
//     const { _id, createdAt, updatedAt, ...updateData } = body

//     // Process products with validation
//     const processedProducts =
//       updateData.products?.map((product: BundleProduct) => {
//         if (!product.productId || !product.productName) {
//           throw new Error("Product ID and name are required")
//         }

//         return {
//           ...product,
//           productId: new ObjectId(product.productId),
//           quantity: Math.max(1, Number(product.quantity) || 1),
//           price: Math.max(0, Number(product.price) || 0),
//         }
//       }) || []

//     const result = await db.collection("bundleKits").findOneAndUpdate(
//       { _id: new ObjectId(id) as any },
//       {
//         $set: {
//           name: updateData.name,
//           slug: updateData.slug,
//           description: updateData.description || "",
//           price: Number(updateData.price) || 0,
//           discountedPrice: updateData.discountedPrice ? Number(updateData.discountedPrice) : null,
//           images: Array.isArray(updateData.images) ? updateData.images : [],
//           products: processedProducts,
//           featured: Boolean(updateData.featured),
//           status: updateData.status || "active",
//           updatedAt: new Date().toISOString(),
//         },
//       },
//       {
//         returnDocument: "after",
//       },
//     )

//     if (!result?.value) {
//       throw new Error("Failed to update bundle kit")
//     }

//     return NextResponse.json({
//       ...result.value,
//       _id: result.value._id.toString(),
//       products: result.value.products.map((product: BundleProduct) => ({
//         ...product,
//         productId: product.productId.toString(),
//       })),
//     })
//   } catch (error) {
//     console.error("Error updating bundle kit:", error)
//     return NextResponse.json(
//       {
//         error: error instanceof Error ? error.message : "Failed to update bundle kit",
//         details: process.env.NODE_ENV === "development" ? error : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: any
// ) {
//   const { id } = params

//   try {
//     const db = await connectToDatabase()

//     if (!id || !ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
//     }

//     const result = await db.collection("bundleKits").deleteOne({ _id: new ObjectId(id) as any })

//     if (result.deletedCount === 0) {
//       return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting bundle kit:", error)
//     return NextResponse.json({ error: "Failed to delete bundle kit" }, { status: 500 })
//   }
// }

// import { NextRequest, NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/mongodb"
// import mongoose from 'mongoose'
// import type { BundleProduct } from "@/types/bundle-kit"

// export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await context.params

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
//     }

//     const db = await connectToDatabase()
//     const bundleKit = await db.collection('bundleKits').findOne({ _id: new mongoose.Types.ObjectId(id) as any })

//     if (!bundleKit) {
//       return new NextResponse('Bundle Kit not found', { status: 404 })
//     }

//     return NextResponse.json(bundleKit)
//   } catch (error) {
//     console.error('Error fetching bundle kit:', error)
//     return new NextResponse('Internal Server Error', { status: 500 })
//   }
// }

// export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await context.params

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
//     }

//     const db = await connectToDatabase()
//     const existingBundle = await db.collection("bundleKits").findOne({
//       // _id: new ObjectId(id) as any
//       _id: new mongoose.Types.ObjectId(id) as any as any,
//     })

//     if (!existingBundle) {
//       return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
//     }

//     const body = await request.json()
//     const { _id, createdAt, updatedAt, ...updateData } = body

//     const processedProducts =
//       updateData.products?.map((product: BundleProduct) => {
//         if (!product.productId || !product.productName) {
//           throw new Error("Product ID and name are required")
//         }

//         return {
//           ...product,
//           productId: new mongoose.Types.ObjectId(product.productId),
//           quantity: Math.max(1, Number(product.quantity) || 1),
//           price: Math.max(0, Number(product.price) || 0),
//         }
//       }) || []

//     const result = await db.collection("bundleKits").findOneAndUpdate(
//       { 
//         // _id: new ObjectId(id) as any 
//         _id: new mongoose.Types.ObjectId(id) as any as any
//       },
//       {
//         $set: {
//           name: updateData.name,
//           slug: updateData.slug,
//           description: updateData.description || "",
//           price: Number(updateData.price) || 0,
//           discountedPrice: updateData.discountedPrice ? Number(updateData.discountedPrice) : null,
//           images: Array.isArray(updateData.images) ? updateData.images : [],
//           products: processedProducts,
//           featured: Boolean(updateData.featured),
//           status: updateData.status || "active",
//           updatedAt: new Date().toISOString(),
//         },
//       },
//       {
//         returnDocument: "after",
//       },
//     )

//     if (!result?.value) {
//       throw new Error("Failed to update bundle kit")
//     }

//     return NextResponse.json({
//       ...result.value,
//       _id: result.value._id.toString(),
//       products: result.value.products.map((product: BundleProduct) => ({
//         ...product,
//         productId: product.productId.toString(),
//       })),
//     })
//   } catch (error) {
//     console.error("Error updating bundle kit:", error)
//     return NextResponse.json(
//       {
//         error: error instanceof Error ? error.message : "Failed to update bundle kit",
//         details: process.env.NODE_ENV === "development" ? error : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }

// export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await context.params

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
//     }

//     const db = await connectToDatabase()
//     const result = await db.collection("bundleKits").deleteOne({ _id: new mongoose.Types.ObjectId(id) as any })

//     if (result.deletedCount === 0) {
//       return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting bundle kit:", error)
//     return NextResponse.json({ error: "Failed to delete bundle kit" }, { status: 500 })
//   }
// }

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import mongoose from 'mongoose'
import type { BundleProduct } from "@/types/bundle-kit"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    const db = await connectToDatabase()
    const bundleKit = await db.collection('bundleKits').findOne({ slug: id })

    if (!bundleKit) {
      return new NextResponse('Bundle Kit not found', { status: 404 })
    }

    return NextResponse.json({
      ...bundleKit,
      _id: bundleKit._id.toString(),
      products: bundleKit.products.map((product: any) => ({
        ...product,
        productId: product.productId.toString(),
      })),
    })
  } catch (error) {
    console.error('Error fetching bundle kit:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const existingBundle = await db.collection("bundleKits").findOne({
      _id: new mongoose.Types.ObjectId(id) as any as any,
    })

    if (!existingBundle) {
      return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
    }

    const body = await request.json()
    const { _id, createdAt, updatedAt, ...updateData } = body

    const processedProducts =
      updateData.products?.map((product: BundleProduct) => {
        if (!product.productId || !product.productName) {
          throw new Error("Product ID and name are required")
        }

        return {
          ...product,
          productId: new mongoose.Types.ObjectId(product.productId),
          quantity: Math.max(1, Number(product.quantity) || 1),
          price: Math.max(0, Number(product.price) || 0),
        }
      }) || []

    const result = await db.collection("bundleKits").findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id) as any as any
      },
      {
        $set: {
          name: updateData.name,
          slug: updateData.slug,
          description: updateData.description || "",
          price: Number(updateData.price) || 0,
          discountedPrice: updateData.discountedPrice ? Number(updateData.discountedPrice) : null,
          images: Array.isArray(updateData.images) ? updateData.images : [],
          products: processedProducts,
          featured: Boolean(updateData.featured),
          status: updateData.status || "active",
          updatedAt: new Date().toISOString(),
        },
      },
      {
        returnDocument: "after",
      },
    )

    if (!result?.value) {
      throw new Error("Failed to update bundle kit")
    }

    return NextResponse.json({
      ...result.value,
      _id: result.value._id.toString(),
      products: result.value.products.map((product: BundleProduct) => ({
        ...product,
        productId: product.productId.toString(),
      })),
    })
  } catch (error) {
    console.error("Error updating bundle kit:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update bundle kit",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection("bundleKits").deleteOne({ _id: new mongoose.Types.ObjectId(id) as any })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bundle kit:", error)
    return NextResponse.json({ error: "Failed to delete bundle kit" }, { status: 500 })
  }
}