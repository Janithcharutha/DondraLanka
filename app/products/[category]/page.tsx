// import { Suspense } from "react"
// import { notFound } from "next/navigation"
// import LoadingSpinner from "@/components/loading-spinner"
// import ProductGrid from "@/components/product-grid"
// import type { Product, Category } from "@/lib/types"
// import CategoryHeader from "@/components/category-header"

// interface CategoryDataProps {
//   params: Promise<{
//     category: string
//   }>
// }

// async function getCategoryData(slug: string): Promise<Category | null> {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?slug=${slug}`)
//     if (!res.ok) return null
//     const data = await res.json()
//     return data[0] || null
//   } catch (error) {
//     console.error('Error fetching category:', error)
//     return null
//   }
// }

// async function getCategoryProducts(categoryId: string): Promise<Product[]> {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/products/category?category=${categoryId}`,
//       {
//         next: { revalidate: 3600 }
//       }
//     )

//     if (!res.ok) return []
//     return res.json()
//   } catch (error) {
//     console.error('Error fetching products:', error)
//     return []
//   }
// }

// export default async function CategoryPage({ params }: CategoryDataProps) {
//   const resolvedParams = await params
  
//   const categoryData = await getCategoryData(resolvedParams.category)
//   if (!categoryData) notFound()

//   const products = await getCategoryProducts(categoryData._id.toString())

//   return (
//     <Suspense fallback={<LoadingSpinner />}>
//       <div className="container mx-auto py-8">
//         <CategoryHeader
//           title={categoryData.name}
//           description={categoryData.description}
//           category={categoryData}
//           subcategories={categoryData.subcategories}
//           currentSubcategory={null}
//         />
//         <ProductGrid products={products} />
//       </div>
//     </Suspense>
//   )
// }




import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import LoadingSpinner from "@/components/loading-spinner";
import ProductGrid from "@/components/product-grid";
import type { Product, Category } from "@/lib/types";
import CategoryHeader from "@/components/category-header";
import { buildMetadata } from "@/lib/seo";

interface CategoryDataProps {
  params: Promise<{
    category: string;
  }>;
}

/* ================= SEO METADATA ================= */

export async function generateMetadata({
  params,
}: CategoryDataProps): Promise<Metadata> {
  const resolvedParams = await params;

  const categoryData = await getCategoryData(resolvedParams.category);

  if (!categoryData) {
    return buildMetadata({
      title: "Category Not Found",
      description: "The requested category could not be found.",
      path: `/products/${resolvedParams.category}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: categoryData.name,
    description:
      categoryData.description ||
      `Shop ${categoryData.name} at DONDRA LANKA. Premium dried fish and seafood from Sri Lanka.`,
    path: `/products/${resolvedParams.category}`,
    image: categoryData.image || "/og-image.jpg",
    keywords: [
      categoryData.name,
      `${categoryData.name} Sri Lanka`,
      "premium dried seafood",
    ],
  });
}

/* ================= EXISTING FUNCTIONS (UNCHANGED) ================= */

async function getCategoryData(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories?slug=${slug}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

async function getCategoryProducts(categoryId: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/category?category=${categoryId}`,
      {
        // next: { revalidate: 3600 },
        cache: "no-store",
      }
    );

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/* ================= PAGE ================= */

export default async function CategoryPage({
  params,
}: CategoryDataProps) {
  const resolvedParams = await params;

  const categoryData = await getCategoryData(resolvedParams.category);
  if (!categoryData) notFound();

  const products = await getCategoryProducts(
    categoryData._id.toString()
  );

  /* ================= STRUCTURED DATA ================= */

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
        name: categoryData.name,
        item: `https://www.dondralanka.com/products/${resolvedParams.category}`,
      },
    ],
  };

  return (
    <>
      {/* SEO STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <Suspense fallback={<LoadingSpinner />}>
        <div className="container mx-auto py-8">
          <CategoryHeader
            title={categoryData.name}
            description={categoryData.description}
            category={categoryData}
            subcategories={categoryData.subcategories}
            currentSubcategory={null}
          />
          <ProductGrid products={products} />
        </div>
      </Suspense>
    </>
  );
}