// import type { Metadata } from "next/types";
// import { buildMetadata, absoluteUrl } from "@/lib/seo";
// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import CategoryCard from "@/components/CategoryCard"
// import { getCategories } from "@/lib/api"
// import CollectionsCarousel from "@/components/collections-carousel"
// import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
// import { getFeaturedProducts } from "@/lib/db"
// import type { EmblaOptionsType } from 'embla-carousel'
// import FeaturedProducts from "@/components/featured-products"
// import NewsBanners from "@/components/news-banners"
// import Why from "@/components/why"

// export const metadata: Metadata = buildMetadata({
//   title: "Premium Dried Fish and Seafood from Sri Lanka",
//   description:
//     "Discover premium dried fish and seafood from Sri Lanka. Shop bestsellers, seafood bundle kits, and trusted quality products at DONDRA LANKA.",
//   path: "/",
//   image: "/og-image.jpg",
//   keywords: [
//     "premium dried fish",
//     "dried seafood Sri Lanka",
//     "seafood bundle kits",
//     "buy dried fish online",
//   ],
// });

// const organizationSchema = {
//   "@context": "https://schema.org",
//   "@type": "Organization",
//   name: "DONDRA LANKA",
//   url: "https://www.dondralanka.com",
//   logo: "https://www.dondralanka.com/logo.png",
// };

// const websiteSchema = {
//   "@context": "https://schema.org",
//   "@type": "WebSite",
//   name: "DONDRA LANKA",
//   url: "https://www.dondralanka.com",
// };

// <>
//   <script
//     type="application/ld+json"
//     dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
//   />
//   <script
//     type="application/ld+json"
//     dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
//   />
//   <div>
//     {/* existing page */}
//   </div>
// </>

// // Carousel configuration
// const carouselOptions: EmblaOptionsType = {
//   containScroll: "trimSnaps",
//   dragFree: true,
//   loop: true,
//   slidesToScroll: 1,
//   breakpoints: {
//     '(max-width: 1024px)': { slidesToScroll: 1 },
//     '(max-width: 768px)': { slidesToScroll: 1 },
//     '(max-width: 640px)': { slidesToScroll: 1 }
//   }
// }

// export default async function Home() {
//   const categories = await getCategories()
//   const featuredProducts = await getFeaturedProducts()

//   return (
//     <div>
//       <section className="relative w-full overflow-hidden">
//         <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[90vh] lg:h-[100vh]">
//           <NewsBanners fallback={
//             <video
//               autoPlay
//               muted
//               loop
//               playsInline
//               className="w-full h-full object-contain md:object-cover"
//             >
//               <source src="/hero-video.mp4" type="video/mp4" />
//               <img
//                 src="/placeholder.svg?height=600&width=1920"
//                 alt="Seasonal Gift Boxes"
//                 className="w-full h-full object-contain"
//               />
//             </video>
//           } />
//         </div>
//       </section>
      
//       {/* Our Collections Section */}
//       <CollectionsCarousel categories={categories} />

//       {/* Featured Products */}
//       <section className="py-16 bg-[#ABE0F0]"> 
//         <div className="container mx-auto">
//           <h2 className="font-playfair text-4xl text-center mb-12">Bestsellers</h2>
//           <FeaturedProducts 
//             products={featuredProducts} 
//             carouselOptions={carouselOptions} 
//           />
//         </div>
//       </section>

    
// <section className="py-16 container mx-auto">
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//     {/* Video Section */}
// <div>
//   <Image
//     src="/b1.webp"
//     alt="Hero"
//     width={1200}
//     height={600}
//     className="rounded-lg w-full h-auto"
//     priority
//   />
// </div>

//     {/* Text Content */}
//     <div className="max-w-lg">
//       <h2 className="font-playfair text-4xl mb-6">Bundle Kits</h2>
//       <p className="text-gray-700 mb-6">
//      Our specially curated seafood bundles bring together a selection of high-quality dried fish for better value and convenience. Perfect for everyday use or sharing, each bundle is packed to deliver freshness, taste, and trusted quality.</p>

//       <Link href="bundle-kits">
//         <Button size="lg">Explore Bundle Kits</Button>
//       </Link>
//     </div>
//   </div>
// </section>

// <Why />
//       {/* Testimonials */}
//       <section className="py-16 bg-beige">
//         <div className="container mx-auto">
//           <h2 className="font-playfair text-4xl text-center mb-12">What Our Customers Say</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 name: "Sarah J.",
//                 text: "The Vitamin C Serum has completely transformed my skin. I've been using it for a month and my complexion is brighter and more even-toned.",
//               },
//               {
//                 name: "Michael T.",
//                 text: "I purchased a gift box for my wife's birthday and she absolutely loved it. The packaging was beautiful and the products are high quality.",
//               },
//               {
//                 name: "Priya D.",
//                 text: "The Ceylon Tea Face Mask is now a staple in my skincare routine. It leaves my skin feeling refreshed and rejuvenated.",
//               },
//             ].map((testimonial, index) => (
//               <div key={index} className="bg-white p-8 rounded-lg shadow-md">
//                 <div className="flex items-center mb-4">
//                   <div className="w-12 h-12 rounded-full bg-beige-dark flex items-center justify-center mr-4">
//                     {testimonial.name.charAt(0)}
//                   </div>
//                   <h3 className="font-playfair text-xl">{testimonial.name}</h3>
//                 </div>
//                 <p className="text-gray-700">"{testimonial.text}"</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Newsletter */}
//       <section className="py-16 container mx-auto">
//         <div className="max-w-2xl mx-auto text-center">
//           <h2 className="font-playfair text-4xl mb-6">Join Our Newsletter</h2>
//           <p className="text-gray-700 mb-8">
//             Subscribe to receive updates on new products, special offers, and wellness tips.
//           </p>
//           <form className="flex flex-col sm:flex-row gap-4">
//             <input
//               type="email"
//               placeholder="Your email address"
//               className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//               required
//             />
//             <Button type="submit" className="whitespace-nowrap">
//               Subscribe
//             </Button>
//           </form>
//         </div>
//       </section>
//     </div>
//   )
// }


import type { Metadata } from "next/types";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/api";
import CollectionsCarousel from "@/components/collections-carousel";
import { getFeaturedProducts } from "@/lib/db";
import type { EmblaOptionsType } from "embla-carousel";
import FeaturedProducts from "@/components/featured-products";
import NewsBanners from "@/components/news-banners";
import Why from "@/components/why";

export const metadata: Metadata = buildMetadata({
  title: "Premium Dried Fish and Seafood from Sri Lanka",
  description:
    "Discover premium dried fish and seafood from Sri Lanka. Shop bestsellers, seafood bundle kits, and trusted quality products at DONDRA LANKA.",
  path: "/",
  image: "/og-image.jpg",
  keywords: [
    "premium dried fish",
    "dried seafood Sri Lanka",
    "seafood bundle kits",
    "buy dried fish online",
  ],
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DONDRA LANKA",
  url: "https://www.dondralanka.com",
  logo: "https://www.dondralanka.com/logo.png",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DONDRA LANKA",
  url: "https://www.dondralanka.com",
};

const carouselOptions: EmblaOptionsType = {
  containScroll: "trimSnaps",
  dragFree: true,
  loop: true,
  slidesToScroll: 1,
  breakpoints: {
    "(max-width: 1024px)": { slidesToScroll: 1 },
    "(max-width: 768px)": { slidesToScroll: 1 },
    "(max-width: 640px)": { slidesToScroll: 1 },
  },
};

export default async function Home() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <div>
        <section className="relative w-full overflow-hidden">
          <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[90vh] lg:h-[100vh]">
            <NewsBanners
              fallback={
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-contain md:object-cover"
                >
                  <source src="/hero-video.mp4" type="video/mp4" />
                  <img
                    src="/placeholder.svg?height=600&width=1920"
                    alt="Seasonal Gift Boxes"
                    className="w-full h-full object-contain"
                  />
                </video>
              }
            />
          </div>
        </section>

        <CollectionsCarousel categories={categories} />

        <section className="py-16 bg-[#ABE0F0]">
          <div className="container mx-auto">
            <h2 className="font-playfair text-4xl text-center mb-12">
              Bestsellers
            </h2>
            <FeaturedProducts
              products={featuredProducts}
              carouselOptions={carouselOptions}
            />
          </div>
        </section>

        <section className="py-16 container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="/b1.webp"
                alt="Premium seafood bundle kits from DONDRA LANKA"    
                width={1200}
                height={600}
                className="rounded-lg w-full h-auto"
                priority
              />
            </div>

            <div className="max-w-lg">
              <h2 className="font-playfair text-4xl mb-6">Bundle Kits</h2>
              <p className="text-gray-700 mb-6">
                Our specially curated seafood bundles bring together a selection
                of high-quality dried fish for better value and convenience.
                Perfect for everyday use or sharing, each bundle is packed to
                deliver freshness, taste, and trusted quality.
              </p>

              <Link href="/bundle-kits">
                <Button size="lg">Explore Bundle Kits</Button>
              </Link>
            </div>
          </div>
        </section>

        <Why />

        <section className="py-16 bg-beige">
          <div className="container mx-auto">
            <h2 className="font-playfair text-4xl text-center mb-12">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                  {
                    name: "Nadeesha P.",
                    text: "The dried fish quality was excellent and the packaging was very clean. Everything arrived fresh and well packed.",
                  },
                  {
                    name: "Kamal R.",
                    text: "I ordered a seafood bundle kit for home use and it was great value. The products tasted authentic and high quality.",
                  },
                  {
                    name: "Tharushi M.",
                    text: "DONDRA LANKA has become my go-to place for dried seafood. The quality is consistent and delivery was smooth.",
                  },
                ].map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-beige-dark flex items-center justify-center mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <h3 className="font-playfair text-xl">
                      {testimonial.name}
                    </h3>
                  </div>
                  <p className="text-gray-700">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-playfair text-4xl mb-6">
              Join Our Newsletter
            </h2>
              <p className="text-gray-700 mb-8">
                Subscribe to receive updates on new seafood products, bundle kits, and special offers.
              </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <Button type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}