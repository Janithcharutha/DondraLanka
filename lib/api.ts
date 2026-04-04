import { cache } from 'react'
import { connectToDatabase } from "@/lib/mongodb"
import type { Category } from "@/lib/types"
import { ObjectId } from "mongodb"

interface CategoryDocument {
  _id: ObjectId
  name: string
  slug: string
  description?: string
  image?: string
  order?: number
  subcategories?: {
    _id: ObjectId
    name: string
    slug: string
    description?: string
    image?: string
  }[]
}

export const getCategoryData = cache(async (slug: string) => {
  try {
    const db = await connectToDatabase()
    
    const category = await db
      .collection("categories")
      .findOne({ slug })

    if (!category) return null

    return {
      ...category,
      _id: category._id.toString()
    }
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
})

export async function getCategories(): Promise<Category[]> {
  try {
    const db = await connectToDatabase()
    const categories = await db.collection<CategoryDocument>("categories")
      .find({})
      .sort({ order: 1 })
      .toArray()

    return categories.map(category => ({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      order: category.order,
      subcategories: category.subcategories?.map(sub => ({
        _id: sub._id.toString(),
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        image: sub.image
      })) || []
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}