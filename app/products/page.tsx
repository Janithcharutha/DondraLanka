// import { Suspense } from "react"
// import LoadingSpinner from "@/components/loading-spinner"
// import ProductGrid from "@/components/product-grid"
// import type { Product } from "@/lib/types"
// import { buildMetadata } from "@/lib/seo";
// import { Metadata } from "next/types";


// export const metadata: Metadata = buildMetadata({
//   title: "All Products",
//   description:
//     "Browse all premium dried fish and seafood products from Sri Lanka at DONDRA LANKA.",
//   path: "/products",
//   keywords: [
//     "all seafood products",
//     "dried fish Sri Lanka",
//     "premium dried seafood",
//   ],
// });

// async function getAllProducts(): Promise<Product[]> {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
//       cache: 'no-store' // Disable cache to always get fresh data
//     })
    
//     if (!res.ok) {
//       throw new Error('Failed to fetch products')
//     }
    
//     return res.json()
//   } catch (error) {
//     console.error('Error fetching products:', error)
//     return []
//   }
// }

// export default async function ProductsPage() {
//   const products = await getAllProducts()

//   return (
//     <Suspense fallback={<LoadingSpinner />}>
//       <div className="container mx-auto py-8">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-playfair font-medium mb-4">All Products</h1>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Explore our full range of premium dried fish and seafood, selected for freshness, quality, and authentic taste.</p>
//         </div>
//         <ProductGrid products={products} />
//       </div>
//     </Suspense>
//   )
// }

import { Suspense } from "react"
import type { Metadata } from "next/types"
import Link from "next/link"

import LoadingSpinner from "@/components/loading-spinner"
import ProductGrid from "@/components/product-grid"
import type { Product } from "@/lib/types"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "All Products",
  description:
    "Browse all premium dried fish and seafood products from Sri Lanka at DONDRA LANKA.",
  path: "/products",
  keywords: [
    "all seafood products",
    "dried fish Sri Lanka",
    "premium dried seafood",
  ],
})

async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch products")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getAllProducts()

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <main className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-medium mb-4">All Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our full range of premium dried fish and seafood, selected
            for freshness, quality, and authentic taste.
          </p>
        </div>

        <ProductGrid products={products} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {products.map((product: any) => {
            const categorySlug =
              product.categorySlug || product.category?.slug || product.category
            const subcategorySlug =
              product.subcategorySlug ||
              product.subcategory?.slug ||
              product.subcategory

            return (
              <div
                key={product._id || product.slug}
                className="border rounded-lg p-4"
              >
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-600 mt-2">
                  {product.description}
                </p>

                {categorySlug && subcategorySlug && product.slug && (
                  <Link
                    href={`/products/${categorySlug}/${subcategorySlug}/${product.slug}`}
                    className="inline-block mt-4 text-sm underline"
                  >
                    View Product
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </Suspense>
  )
}