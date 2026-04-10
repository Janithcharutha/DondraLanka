// "use client"

// import { Suspense, use } from "react"
// import { useEffect, useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { ChevronRight, Minus, Plus } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useCart } from "@/components/providers/cart-provider"
// import { toast } from "@/components/ui/use-toast"

// interface Product {
//   productId: string
//   productName: string
//   quantity: number
//   price: number
// }

// interface BundleKit {
//   _id: string
//   name: string
//   slug: string
//   description: string
//   price: number
//   discountedPrice: number
//   images: string[]
//   products: Product[]
//   featured: boolean
//   status: 'active' | 'draft' | 'archived'
// }

// function BundleKitContent({ slug }: { slug: string }) {
//   const { addItem } = useCart()
//   const [quantity, setQuantity] = useState(1)
//   const [bundle, setBundle] = useState<BundleKit | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [addingToCart, setAddingToCart] = useState(false)

//   const getFirstImage = (images?: string[]): string => {
//     if (!images || !Array.isArray(images) || images.length === 0) {
//       return "/placeholder.svg"
//     }
//     return images[0]
//   }

//   useEffect(() => {
//     if (!slug) return

//     const fetchBundle = async () => {
//       try {
//         const response = await fetch(`/api/bundle-kits/${slug}`)
//         if (!response.ok) throw new Error('Failed to fetch bundle kit')
//         const data = await response.json()
//         setBundle(data)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Something went wrong')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchBundle()
//   }, [slug])

//   const incrementQuantity = () => setQuantity((prev) => prev + 1)
//   const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

//   const handleAddToCart = async () => {
//     if (!bundle) return

//     try {
//       setAddingToCart(true)
//       await addItem({
//         type: 'bundle',
//         itemId: bundle._id,
//         name: bundle.name,
//         slug: bundle.slug,
//         image: getFirstImage(bundle.images),
//         price: bundle.discountedPrice || bundle.price,
//         originalPrice: bundle.price,
//         quantity: quantity,
//         inStock: true,
//         products: bundle.products
//       })

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
//         duration: 5000
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Could not add item to cart. Please try again.",
//         variant: "destructive"
//       })
//     } finally {
//       setAddingToCart(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto py-12 flex justify-center items-center min-h-[60vh]">
//         <div className="animate-pulse text-xl">Loading...</div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-12">
//         <h1 className="text-2xl font-bold">Error</h1>
//         <p className="text-red-600">{error}</p>
//         <Link href="/bundle-kits" className="text-blue-600 hover:underline">
//           Return to Bundle Kits
//         </Link>
//       </div>
//     )
//   }

//   if (!bundle) {
//     return (
//       <div className="container mx-auto py-12">
//         <h1 className="text-2xl font-bold">Bundle Kit not found</h1>
//         <Link href="/bundle-kits" className="text-blue-600 hover:underline">
//           Return to Bundle Kits
//         </Link>
//       </div>
//     )
//   }

//   const savings = bundle.price - (bundle.discountedPrice || bundle.price)
//   const savingsPercentage = Math.round((savings / bundle.price) * 100)

//   return (
//     <div className="container mx-auto py-8">
//       {/* Breadcrumb */}
//       <div className="flex items-center text-sm text-gray-500 mb-8">
//         <Link href="/" className="hover:text-gray-800">
//           HOME
//         </Link>
//         <ChevronRight className="h-4 w-4 mx-2" />
//         <Link href="/bundle-kits" className="hover:text-gray-800">
//           BUNDLE KITS
//         </Link>
//         <ChevronRight className="h-4 w-4 mx-2" />
//         <span className="text-gray-800">{bundle.name}</span>
//       </div>

//       <div className="grid md:grid-cols-2 gap-12">
//         {/* Bundle Image */}
//         <div className="relative">
//           {savings > 0 && (
//             <div className="absolute top-4 left-4 z-10 bg-black text-white rounded-full px-4 py-1 text-sm font-medium">
//               SAVE {savingsPercentage}%
//             </div>
//           )}

//           <div className="bg-[#f5f0e8] rounded-lg overflow-hidden">
//             <Image
//               src={getFirstImage(bundle.images)}
//               alt={bundle.name}
//               width={600}
//               height={600}
//               className="w-full h-auto object-contain"
//               priority
//               unoptimized={process.env.NODE_ENV === 'development'}
//             />
//           </div>
//         </div>

//         {/* Bundle Details */}
//         <div>
//           <h1 className="font-playfair text-3xl mb-2">
//             {bundle.name}
//           </h1>

//           {/* Prices */}
//           <div className="flex items-center gap-3 mb-4">
//             <span className="text-2xl font-semibold">
//               Rs.{(bundle.discountedPrice || bundle.price).toLocaleString()}
//             </span>
//             {bundle.discountedPrice && (
//               <span className="text-gray-500 line-through">
//                 Rs.{bundle.price.toLocaleString()}
//               </span>
//             )}
//           </div>

//           {/* Quantity and Add to Cart */}
//           <div className="flex items-center gap-4 mb-8">
//             <div className="flex items-center border border-gray-300">
//               <button 
//                 className="px-3 py-2 border-r border-gray-300" 
//                 onClick={decrementQuantity}
//                 disabled={addingToCart}
//               >
//                 <Minus className="h-4 w-4" />
//               </button>
//               <input
//                 type="number"
//                 min="1"
//                 value={quantity}
//                 onChange={(e) => setQuantity(Number(e.target.value) || 1)}
//                 className="h-10 w-16 text-center border-none focus:outline-none"
//                 disabled={addingToCart}
//               />
//               <button 
//                 className="px-3 py-2 border-l border-gray-300" 
//                 onClick={incrementQuantity}
//                 disabled={addingToCart}
//               >
//                 <Plus className="h-4 w-4" />
//               </button>
//             </div>
//             <Button 
//               onClick={handleAddToCart}
//               disabled={addingToCart}
//               className="bg-[#c9a77c] hover:bg-[#b89669] text-white px-8"
//             >
//               {addingToCart ? (
//                 <span className="flex items-center gap-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Adding...
//                 </span>
//               ) : (
//                 "Add to Cart"
//               )}
//             </Button>
//           </div>

//           {/* Bundle Description */}
//           <div className="mb-8">
//             <h3 className="font-medium mb-2">Description</h3>
//             <p className="text-gray-700">{bundle.description}</p>
//           </div>

//           {/* Bundle Contents */}
//           <div className="mb-8">
//             <h3 className="font-medium mb-2">Bundle Contains</h3>
//             <ul className="space-y-4">
//               {bundle.products.map((product, index) => (
//                 <li key={index} className="border-b pb-4">
//                   <h4 className="font-medium mb-1">{product.productName}</h4>
//                   <p className="text-gray-600">Quantity: {product.quantity}</p>
//                   <p className="text-gray-600">Price: Rs.{product.price.toLocaleString()}</p>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function BundleKitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
//   const resolvedParams = use(params)
  
//   return (
//     <Suspense fallback={
//       <div className="container mx-auto py-12 flex justify-center items-center min-h-[60vh]">
//         <div className="animate-pulse text-xl">Loading bundle details...</div>
//       </div>
//     }>
//       <BundleKitContent slug={resolvedParams.slug} />
//     </Suspense>
//   )
// }

import type { Metadata } from "next/types";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getBundleKitBySlug } from "@/lib/api";
import BundleKitDetailClient from "./BundleKitDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundleKitBySlug(slug);

  if (!bundle) {
    return buildMetadata({
      title: "Bundle Kit Not Found",
      description: "The requested bundle kit could not be found.",
      path: `/bundle-kits/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: bundle.name,
    description:
      bundle.description ||
      `Explore the ${bundle.name} bundle kit from DONDRA LANKA.`,
    path: `/bundle-kits/${bundle.slug}`,
    image: bundle.images?.[0] || "/og-image.jpg",
    keywords: [bundle.name, "seafood bundle kit", "dried fish bundle"],
  });
}

export default async function BundleKitDetailPage({ params }: Props) {
  const { slug } = await params;
  const bundle = await getBundleKitBySlug(slug);

  if (!bundle) {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.dondralanka.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Bundle Kits",
        item: "https://www.dondralanka.com/bundle-kits",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: bundle.name,
        item: `https://www.dondralanka.com/bundle-kits/${bundle.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BundleKitDetailClient bundle={bundle} />
    </>
  );
}