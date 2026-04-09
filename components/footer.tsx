// "use client"
// import { Phone } from "lucide-react"  
// import { useState } from "react"
// import { usePathname } from "next/navigation"
// import Link from "next/link"
// import { Facebook, Instagram, Twitter } from "lucide-react"

// const policies = {
//   shipping: {
//     title: "Shipping & Delivery",
//     content:
//       "We aim to process and dispatch all orders within 4-5 business days. Delivery times vary based on your location.",
//   },
//   returns: {
//     title: "Returns & Exchanges",
//     content:
//       "You can return your item within 14 days of delivery. Items must be unused and in original packaging.",
//   },
//   terms: {
//     title: "Terms & Conditions",
//     content:
//       "By using our website, you agree to our terms. Prices include taxes and we may update terms at any time.",
//   },
//   privacy: {
//     title: "Privacy Policy",
//     content:
//       "We collect data to process orders and improve service. We never share data without consent.",
//   },
// }

// export default function Footer() {
//   const pathname = usePathname()
//   const [activePolicy, setActivePolicy] = useState<string | null>(null)

//   if (pathname?.startsWith("/admin")) return null

//   const togglePolicy = (key: string) => {
//     setActivePolicy(activePolicy === key ? null : key)
//   }

//   return (
//     <footer className="bg-beige-dark text-gray-800 pt-16 pb-8">
//       <div className="container mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* About Us */}
//           <div>
//             <h3 className="font-playfair text-xl mb-4">About Us</h3>
//             <p className="text-sm mb-4">
//               DONDRA LANKA provides premium dried fish and seafood, focused on freshness, hygiene, and authentic Sri Lankan taste, delivered worldwide with trust and care.
//             </p>
//             <div className="flex space-x-4">
//               <Link href="https://web.facebook.com/dondralanka?_rdc=1&_rdr#" className="hover:text-gray-600">
//                 <Facebook size={20} />
//               </Link>
//               <Link href="https://instagram.com" className="hover:text-gray-600">
//                 <Instagram size={20} />
//               </Link>
//               <Link href="https://twitter.com" className="hover:text-gray-600">
//                 <Twitter size={20} />
//               </Link>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="font-playfair text-xl mb-4">Quick Links</h3>
//             <ul className="space-y-2 text-sm">
//               <li><Link href="/shop" className="hover:underline">Shop</Link></li>
//               <li><Link href="/about" className="hover:underline">About Us</Link></li>
//                   <li>
//       <a
//         href="https://wa.me/+94782672914"
//         target="_blank"
//         rel="noopener noreferrer"
//         className="flex items-center space-x-2  hover:underline"
//       >
//         <Phone className="w-5 h-5" />
//         <span>Contact via WhatsApp</span>
//       </a>
//     </li>
//             </ul>
//           </div>

//           {/* Customer Service with Toggles */}
//           <div>
//             <h3 className="font-playfair text-xl mb-4">Customer Service</h3>
//             <ul className="space-y-2 text-sm">
//               {Object.entries(policies).map(([key, { title, content }]) => (
//                 <li key={key}>
//                   <button
//                     onClick={() => togglePolicy(key)}
//                     className="hover:underline text-left w-full"
//                   >
//                     {title}
//                   </button>
//                   {activePolicy === key && (
//                     <p className="mt-2 text-xs text-gray-600">{content}</p>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Us */}
//           <div>
//             <h3 className="font-playfair text-xl mb-4">Contact Us</h3>
//             <ul className="space-y-2 text-sm">
//               <li>Devinuwara,matara,sri lanka</li> 
//               <li>+94 78 267 2914</li>
//               <li>+94 70 560 0784</li>
//               <li>dondralankafoods@gmail.com</li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-gray-300 mt-12 pt-8 text-center text-sm">
//           <p>&copy; {new Date().getFullYear()} DONDRA LANKA Products. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   )
// }
"use client"
import { Phone, Facebook, Instagram, Twitter } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

const policies = {
  shipping: {
    title: "Shipping & Delivery",
    content:
      "We aim to process and dispatch all orders within 4-5 business days. Delivery times vary based on your location.",
  },
  returns: {
    title: "Returns & Exchanges",
    content:
      "You can return your item within 14 days of delivery. Items must be unused and in original packaging.",
  },
  terms: {
    title: "Terms & Conditions",
    content:
      "By using our website, you agree to our terms. Prices include taxes and we may update terms at any time.",
  },
  privacy: {
    title: "Privacy Policy",
    content:
      "We collect data to process orders and improve service. We never share data without consent.",
  },
}

export default function Footer() {
  const pathname = usePathname()
  const [activePolicy, setActivePolicy] = useState<string | null>(null)

  if (pathname?.startsWith("/admin")) return null

  const togglePolicy = (key: string) => {
    setActivePolicy(activePolicy === key ? null : key)
  }

  return (
    <footer className="bg-[#5900ba] text-white pt-10 pb-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          
          {/* About Us */}
          <div>
            <h3 className="font-playfair text-lg mb-2">About Us</h3>
            <p className="text-sm mb-2 text-white/80 leading-relaxed">
              DONDRA LANKA provides premium dried fish and seafood, focused on
              freshness, hygiene, and authentic Sri Lankan taste, delivered
              worldwide with trust and care.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="hover:text-white/80">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="hover:text-white/80">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="hover:text-white/80">
                <Twitter size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-lg mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm text-white/80">
              <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li>
                <a
                  href="https://wa.me/+94782672914"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-white"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-playfair text-lg mb-2">Customer Service</h3>
            <ul className="space-y-1 text-sm text-white/80">
              {Object.entries(policies).map(([key, { title, content }]) => (
                <li key={key}>
                  <button
                    onClick={() => togglePolicy(key)}
                    className="hover:text-white text-left w-full"
                  >
                    {title}
                  </button>
                  {activePolicy === key && (
                    <p className="mt-1 text-xs text-white/70">{content}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-playfair text-lg mb-2">Contact Us</h3>
            <ul className="space-y-1 text-sm text-white/80">
              <li>Devinuwara, Matara</li>
              <li>+94 78 267 2914</li>
              <li>+94 70 560 0784</li>
              <li className="break-all">dondralankafoods@gmail.com</li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-playfair text-lg mb-2">Payments</h3>
            <div className="bg-white p-2 rounded-md mb-2">
              <Image
                src="/payment.png"
                alt="Payment Methods"
                width={400}
                height={80}
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Secure payments via trusted gateways. All transactions are encrypted.
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-6 pt-4 text-center text-xs text-white/80">
          <p>
            &copy; {new Date().getFullYear()} DONDRA LANKA Products. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}