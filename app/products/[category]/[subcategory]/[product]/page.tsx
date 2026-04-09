import { Suspense } from "react"
import { ProductClient } from "@/components/product-client"
import { notFound } from "next/navigation"

interface ProductProps {
  params: Promise<{
    category: string
    subcategory: string 
    product: string
  }>
}

async function getProduct(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/by-slug/${slug}`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
        headers: {
          'Cache-Control': 'public, s-maxage=60'
        }
      }
    )
    
    if (!response.ok) return null
    return response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function Page({ params }: ProductProps) {
  // Await the params since they're now a Promise
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.product)

  if (!product) {
    notFound()
  }

  // Only validate category since subcategories were removed
  if (product.category !== resolvedParams.category) {
    notFound()
  }

  return (
    <Suspense 
      fallback={
        <div className="container mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      }
    >
      <ProductClient product={product} params={resolvedParams} />
    </Suspense>
  )
}