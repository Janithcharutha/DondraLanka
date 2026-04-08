import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import mongoose from 'mongoose'
import { NewsBanner } from "@/models/NewsBanner"

// Helper function to validate and convert ID
async function getValidObjectId(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null
    }
    return new mongoose.Types.ObjectId(id)
  } catch {
    return null
  }
}

// Get single banner
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid banner ID" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    
    const banner = await db
      .collection("newsBanners")
      .findOne({ _id: new mongoose.Types.ObjectId(id) as any })

    if (!banner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    )
  }
}

// Update banner
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid banner ID" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const body = await request.json()

    const result = await db
      .collection("newsBanners")
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) as any },
        {
          $set: {
            ...body,
            updatedAt: new Date().toISOString()
          }
        },
        { returnDocument: 'after' }
      )

    if (!result) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    )
  }
}

// Delete banner
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get ID from params
    const { id } = await context.params
    console.log('Delete request for ID:', id)

    // Connect to database
    await connectToDatabase()

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ID format:', id)
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 })
    }

    // Use Mongoose model to find and delete
    const deletedBanner = await NewsBanner.findByIdAndDelete(id)

    console.log('Delete result:', deletedBanner)

    if (!deletedBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      message: "Banner deleted successfully",
      deletedBanner
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    )
  }
}