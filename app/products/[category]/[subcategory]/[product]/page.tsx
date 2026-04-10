// import { Suspense } from "react"
// import { ProductClient } from "@/components/product-client"
// import { notFound } from "next/navigation"

// interface ProductProps {
//   params: Promise<{
//     category: string
//     subcategory: string 
//     product: string
//   }>
// }

// async function getProduct(slug: string) {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/products/by-slug/${slug}`,
//       {
//         next: { revalidate: 60 }, // Cache for 1 minute
//         headers: {
//           'Cache-Control': 'public, s-maxage=60'
//         }
//       }
//     )
    
//     if (!response.ok) return null
//     return response.json()
//   } catch (error) {
//     console.error('Error fetching product:', error)
//     return null
//   }
// }

// export default async function Page({ params }: ProductProps) {
//   // Await the params since they're now a Promise
//   const resolvedParams = await params
//   const product = await getProduct(resolvedParams.product)

//   if (!product) {
//     notFound()
//   }

//   if (product.category !== resolvedParams.category || 
//       product.subcategory !== resolvedParams.subcategory) {
//     notFound()
//   }

//   return (
//     <Suspense 
//       fallback={
//         <div className="container mx-auto py-8">
//           <div className="animate-pulse">
//             <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
//             <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//           </div>
//         </div>
//       }
//     >
//       <ProductClient product={product} params={resolvedParams} />
//     </Suspense>
//   )
// }

import { Suspense } from "react";
import type { Metadata } from "next/types";
import { ProductClient } from "@/components/product-client";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";

interface ProductProps {
  params: Promise<{
    category: string;
    subcategory: string;
    product: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductProps): Promise<Metadata> {
  const resolvedParams = await params;
  const productData = await getProduct(resolvedParams.product);

  if (!productData) {
    return buildMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      path: `/products/${resolvedParams.category}/${resolvedParams.subcategory}/${resolvedParams.product}`,
      noIndex: true,
    });
  }

  if (
    productData.category !== resolvedParams.category ||
    productData.subcategory !== resolvedParams.subcategory
  ) {
    return buildMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      path: `/products/${resolvedParams.category}/${resolvedParams.subcategory}/${resolvedParams.product}`,
      noIndex: true,
    });
  }

  const image =
    productData.images && productData.images.length > 0
      ? productData.images[0]
      : "/og-image.jpg";

  return buildMetadata({
    title: productData.name,
    description:
      productData.description ||
      `Buy ${productData.name} at DONDRA LANKA. Premium dried seafood from Sri Lanka with trusted quality and freshness.`,
    path: `/products/${resolvedParams.category}/${resolvedParams.subcategory}/${resolvedParams.product}`,
    image,
    keywords: [
      productData.name,
      `${productData.name} Sri Lanka`,
      "buy dried fish online",
      "premium dried seafood",
    ],
  });
}

async function getProduct(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/by-slug/${slug}`,
      {
        next: { revalidate: 60 },
        headers: {
          "Cache-Control": "public, s-maxage=60",
        },
      }
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function Page({ params }: ProductProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.product);

  if (!product) {
    notFound();
  }

  if (
    product.category !== resolvedParams.category ||
    product.subcategory !== resolvedParams.subcategory
  ) {
    notFound();
  }

  const image =
    product.images && product.images.length > 0
      ? product.images
      : ["https://www.dondralanka.com/og-image.jpg"];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image,
    description: product.description,
    sku: product.code || product._id,
    brand: {
      "@type": "Brand",
      name: "DONDRA LANKA",
    },
    offers: {
      "@type": "Offer",
      url: `https://www.dondralanka.com/products/${resolvedParams.category}/${resolvedParams.subcategory}/${resolvedParams.product}`,
      priceCurrency: "LKR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

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
        name: resolvedParams.category,
        item: `https://www.dondralanka.com/products/${resolvedParams.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: resolvedParams.subcategory,
        item: `https://www.dondralanka.com/products/${resolvedParams.category}/${resolvedParams.subcategory}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://www.dondralanka.com/products/${resolvedParams.category}/${resolvedParams.subcategory}/${resolvedParams.product}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
    </>
  );
}