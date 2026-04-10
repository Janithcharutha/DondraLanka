// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { ChevronRight, Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useCart } from "@/components/providers/cart-provider"
// import { toast } from "@/components/ui/use-toast"

// interface OfferProduct {
//   _id: string
//   name: string
//   slug: string
//   productName?: string     // Add this
//   productSlug?: string    // Made optional
//   productImage?: string   // Add this
//   category: string
//   categoryName: string
//   image: string[]
//   images: string[]
//   originalPrice: number
//   discountedPrice: number
//   description: string
//   contents?: string[]
//   discountPercentage: number
//   product?: {
//     name: string
//     images: string[]
//     slug: string
//   }
// }

// export default function OffersPage() {
//   const { addItem } = useCart()
//   const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [addingToCart, setAddingToCart] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const response = await fetch('/api/offers')
//         if (!response.ok) throw new Error('Failed to fetch offers')
//         const data = await response.json()
        
//         const transformedData = data.map((offer: any) => ({
//           ...offer,
//           name: offer.productName || offer.product?.name || 'Untitled Product',
//           slug: offer.productSlug || offer.product?.slug || offer.slug || 
//                 (offer.productName || offer.product?.name || 'untitled')
//                   .toLowerCase()
//                   .replace(/[^a-z0-9]+/g, '-'),
//           image: offer.productImage 
//             ? [offer.productImage]
//             : offer.product?.images || offer.images || [],
//           categoryName: offer.categoryName || offer.category || 'Offer',
//         }))

//         console.log('Transformed offers:', transformedData) // Debug log
//         setOfferProducts(transformedData)
//       } catch (err) {
//         console.error('Fetch error:', err)
//         setError(err instanceof Error ? err.message : 'Failed to fetch offers')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchOffers()
//   }, [])

//   const handleAddToCart = async (product: OfferProduct) => {
//     try {
//       setAddingToCart(product._id)
//       await addItem({
//         type: 'offer',
//         itemId: product._id,
//         name: product.name,
//         // Add fallback for slug to ensure it's never undefined
//         slug: product.slug || product.productSlug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
//         image: Array.isArray(product.image) && product.image.length > 0 
//           ? product.image[0] 
//           : "/placeholder.svg",
//         price: product.discountedPrice,
//         originalPrice: product.originalPrice,
//         quantity: 1,
//         inStock: true,
//         discountPercentage: product.discountPercentage
//       })

//       toast({
//         title: "✅ Added to Cart",
//         description: (
//           <div className="space-y-2">
//             <p>{`${product.name} has been added to your cart.`}</p>
//             <Button asChild variant="outline" className="w-full">
//               <Link href="/cart">
//                 Proceed to Cart
//               </Link>
//             </Button>
//           </div>
//         ),
//         duration: 5000
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Could not add item to cart. Please try again.",
//         variant: "destructive"
//       })
//     } finally {
//       setAddingToCart(null)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto py-12 flex justify-center">
//         <div className="animate-pulse">Loading offers...</div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-12 text-center">
//         <p className="text-red-500 mb-4">{error}</p>
//         <button 
//           onClick={() => window.location.reload()} 
//           className="text-blue-600 hover:underline"
//         >
//           Try again
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-12">
//       {/* Breadcrumb */}
//       <div className="flex items-center text-sm text-gray-500 mb-8">
//         <Link href="/" className="hover:text-gray-800">
//           HOME
//         </Link>
//         <ChevronRight className="h-4 w-4 mx-2" />
//         <span className="text-gray-800">OFFERS</span>
//       </div>

//       <h1 className="font-playfair text-4xl mb-8 text-center">Special Offers</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {offerProducts.map((product) => (
//           <div 
//             key={product._id} 
//             className="group bg-white rounded-lg shadow-md overflow-hidden relative" // Added relative
//           >
//             {/* Offer badge - Updated positioning and styling */}
//             <div className="absolute top-2 left-2 z-20 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md">
//               {product.discountPercentage}% OFF
//             </div>

//             {/* Product image container */}
//             <div className="relative aspect-square bg-[#f5f0e8]">
//               <Link 
//                 href={`/offers/${product.slug || product.productSlug}`}
//                 className="block" // Add this to prevent tap effect
//               >
//                 <Image
//                   src={product.image?.[0] || product.images?.[0] || product.productImage || "/placeholder.svg"}
//                   alt={`${product.name || 'Product'} - ${product.discountPercentage}% off special offer`}
//                   fill
//                   className="object-contain transition-transform duration-500 group-hover:scale-105"
//                   priority={false}
//                   sizes="(max-width: 640px) 100vw, 
//                          (max-width: 768px) 50vw,
//                          (max-width: 1024px) 33vw,
//                          25vw"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.src = "/placeholder.svg";
//                   }}
//                 />
//               </Link>
//             </div>

//             {/* Product details */}
//             <div className="p-4 text-center">
//               <p className="text-sm text-gray-500 mb-1">{product.categoryName}</p>
//               <h3 className="font-playfair text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
//                 <Link 
//                   href={`/offers/${product.slug || product.productSlug}`} 
//                   className="hover:text-gray-600 block" // Add block to prevent tap effect
//                 >
//                   {product.name}
//                 </Link>
//               </h3>

//               <div className="flex justify-center items-center gap-2 mb-4">
//                 <span className="text-gray-500 line-through text-sm">
//                   Rs.{product.originalPrice.toLocaleString()}
//                 </span>
//                 <span className="font-semibold text-lg text-[#c9a77c]">
//                   Rs.{product.discountedPrice.toLocaleString()}
//                 </span>
//               </div>

//               {/* Add to Cart Button */}
//               <Button
//                 onClick={() => handleAddToCart(product)}
//                 disabled={addingToCart === product._id}
//                 className="w-full bg-[#c9a77c] hover:bg-[#b89669] text-white"
//               >
//                 {addingToCart === product._id ? (
//                   <span className="flex items-center gap-2">
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Adding...
//                   </span>
//                 ) : (
//                   "Add to Cart"
//                 )}
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

import type { Metadata } from "next/types"
import { buildMetadata } from "@/lib/seo"
import { getOffers } from "@/lib/api"
import OffersClient from "./offers-client"

export const metadata: Metadata = buildMetadata({
  title: "Special Offers",
  description:
    "Explore special offers on premium dried fish and seafood at DONDRA LANKA.",
  path: "/offers",
  keywords: [
    "seafood offers",
    "special offers dried fish",
    "discount seafood Sri Lanka",
  ],
})

export default async function OffersPage() {
  const offers = await getOffers()

  return <OffersClient initialOffers={offers} />
}