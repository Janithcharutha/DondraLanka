import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import mongoose from 'mongoose'

// Create News Banner Schema
const NewsBannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: {
    type: String,
    enum: ['Active', 'Scheduled', 'Expired'],
    required: true
  },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
})

// Create model (or get existing one)
const NewsBanner = mongoose.models.NewsBanner || mongoose.model('NewsBanner', NewsBannerSchema)

export async function GET() {
  try {
    await connectToDatabase()

    const newsBanners = await NewsBanner.find()
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(newsBanners)
  } catch (error) {
    console.error('Error fetching news banners:', error)
    return NextResponse.json(
      { error: "Failed to fetch news banners" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const body = await request.json()

    // Validate required fields
    if (!body.imageUrl || !body.startDate || !body.endDate || !body.status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newBanner = await NewsBanner.create({
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json(newBanner, { status: 201 })
  } catch (error) {
    console.error('Error creating news banner:', error)
    return NextResponse.json(
      { error: "Failed to create news banner" },
      { status: 500 }
    )
  }
}