// "use client"

// import React, { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Search, ShoppingBag, ChevronDown, Menu, X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { type FC } from "react"
// import { usePathname } from "next/navigation"
// import { UserButton, useUser } from "@clerk/nextjs"
// import { useCart } from "@/components/providers/cart-provider"

// interface Subcategory {
//   _id: string
//   name: string
//   slug: string
//   description?: string
// }

// interface Category {
//   _id: string
//   name: string
//   slug: string
//   description?: string
//   image?: string
//   subcategories: Subcategory[]
// }

// const Header: FC = () => {
//   const { isSignedIn, user } = useUser()
//   const { items } = useCart()
//   const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  
//   const [isProductsOpen, setIsProductsOpen] = useState(false)
//   // const [isBranchesOpen, setIsBranchesOpen] = useState(false)
//   const [categories, setCategories] = useState<Category[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const pathname = usePathname()

//   // Check if current path is an admin route
//   const isAdminRoute = pathname?.startsWith('/admin')

//   // Don't render header in admin routes
//   if (isAdminRoute) return null

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setIsLoading(true)
//         const response = await fetch('/api/categories')
//         if (!response.ok) throw new Error('Failed to fetch categories')
//         const data = await response.json()
//         setCategories(data)
//       } catch (error) {
//         console.error('Error fetching categories:', error)
//         setError(error instanceof Error ? error.message : 'Failed to fetch categories')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchCategories()
//   }, [])

//   // Close mobile menu when route changes
//   useEffect(() => {
//     setMobileMenuOpen(false)
//   }, [pathname])

//   const authButtons = isSignedIn ? (
//     <li className="flex items-center gap-4">
//       <span className="text-sm">Hello, {user.firstName}</span>
//       <UserButton afterSignOutUrl="/" />
//     </li>
//   ) : null

//   const mobileAuthButton = isSignedIn ? (
//     <li className="flex items-center justify-between py-2">
//       <span className="text-sm">Hello, {user.firstName}</span>
//       <UserButton afterSignOutUrl="/" />
//     </li>
//   ) : null

//   return (
//     <header className="sticky top-0 z-50 bg-[#5900ba] text-white">
//       {/* Top bar - hidden on mobile */}
//       <div className="hidden md:flex justify-center items-center py-1 border-b border-beige-dark">
//         <div className="absolute top-2 left-4 mt-10 md:left-8">
//           <div className="flex gap-2 md:gap-4">
//             <Button variant="outline" className="rounded-full text-xs h-8 px-3 md:px-4 border-white bg-[#5900ba] hover:text-black hover:bg-[#9b38f2]">
//               ISLANDWIDE DELIVERY
//             </Button>
//             {/* <Button variant="outline" className="rounded-full text-xs h-8 px-3 md:px-4 border-white bg-[#5900ba] hover:text-black hover:bg-[#9b38f2]">
//               OFFERS
//             </Button> */}
//             <Link href="/offers">
//               <Button
//                 variant="outline"
//                 className="rounded-full text-xs h-8 px-3 md:px-4 border-white bg-[#5900ba] hover:text-black hover:bg-[#9b38f2]"
//               >
//                 OFFERS
//               </Button>
//             </Link>
//             {/* <Button variant="outline" className="rounded-full text-xs h-8 px-3 md:px-4 border-black">
//               <Search className="h-4 w-4" />
//             </Button> */}
//           </div>
//         </div>

//         {/* <div className="absolute top-2 right-4 mt-10 md:right-8">
//           <Link href="/cart" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium relative">
//             {itemCount > 0 && (
//               <span className="absolute -top-3 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {itemCount}
//               </span>
//             )}
//             <span className="hidden sm:inline">CART</span>
//             <span className="text-xs md:text-sm">
//               / RS.{items.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString()}
//             </span>
//             <ShoppingBag className="h-4 w-4" />
//           </Link>
//         </div> */}
//         <div className="absolute top-2 right-4 mt-10 md:right-8">
//   <Link
//     href="/cart"
//     className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium relative 
//                rounded-full px-3 md:px-4 h-8
//                border border-white 
//                bg-[#5900ba] text-white 
//                hover:bg-[#9b38f2] hover:text-black 
//                transition-colors"
//   >
//     {itemCount > 0 && (
//       <span className="absolute -top-3 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//         {itemCount}
//       </span>
//     )}

//     <span className="hidden sm:inline">CART</span>
//     <span className="text-xs md:text-sm">
//       / RS.{items.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString()}
//     </span>
//     <ShoppingBag className="h-4 w-4" />
//   </Link>
// </div>
//       </div>

//       {/* Mobile header */}
//       <div className="md:hidden flex justify-between items-center px-4 py-3 border-b border-beige-dark">
//         <button 
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           className="p-2"
//         >
//           {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
        
//         <Link href="/" className="flex-grow flex justify-center">
//           <Image
//             src="/logo.png"
//             alt="DONDRA LANKA"
//             width={120}
//             height={60}
//             className="h-auto scale-[1.2]"
//           />
//         </Link>
// <Link href="/cart" className="p-2 relative">
//   <div className="relative w-6 h-6">
//     <ShoppingBag size={20} />

//     {itemCount > 0 && (
//       <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
//         {itemCount}
//       </span>
//     )}
//   </div>
// </Link>
//       </div>

//       {/* Logo - hidden on mobile */}
//       <div className="hidden md:flex justify-center py-3">
//         <Link href="/">
//           <Image
//             src="/logo.png"
//             alt="DONDRA LANKA"
//             width={180}
//             height={80}
//             className="h-auto scale-[1.5]"
//           />
//         </Link>
//       </div>

//       {/* Mobile menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-white border-b border-beige-dark">
//           <nav className="px-4 py-2">
//             <ul className="space-y-4">
//               <li>
//                 <Link href="/" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                   HOME
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/shop" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                   SHOP
//                 </Link>
//               </li>
//               {/* <li>
//                 <button 
//                   onClick={() => setIsProductsOpen(!isProductsOpen)}
//                   className="flex items-center justify-between w-full py-2 hover:text-gray-600 transition-colors"
//                 >
//                   PRODUCTS
//                   <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
//                 </button>
//                 {isProductsOpen && (
//                   <div className="pl-4 mt-2 space-y-3">
//                     {categories.map((category: Category) => (
//                       <div key={category._id} className="mb-4">
//                         <h3 className="font-medium mb-2">
//                           <Link href={`/products/${category.slug}`} className="hover:text-gray-600">
//                             {category.name}
//                           </Link>
//                         </h3>
//                         <ul className="pl-4 space-y-2">
//                           {category.subcategories.map((subcategory: Subcategory) => (
//                             <li key={subcategory._id}>
//                               <Link
//                                 href={`/products/${category.slug}/${subcategory.slug}`}
//                                 className="block text-gray-600 hover:text-black"
//                               >
//                                 {subcategory.name}
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </li> */}
//               <li>
//   <button 
//     onClick={() => setIsProductsOpen(!isProductsOpen)}
//     className="flex items-center justify-between w-full px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors"
//   >
//     PRODUCTS
//     <ChevronDown 
//       className={`h-4 w-4 ml-1 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} 
//     />
//   </button>

//   {isProductsOpen && (
//     <div className="pl-4 mt-2 space-y-3 bg-[#5900ba]/10 rounded-md p-3">
//       {categories.map((category: Category) => (
//         <div key={category._id} className="mb-4">
          
//           {/* Category Title */}
//           <h3 className="font-medium mb-2">
//             <Link 
//               href={`/products/${category.slug}`} 
//               className="text-[#5900ba] hover:text-black transition-colors"
//             >
//               {category.name}
//             </Link>
//           </h3>

//           {/* Subcategories */}
//           <ul className="pl-4 space-y-2">
//             {category.subcategories.map((subcategory: Subcategory) => (
//               <li key={subcategory._id}>
//                 <Link
//                   href={`/products/${category.slug}/${subcategory.slug}`}
//                   className="block px-2 py-1 rounded text-gray-700 hover:bg-[#9b38f2] hover:text-white transition-colors"
//                 >
//                   {subcategory.name}
//                 </Link>
//               </li>
//             ))}
//           </ul>

//         </div>
//       ))}
//     </div>
//   )}
// </li>
//               <li>
//                 <Link href="/offers" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                   OFFERS
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/bundle-kits" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                   BUNDLE KITS
//                 </Link>
//               </li>
//               {/* <li>
//                 <button 
//                   onClick={() => setIsBranchesOpen(!isBranchesOpen)}
//                   className="flex items-center justify-between w-full py-2 hover:text-gray-600 transition-colors"
//                 >
//                   BRANCHES
//                   <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isBranchesOpen ? 'rotate-180' : ''}`} />
//                 </button>
//                 {isBranchesOpen && (
//                   <div className="pl-4 mt-2 space-y-2">
//                     <Link href="/branches/colombo" className="block hover:text-gray-600">
//                       Colombo
//                     </Link>
//                     <Link href="/branches/kandy" className="block hover:text-gray-600">
//                       Kandy
//                     </Link>
//                     <Link href="/branches/galle" className="block hover:text-gray-600">
//                       Galle
//                     </Link>
//                   </div>
//                 )}
//               </li> */}
//               <li>
//                 <Link href="/about" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                   ABOUT
//                 </Link>
//               </li>
//               {mobileAuthButton}
//             </ul>
//           </nav>
//         </div>
//       )}

//       {/* Desktop navigation */}
//       <nav className="hidden md:block border-t border-b border-beige-dark relative z-40">
//         <ul className="flex justify-center items-center gap-4 lg:gap-6 py-1 text-sm">
//           <li>
//             <Link href="/" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//               HOME
//             </Link>
//           </li>
//           <li>
//             <Link href="/shop" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//               SHOP
//             </Link>
//           </li>
          
//           <li
//             className="relative dropdown"
//             onMouseEnter={() => setIsProductsOpen(true)}
//             onMouseLeave={() => setIsProductsOpen(false)}
//           >
//             <Link href="/products" className="flex items-center px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors"
//          >
//               PRODUCTS <ChevronDown className="h-4 w-4 ml-1" />
//                       </Link>

//           {isProductsOpen && (
//             <div className="dropdown-menu bg-white shadow-lg p-6 min-w-[600px] z-50 grid grid-cols-3 gap-6 rounded-md border border-gray-200">
              
//               {categories.map((category: Category) => (
//                 <div key={category._id}>
                  
//                   {/* Category Title */}
//                   <h3 className="font-medium mb-4">
//                     <Link 
//                       href={`/products/${category.slug}`} 
//                       className="text-[#5900ba] hover:text-black transition-colors"
//                     >
//                       {category.name}
//                     </Link>
//                   </h3>

//                   {/* Subcategories */}
//                   <ul className="space-y-3">
//                     {category.subcategories.map((subcategory: Subcategory) => (
//                       <li key={subcategory._id}>
//                         <Link
//                           href={`/products/${category.slug}/${subcategory.slug}`}
//                           className="block px-2 py-1 rounded text-gray-700 hover:bg-[#9b38f2] hover:text-white transition-colors"
//                         >
//                           {subcategory.name}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>

//                 </div>
//               ))}

//             </div>
//           )}
//           </li>
          
//           <li>
//             <Link href="/offers" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//               OFFERS
//             </Link>
//           </li>
//           <li>
//             <Link href="/bundle-kits" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//               BUNDLE KITS
//             </Link>
//           </li>
//           <li>
//             <Link 
//               href="/about"
//               className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors"
//             >
//               ABOUT
//             </Link>
//           </li>
//           {authButtons}
//         </ul>
//       </nav>
//     </header>
//   )
// }

// export default Header

// "use client"

// import React, { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Search, ShoppingBag, ChevronDown, Menu, X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { type FC } from "react"
// import { usePathname } from "next/navigation"
// import { UserButton, useUser } from "@clerk/nextjs"
// import { useCart } from "@/components/providers/cart-provider"

// interface Subcategory {
//   _id: string
//   name: string
//   slug: string
//   description?: string
// }

// interface Category {
//   _id: string
//   name: string
//   slug: string
//   description?: string
//   image?: string
//   subcategories: Subcategory[]
// }



// const Header: FC = () => {
//   const { isSignedIn, user } = useUser()
//   const { items } = useCart()
//   const itemCount = items.reduce((total, item) => total + item.quantity, 0)

//   const [isProductsOpen, setIsProductsOpen] = useState(false)
//   // const [isBranchesOpen, setIsBranchesOpen] = useState(false)
//   const [categories, setCategories] = useState<Category[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [showTopBranding, setShowTopBranding] = useState(true)
//   const pathname = usePathname()

//   // Check if current path is an admin route
//   const isAdminRoute = pathname?.startsWith("/admin")

//   // Don't render header in admin routes
//   if (isAdminRoute) return null

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setIsLoading(true)
//         const response = await fetch("/api/categories")
//         if (!response.ok) throw new Error("Failed to fetch categories")
//         const data = await response.json()
//         setCategories(data)
//       } catch (error) {
//         console.error("Error fetching categories:", error)
//         setError(error instanceof Error ? error.message : "Failed to fetch categories")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchCategories()
//   }, [])

//   // kept without removing your state logic structure
//   useEffect(() => {
//     const handleScroll = () => {
//       setShowTopBranding(window.scrollY <= 0)
//     }

//     handleScroll()
//     window.addEventListener("scroll", handleScroll, { passive: true })

//     return () => {
//       window.removeEventListener("scroll", handleScroll)
//     }
//   }, [])

//   // Close mobile menu when route changes
//   useEffect(() => {
//     setMobileMenuOpen(false)
//   }, [pathname])

//   const authButtons = isSignedIn ? (
//     <li className="flex items-center gap-4">
//       <span className="text-sm">Hello, {user.firstName}</span>
//       <UserButton afterSignOutUrl="/" />
//     </li>
//   ) : null

//   const mobileAuthButton = isSignedIn ? (
//     <li className="flex items-center justify-between py-2">
//       <span className="text-sm">Hello, {user.firstName}</span>
//       <UserButton afterSignOutUrl="/" />
//     </li>
//   ) : null

//   return (
//     <>
//       {/* Desktop top branding - not sticky, so no bounce */}
//       <div className="hidden md:block bg-[#5900ba] text-white">
//         <div className="flex items-center justify-center px-6 lg:px-10 py-3 border-b border-white/20 text-center">
//           <Link href="/" className="flex items-center gap-4 min-w-0">
//             <Image
//               src="/logo.png"
//               alt="DONDRA LANKA"
//               width={160}
//               height={160}
//               className="w-[90px] lg:w-[120px] h-auto object-contain"
//             />

//             <div className="leading-tight">
// <h1
//   className="text-2xl lg:text-3xl uppercase tracking-wider"
//   style={{
//     fontFamily: "Ethnocentric",
//     color: "#81106f",
//     textShadow: `
//       0 0 2px #fff6ff,
//       0 0 6px #fff6ff,
//       1px 1px 0 #ffffff,
//       -1px -1px 0 #ffffff,
//       1px -1px 0 #ffffff,
//       -1px 1px 0 #ffffff
//     `,
//   }}
// >
//   DONDRA LANKA
// </h1>
// <p
//   className="text-sm lg:text-base font-semibold uppercase tracking-wider"
//   style={{
    
//     color: "#ffffff",
//     // textShadow: `
//     //   0 0 2px #fff6ff,
//     //   0 0 6px #fff6ff,
//     //   1px 1px 0 #ffffff,
//     //   -1px -1px 0 #ffffff,
//     //   1px -1px 0 #ffffff,
//     //   -1px 1px 0 #ffffff
//     // `,
//   }}
// >
//   PREMIUM QUALITY BOAT DRIED FISH
// </p>
// <p
//   className="text-sm lg:text-base font-semibold"
//   style={{
//     color: "#ffffff",
//     // textShadow: `
//     //   1px 1px 0 #7a5688,
//     //   -1px -1px 0 #7a5688,
//     //   1px -1px 0 #7a5688,
//     //   -1px 1px 0 #7a5688,
//     //   0 0 6px #7a5688
//     // `,
//   }}
// >
//   Wholesale, Retail And Export
// </p>

// <p
//   className="text-xl lg:text-2xl font-extrabold"
//   style={{
//     color: "#ffffff",
//     // textShadow: `
//     //   1px 1px 0 #7a5688,
//     //   -1px -1px 0 #7a5688,
//     //   1px -1px 0 #7a5688,
//     //   -1px 1px 0 #7a5688,
//     //   0 0 8px #7a5688
//     // `,
//   }}
// >
//   Online Store
// </p>
//             </div>
//           </Link>

//           <div className="shrink-0">
//             {isSignedIn && (
//               <div className="flex items-center gap-4">
//                 <span className="text-sm">Hello, {user.firstName}</span>
//                 <UserButton afterSignOutUrl="/" />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <header className="sticky top-0 z-50 bg-[#5900ba] text-white">
//         {/* Mobile header */}
//         {/* <div className="md:hidden flex justify-between items-center px-4 py-3 border-b border-beige-dark">
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="p-2"
//           >
//             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>

//           <Link href="/" className="flex-grow flex justify-center">
//             <Image
//               src="/logo.png"
//               alt="DONDRA LANKA"
//               width={120}
//               height={60}
//               className="h-auto scale-[1.2]"
//             />
//           </Link>

//           <Link href="/cart" className="p-2 relative">
//             <div className="relative w-6 h-6">
//               <ShoppingBag size={20} />

//               {itemCount > 0 && (
//                 <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
//                   {itemCount}
//                 </span>
//               )}
//             </div>
//           </Link>
//         </div> */}
// {/* Mobile Branding (logo left, text right like desktop) */}
// <div className="md:hidden bg-[#5900ba] text-white border-b border-white/20">
//   <div className="px-3 pt-3 pb-2">
//     <Link href="/" className="flex items-center justify-center gap-3">
//       <Image
//         src="/logo.png"
//         alt="DONDRA LANKA"
//         width={120}
//         height={120}
//         className="w-[72px] sm:w-[82px] h-auto object-contain shrink-0"
//       />

//       <div className="leading-tight text-center">
//         <h1
//           className="text-[20px] sm:text-[24px] uppercase tracking-wider"
//           style={{
//             fontFamily: "Ethnocentric",
//             color: "#81106f",
//             textShadow: `
//               0 0 2px #fff6ff,
//               0 0 6px #fff6ff,
//               1px 1px 0 #ffffff,
//               -1px -1px 0 #ffffff,
//               1px -1px 0 #ffffff,
//               -1px 1px 0 #ffffff
//             `,
//           }}
//         >
//           DONDRA LANKA
//         </h1>

//         <p
//           className="text-[10px] sm:text-[12px] font-semibold uppercase tracking-wider"
//           style={{
//             color: "#ffffff",
//             // textShadow: `
//             //   0 0 2px #fff6ff,
//             //   0 0 6px #fff6ff,
//             //   1px 1px 0 #ffffff,
//             //   -1px -1px 0 #ffffff,
//             //   1px -1px 0 #ffffff,
//             //   -1px 1px 0 #ffffff
//             // `,
//           }}
//         >
//           PREMIUM QUALITY BOAT DRIED FISH
//         </p>

//         <p
//           className="text-[10px] sm:text-[12px] font-semibold"
//           style={{
//             color: "#ffffff",
//             // textShadow: `
//             //   1px 1px 0 #7a5688,
//             //   -1px -1px 0 #7a5688,
//             //   1px -1px 0 #7a5688,
//             //   -1px 1px 0 #7a5688,
//             //   0 0 8px #7a5688,
//             //   0 0 12px #7a5688
//             // `,
//           }}
//         >
//           Wholesale, Retail And Export
//         </p>

//         <p
//           className="text-[16px] sm:text-[18px] font-extrabold"
//           style={{
//             color: "#ffffff",
//             // textShadow: `
//             //   1px 1px 0 #7a5688,
//             //   -1px -1px 0 #7a5688,
//             //   1px -1px 0 #7a5688,
//             //   -1px 1px 0 #7a5688,
//             //   0 0 10px #7a5688,
//             //   0 0 16px #7a5688
//             // `,
//           }}
//         >
//           Online Store
//         </p>
//       </div>
//     </Link>
//   </div>

//   {/* Menu + Cart Row */}
//   <div className="flex justify-between items-center px-4 py-2">
//     <button
//       onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//       className="p-2"
//     >
//       {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
//     </button>

//     <Link href="/cart" className="relative p-2">
//       <ShoppingBag size={20} />
//       {itemCount > 0 && (
//         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
//           {itemCount}
//         </span>
//       )}
//     </Link>
//   </div>
// </div>
//         {/* Mobile menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden bg-white border-b border-beige-dark">
//             <nav className="px-4 py-2">
//               <ul className="space-y-4">
//                 <li>
//                   <Link href="/" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                     HOME
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/shop" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                     SHOP
//                   </Link>
//                 </li>

//                 <li>
//                   <button
//                     onClick={() => setIsProductsOpen(!isProductsOpen)}
//                     className="flex items-center justify-between w-full px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors"
//                   >
//                     PRODUCTS
//                     <ChevronDown
//                       className={`h-4 w-4 ml-1 transition-transform ${isProductsOpen ? "rotate-180" : ""}`}
//                     />
//                   </button>

//                   {isProductsOpen && (
//                     <div className="pl-4 mt-2 space-y-3 bg-[#5900ba]/10 rounded-md p-3">
//                       {categories.map((category: Category) => (
//                         <div key={category._id} className="mb-4">
//                           <h3 className="font-medium mb-2">
//                             <Link
//                               href={`/products/${category.slug}`}
//                               className="text-[#5900ba] hover:text-black transition-colors"
//                             >
//                               {category.name}
//                             </Link>
//                           </h3>

//                           <ul className="pl-4 space-y-2">
//                             {category.subcategories.map((subcategory: Subcategory) => (
//                               <li key={subcategory._id}>
//                                 <Link
//                                   href={`/products/${category.slug}/${subcategory.slug}`}
//                                   className="block px-2 py-1 rounded text-gray-700 hover:bg-[#9b38f2] hover:text-white transition-colors"
//                                 >
//                                   {subcategory.name}
//                                 </Link>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </li>

//                 <li>
//                   <Link href="/offers" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                     OFFERS
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/bundle-kits" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                     BUNDLE KITS
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/about" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                     ABOUT
//                   </Link>
//                 </li>
//                 {mobileAuthButton}
//               </ul>
//             </nav>
//           </div>
//         )}

//         {/* Desktop navigation */}
//         <nav className="hidden md:block border-t border-b border-beige-dark relative z-40 bg-[#5900ba]">
//           <div className="relative flex items-center justify-center px-6 lg:px-10 py-1">
//             <ul className="flex justify-center items-center gap-4 lg:gap-6 text-sm">
//               <li>
//                 <Link href="/" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                   HOME
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/shop" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                   SHOP
//                 </Link>
//               </li>

//               <li
//                 className="relative dropdown"
//                 onMouseEnter={() => setIsProductsOpen(true)}
//                 onMouseLeave={() => setIsProductsOpen(false)}
//               >
//                 <Link
//                   href="/products"
//                   className="flex items-center px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors"
//                 >
//                   PRODUCTS <ChevronDown className="h-4 w-4 ml-1" />
//                 </Link>

//                 {isProductsOpen && (
//                   <div className="dropdown-menu absolute left-1/2 top-full -translate-x-1/2 bg-white shadow-lg p-6 min-w-[600px] z-50 grid grid-cols-3 gap-6 rounded-md border border-gray-200">
//                     {categories.map((category: Category) => (
//                       <div key={category._id}>
//                         <h3 className="font-medium mb-4">
//                           <Link
//                             href={`/products/${category.slug}`}
//                             className="text-[#5900ba] hover:text-black transition-colors"
//                           >
//                             {category.name}
//                           </Link>
//                         </h3>

//                         <ul className="space-y-3">
//                           {category.subcategories.map((subcategory: Subcategory) => (
//                             <li key={subcategory._id}>
//                               <Link
//                                 href={`/products/${category.slug}/${subcategory.slug}`}
//                                 className="block px-2 py-1 rounded text-gray-700 hover:bg-[#9b38f2] hover:text-white transition-colors"
//                               >
//                                 {subcategory.name}
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </li>

//               <li>
//                 <Link href="/offers" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                   OFFERS
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/bundle-kits" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
//                   BUNDLE KITS
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/about"
//                   className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors"
//                 >
//                   ABOUT
//                 </Link>
//               </li>
//             </ul>

//             <div className="absolute right-4 lg:right-8">
//               <Link
//                 href="/cart"
//                 className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium relative rounded-full px-3 md:px-4 h-8 border border-white bg-[#5900ba] text-white hover:bg-[#9b38f2] hover:text-black transition-colors"
//               >
//                 {itemCount > 0 && (
//                   <span className="absolute -top-3 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {itemCount}
//                   </span>
//                 )}

//                 <span className="hidden sm:inline">CART</span>
//                 <span className="text-xs md:text-sm">
//                   / RS.{items.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
//                 </span>
//                 <ShoppingBag className="h-4 w-4" />
//               </Link>
//             </div>
//           </div>
//         </nav>
//       </header>
//     </>
//   )
// }

// export default Header

"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type FC } from "react"
import { usePathname } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import { useCart } from "@/components/providers/cart-provider"

interface Subcategory {
  _id: string
  name: string
  slug: string
  description?: string
}

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  subcategories: Subcategory[]
}

const Header: FC = () => {
  const { isSignedIn, user } = useUser()
  const { items } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const [isProductsOpen, setIsProductsOpen] = useState(false)
  // const [isBranchesOpen, setIsBranchesOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showTopBranding, setShowTopBranding] = useState(true)
  const pathname = usePathname()

  // Check if current path is an admin route
  const isAdminRoute = pathname?.startsWith("/admin")

  // Don't render header in admin routes
  if (isAdminRoute) return null

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch categories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // kept without removing your state logic structure
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBranding(window.scrollY <= 0)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileMenuOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const authButtons = isSignedIn ? (
    <li className="flex items-center gap-4">
      <span className="text-sm">Hello, {user.firstName}</span>
      <UserButton afterSignOutUrl="/" />
    </li>
  ) : null

  const mobileAuthButton = isSignedIn ? (
    <li className="flex items-center justify-between py-2">
      <span className="text-sm">Hello, {user.firstName}</span>
      <UserButton afterSignOutUrl="/" />
    </li>
  ) : null

  return (
    <>
      {/* Desktop top branding - not sticky, so no bounce */}
      <div className="hidden md:block bg-[#5900ba] text-white">
        <div className="flex items-center justify-center px-6 lg:px-10 py-3 border-b border-white/20 text-center">
          <Link href="/" className="flex items-center gap-4 min-w-0">
            <Image
              src="/logo.png"
              alt="DONDRA LANKA"
              width={160}
              height={160}
              className="w-[90px] lg:w-[120px] h-auto object-contain"
            />

            <div className="leading-tight">
              <h1
                className="text-2xl lg:text-3xl uppercase tracking-wider"
                style={{
                  fontFamily: "Ethnocentric",
                  color: "#81106f",
                  textShadow: `
                    0 0 2px #fff6ff,
                    0 0 6px #fff6ff,
                    1px 1px 0 #ffffff,
                    -1px -1px 0 #ffffff,
                    1px -1px 0 #ffffff,
                    -1px 1px 0 #ffffff
                  `,
                }}
              >
                DONDRA LANKA
              </h1>
              <p
                className="text-sm lg:text-base font-semibold uppercase tracking-wider"
                style={{
                  color: "#81106f",
                  textShadow: `
                    0 0 2px #fff6ff,
                    0 0 6px #fff6ff,
                    1px 1px 0 #ffffff,
                    -1px -1px 0 #ffffff,
                    1px -1px 0 #ffffff,
                    -1px 1px 0 #ffffff
                  `,
                }}
              >
                PREMIUM QUALITY BOAT DRIED FISH
              </p>
              <p
                className="text-sm lg:text-base font-semibold"
                style={{
                  color: "#ffffff",
                  textShadow: `
                    1px 1px 0 #7a5688,
                    -1px -1px 0 #7a5688,
                    1px -1px 0 #7a5688,
                    -1px 1px 0 #7a5688,
                    0 0 6px #7a5688
                  `,
                }}
              >
                Wholesale, Retail And Export
              </p>

              <p
                className="text-xl lg:text-2xl font-extrabold"
                style={{
                  color: "#ffffff",
                  textShadow: `
                    1px 1px 0 #7a5688,
                    -1px -1px 0 #7a5688,
                    1px -1px 0 #7a5688,
                    -1px 1px 0 #7a5688,
                    0 0 8px #7a5688
                  `,
                }}
              >
                Online Store
              </p>
            </div>
          </Link>

          <div className="shrink-0">
            {isSignedIn && (
              <div className="flex items-center gap-4">
                <span className="text-sm">Hello, {user.firstName}</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#5900ba] text-white">
        {/* Mobile Branding (logo left, text right like desktop) */}
        <div className="md:hidden bg-[#5900ba] text-white border-b border-white/20">
          <div className="px-3 pt-3 pb-2">
            <Link href="/" className="flex items-center justify-center gap-3">
              <Image
                src="/logo.png"
                alt="DONDRA LANKA"
                width={120}
                height={120}
                className="w-[72px] sm:w-[82px] h-auto object-contain shrink-0"
              />

              <div className="leading-tight text-center">
                <h1
                  className="text-[20px] sm:text-[24px] uppercase tracking-wider"
                  style={{
                    fontFamily: "Ethnocentric",
                    color: "#81106f",
                    textShadow: `
                      0 0 2px #fff6ff,
                      0 0 6px #fff6ff,
                      1px 1px 0 #ffffff,
                      -1px -1px 0 #ffffff,
                      1px -1px 0 #ffffff,
                      -1px 1px 0 #ffffff
                    `,
                  }}
                >
                  DONDRA LANKA
                </h1>

                <p
                  className="text-[10px] sm:text-[12px] font-semibold uppercase tracking-wider"
                  style={{
                    color: "#81106f",
                    textShadow: `
                      0 0 2px #fff6ff,
                      0 0 6px #fff6ff,
                      1px 1px 0 #ffffff,
                      -1px -1px 0 #ffffff,
                      1px -1px 0 #ffffff,
                      -1px 1px 0 #ffffff
                    `,
                  }}
                >
                  PREMIUM QUALITY BOAT DRIED FISH
                </p>

                <p
                  className="text-[10px] sm:text-[12px] font-semibold"
                  style={{
                    color: "#ffffff",
                    textShadow: `
                      1px 1px 0 #7a5688,
                      -1px -1px 0 #7a5688,
                      1px -1px 0 #7a5688,
                      -1px 1px 0 #7a5688,
                      0 0 8px #7a5688,
                      0 0 12px #7a5688
                    `,
                  }}
                >
                  Wholesale, Retail And Export
                </p>

                <p
                  className="text-[16px] sm:text-[18px] font-extrabold"
                  style={{
                    color: "#ffffff",
                    textShadow: `
                      1px 1px 0 #7a5688,
                      -1px -1px 0 #7a5688,
                      1px -1px 0 #7a5688,
                      -1px 1px 0 #7a5688,
                      0 0 10px #7a5688,
                      0 0 16px #7a5688
                    `,
                  }}
                >
                  Online Store
                </p>
              </div>
            </Link>
          </div>

          {/* Menu + Cart Row */}
          <div className="flex justify-between items-center px-4 py-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link href="/cart" className="relative p-2">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-beige-dark max-h-[80vh] overflow-y-auto">
            <nav className="px-4 py-2">
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
                    HOME
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
                    SHOP
                  </Link>
                </li>

                <li>
                  <button
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors"
                  >
                    PRODUCTS
                    <ChevronDown
                      className={`h-4 w-4 ml-1 transition-transform ${isProductsOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isProductsOpen && (
                    <div className="pl-4 mt-2 space-y-3 bg-[#5900ba]/10 rounded-md p-3">
                      {categories.map((category: Category) => (
                        <div key={category._id} className="mb-4">
                          <h3 className="font-medium mb-2">
                            <Link
                              href={`/products/${category.slug}`}
                              className="text-[#5900ba] hover:text-black transition-colors"
                            >
                              {category.name}
                            </Link>
                          </h3>

                          <ul className="pl-4 space-y-2">
                            {category.subcategories.map((subcategory: Subcategory) => (
                              <li key={subcategory._id}>
                                <Link
                                  href={`/products/${category.slug}/${subcategory.slug}`}
                                  className="block px-2 py-1 rounded text-gray-700 hover:bg-[#9b38f2] hover:text-white transition-colors"
                                >
                                  {subcategory.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>

                <li>
                  <Link href="/offers" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
                    OFFERS
                  </Link>
                </li>
                <li>
                  <Link href="/bundle-kits" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
                    BUNDLE KITS
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
                    ABOUT
                  </Link>
                </li>
                {mobileAuthButton}
              </ul>
            </nav>
          </div>
        )}

        {/* Desktop navigation */}
        <nav className="hidden md:block border-t border-b border-beige-dark relative z-40 bg-[#5900ba]">
          <div className="relative flex items-center justify-center px-6 lg:px-10 py-1">
            <ul className="flex justify-center items-center gap-4 lg:gap-6 text-sm">
              <li>
                <Link href="/" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/shop" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
                  SHOP
                </Link>
              </li>

              <li
                className="relative dropdown"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                <Link
                  href="/products"
                  className="flex items-center px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors"
                >
                  PRODUCTS <ChevronDown className="h-4 w-4 ml-1" />
                </Link>

                {isProductsOpen && (
                  <div className="dropdown-menu absolute left-1/2 top-full -translate-x-1/2 bg-white shadow-lg p-6 min-w-[600px] z-50 grid grid-cols-3 gap-6 rounded-md border border-gray-200">
                    {categories.map((category: Category) => (
                      <div key={category._id}>
                        <h3 className="font-medium mb-4">
                          <Link
                            href={`/products/${category.slug}`}
                            className="text-[#5900ba] hover:text-black transition-colors"
                          >
                            {category.name}
                          </Link>
                        </h3>

                        <ul className="space-y-3">
                          {category.subcategories.map((subcategory: Subcategory) => (
                            <li key={subcategory._id}>
                              <Link
                                href={`/products/${category.slug}/${subcategory.slug}`}
                                className="block px-2 py-1 rounded text-gray-700 hover:bg-[#9b38f2] hover:text-white transition-colors"
                              >
                                {subcategory.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>

              <li>
                <Link href="/offers" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
                  OFFERS
                </Link>
              </li>
              <li>
                <Link href="/bundle-kits" className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors">
                  BUNDLE KITS
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="px-3 py-2 text-white bg-[#5900ba] hover:bg-[#9b38f2] hover:text-black transition-colors"
                >
                  ABOUT
                </Link>
              </li>
            </ul>

            <div className="absolute right-4 lg:right-8">
              <Link
                href="/cart"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium relative rounded-full px-3 md:px-4 h-8 border border-white bg-[#5900ba] text-white hover:bg-[#9b38f2] hover:text-black transition-colors"
              >
                {itemCount > 0 && (
                  <span className="absolute -top-3 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}

                <span className="hidden sm:inline">CART</span>
                <span className="text-xs md:text-sm">
                  / RS.{items.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
                </span>
                <ShoppingBag className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header