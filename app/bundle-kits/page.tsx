// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { useUser } from "@clerk/nextjs"
// import { Button } from "@/components/ui/button"
// import { useCart } from "@/components/providers/cart-provider"
// import type { BundleKit } from "@/types/bundle-kit"
// import { Loader2 } from "lucide-react"
// import { toast } from "@/components/ui/use-toast"
// import Link from "next/link"

// export default function BundleKitsPage() {
//   const { user } = useUser()
//   const { addItem } = useCart()
//   const [loading, setLoading] = useState<string | null>(null)
//   const [bundles, setBundles] = useState<BundleKit[]>([])

//   // Fetch bundles on mount
//   useEffect(() => {
//     const fetchBundles = async () => {
//       const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
//       const response = await fetch(`${baseUrl}/api/bundle-kits`)
//       if (response.ok) {
//         const data = await response.json()
//         setBundles(data)
//       }
//     }
//     fetchBundles()
//   }, [])

//   const handleAddToCart = async (bundle: BundleKit) => {
//     if (!bundle._id) {
//       toast({
//         title: "Error",
//         description: "Invalid bundle data",
//         variant: "destructive"
//       })
//       return
//     }

//     const bundleId = bundle._id.toString()
//     try {
//       setLoading(bundleId)

//       await addItem({
//         type: 'bundle',
//         itemId: bundleId,
//         name: bundle.name,
//         slug: bundle.slug,
//         image: bundle.images[0],
//         price: bundle.discountedPrice || bundle.price,
//         originalPrice: bundle.price,
//         quantity: 1,
//         inStock: true,
//         products: bundle.products.map(product => ({
//           productId: product.productId.toString(),
//           productName: product.productName,
//           quantity: product.quantity,
//           price: product.price
//         }))
//       })

//       // Optional: Scroll to top to ensure toast visibility
//       window.scrollTo({ top: 0, behavior: "smooth" })

//       toast({
//         title: "✅ Added to Cart",
//         description: (
//           <div className="space-y-2">
//             <p>{`${bundle.name} has been added to your cart.`}</p>
//             <Button asChild variant="outline" className="w-full">
//               <Link href="/cart">
//                 Proceed to Cart
//               </Link>
//             </Button>
//           </div>
//         ),
//         duration: 7000 // Toast stays longer
//       })

//       // Optional: Trigger cart icon update (if your layout supports it)
//       // updateCartIconAnimation()

//     } catch (error) {
//       console.error('Error adding to cart:', error)
//       toast({
//         title: "Error",
//         description: "Could not add item to cart. Please try again.",
//         variant: "destructive"
//       })
//     } finally {
//       setLoading(null)
//     }
//   }

//   return (
//     <div className="container mx-auto py-12">
//       <div className="text-center mb-12">
//         <h1 className="font-playfair text-4xl mb-4">Bundle Kits</h1>
//         <p className="max-w-2xl mx-auto text-gray-700">
// Save more with our carefully selected seafood bundles, designed to give you the best value and quality in every purchase.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {bundles.map((bundle) => {
//           if (!bundle._id) return null

//           const bundleId = bundle._id.toString()
//           return (
//             <div 
//               key={bundleId}
//               className="bg-white rounded-lg overflow-hidden shadow-md group"
//             >
//               <Link 
//                 href={`/bundle-kits/${bundle.slug}`}
//                 className="cursor-pointer block"
//               >
//                 <div className="relative h-[250px] overflow-hidden">
//                   <Image
//                     src={bundle.images[0] || `/placeholder.svg?height=250&width=400&text=${bundle.name}`}
//                     alt={bundle.name}
//                     fill
//                     className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                 </div>
//                 <div className="p-6">
//                   <h2 className="font-playfair text-2xl mb-2 group-hover:text-primary transition-colors">
//                     {bundle.name}
//                   </h2>
//                   <p className="text-gray-700 mb-4">{bundle.description}</p>
//                   <div className="mb-4">
//                     <h3 className="font-medium mb-2">Includes:</h3>
//                     <ul className="list-disc list-inside text-gray-700">
//                       {bundle.products.map((product) => (
//                         <li key={product.productId.toString()}>
//                           {product.productName}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </Link>
//               <div className="px-6 pb-6">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="text-xl font-semibold">
//                       RS. {bundle.price.toFixed(2)}
//                     </p>
//                     {bundle.discountedPrice && (
//                       <p className="text-green-600 text-sm">
//                         Save RS. {(bundle.price - bundle.discountedPrice).toFixed(2)}
//                       </p>
//                     )}
//                   </div>
//                   <Button 
//                     onClick={(e) => {
//                       e.preventDefault()
//                       handleAddToCart(bundle)
//                     }}
//                     disabled={loading === bundleId}
//                   >
//                     {loading === bundleId ? (
//                       <span className="flex items-center gap-2">
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Adding...
//                       </span>
//                     ) : (
//                       "Add to Cart"
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

import type { Metadata } from "next/types";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { getBundleKits } from "@/lib/api";
import AddBundleToCartButton from "./AddBundleToCartButton";

export const metadata: Metadata = buildMetadata({
  title: "Bundle Kits",
  description:
    "Shop seafood bundle kits at DONDRA LANKA. Enjoy curated selections of premium dried fish and seafood from Sri Lanka.",
  path: "/bundle-kits",
  keywords: [
    "seafood bundle kits",
    "dried fish bundles",
    "Sri Lankan seafood bundles",
  ],
});

export default async function BundleKitsPage() {
  const bundles = await getBundleKits();

  return (
    <main className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="font-playfair text-4xl mb-4">Bundle Kits</h1>
        <p className="max-w-2xl mx-auto text-gray-700">
          Save more with our carefully selected seafood bundles, designed to give
          you the best value and quality in every purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bundles.map((bundle: any) => {
          if (!bundle._id) return null;

          return (
            <div
              key={bundle._id.toString()}
              className="bg-white rounded-lg overflow-hidden shadow-md group"
            >
              <Link
                href={`/bundle-kits/${bundle.slug}`}
                className="cursor-pointer block"
              >
                <div className="relative h-[250px] overflow-hidden">
                  <Image
                    src={
                      bundle.images?.[0] ||
                      `/placeholder.svg?height=250&width=400&text=${bundle.name}`
                    }
                    alt={bundle.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h2 className="font-playfair text-2xl mb-2 group-hover:text-primary transition-colors">
                    {bundle.name}
                  </h2>
                  <p className="text-gray-700 mb-4">{bundle.description}</p>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Includes:</h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {bundle.products?.map((product: any) => (
                        <li key={String(product.productId)}>
                          {product.productName}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>

              <div className="px-6 pb-6">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <p className="text-xl font-semibold">
                      RS. {(bundle.discountedPrice || bundle.price).toFixed(2)}
                    </p>
                    {bundle.discountedPrice && (
                      <p className="text-green-600 text-sm">
                        Save RS. {(bundle.price - bundle.discountedPrice).toFixed(2)}
                      </p>
                    )}
                  </div>

                  <AddBundleToCartButton bundle={bundle} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}