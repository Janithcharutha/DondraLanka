// import { connectToDatabase } from "@/lib/mongodb"
// import { NextResponse } from "next/server"

// export async function GET(
//   request: Request,
//   { params }: { params: { category: string } }
// ) {
//   try {
//     const db = await connectToDatabase()
//     const products = await db
//       .collection("products")
//       .find({ 
//         category: params.category,
//         // Add any additional filters you need
//         isActive: true, // If you have an active/inactive flag
//         stock: { $gt: 0 } // If you want to show only in-stock items
//       })
//       .toArray()

//     return NextResponse.json(products)
//   } catch (error) {
//     console.error('Error fetching category products:', error)
//     return NextResponse.json(
//       { error: 'Failed to fetch category products' },
//       { status: 500 }
//     )
//   }
// }

import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  context: { params: Promise<{ category: string }> }
) {
  const { category } = await context.params

  try {
    const db = await connectToDatabase()
    const products = await db
      .collection("products")
      .find({ 
        category: category,
        isActive: true,
        stock: { $gt: 0 }
      })
      .toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching category products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category products' },
      { status: 500 }
    )
  }
}