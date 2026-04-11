// import { Suspense } from "react"
// import { notFound } from "next/navigation"
// import CategoryHeader from "@/components/category-header"
// import ProductGrid from "@/components/product-grid"
// import LoadingSpinner from "@/components/loading-spinner"
// import type { Category, Product } from "@/lib/types"

// interface CategoryDataProps {
//   params: Promise<{
//     category: string
//     subcategory: string
//   }>
// }

// async function getCategoryData(slug: string): Promise<Category | null> {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?slug=${slug}`, {
//       next: { revalidate: 3600 }
//     })
//     if (!res.ok) return null
//     const data = await res.json()
//     return data[0] || null
//   } catch (error) {
//     console.error('Error fetching category:', error)
//     return null
//   }
// }

// async function getSubcategoryProducts(categoryId: string, subcategoryId: string): Promise<Product[]> {
//   try {
//     const queryParams = new URLSearchParams({
//       categoryId,
//       subcategoryId
//     }).toString()
    
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/products/subcategory?${queryParams}`,
//       { cache: 'no-store' }
//     )

//     if (!res.ok) {
//       console.error('Failed to fetch products:', await res.text())
//       return []
//     }
//     return res.json()
//   } catch (error) {
//     console.error('Error fetching products:', error)
//     return []
//   }
// }

// export default async function SubcategoryPage({ params }: CategoryDataProps) {
//   const resolvedParams = await params
  
//   const categoryData = await getCategoryData(resolvedParams.category)
//   if (!categoryData) notFound()

//   const currentSubcategory = categoryData.subcategories.find(
//     sub => sub.slug === resolvedParams.subcategory
//   )
//   if (!currentSubcategory) notFound()

//   const products = await getSubcategoryProducts(
//     categoryData._id.toString(),
//     currentSubcategory._id.toString()
//   )

//   return (
//     <Suspense fallback={<LoadingSpinner />}>
//       <div className="container mx-auto py-8">
//         <CategoryHeader 
//           category={categoryData}
//           subcategories={categoryData.subcategories}
//           currentSubcategory={resolvedParams.subcategory}
//         />
//         <ProductGrid products={products} />
//       </div>
//     </Suspense>
//   )
// }




import { Suspense } from "react";
import type { Metadata } from "next/types";
import { notFound } from "next/navigation";
import CategoryHeader from "@/components/category-header";
import ProductGrid from "@/components/product-grid";
import LoadingSpinner from "@/components/loading-spinner";
import type { Category, Product } from "@/lib/types";
import { buildMetadata } from "@/lib/seo";

interface CategoryDataProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryDataProps): Promise<Metadata> {
  const resolvedParams = await params;

  const categoryData = await getCategoryData(resolvedParams.category);

  if (!categoryData) {
    return buildMetadata({
      title: "Subcategory Not Found",
      description: "The requested subcategory could not be found.",
      path: `/products/${resolvedParams.category}/${resolvedParams.subcategory}`,
      noIndex: true,
    });
  }

  const currentSubcategory = categoryData.subcategories.find(
    (sub) => sub.slug === resolvedParams.subcategory
  );

  if (!currentSubcategory) {
    return buildMetadata({
      title: "Subcategory Not Found",
      description: "The requested subcategory could not be found.",
      path: `/products/${resolvedParams.category}/${resolvedParams.subcategory}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: currentSubcategory.name,
    description:
      currentSubcategory.description ||
      `Browse ${currentSubcategory.name} at DONDRA LANKA. Premium dried seafood from Sri Lanka.`,
    path: `/products/${resolvedParams.category}/${resolvedParams.subcategory}`,
   // image: currentSubcategory.image || "/og-image.jpg",
    keywords: [
      currentSubcategory.name,
      `${currentSubcategory.name} Sri Lanka`,
      "premium dried seafood",
    ],
  });
}

async function getCategoryData(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories?slug=${slug}`,
      {
        // next: { revalidate: 3600 },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

async function getSubcategoryProducts(
  categoryId: string,
  subcategoryId: string
): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams({
      categoryId,
      subcategoryId,
    }).toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/subcategory?${queryParams}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("Failed to fetch products:", await res.text());
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function SubcategoryPage({
  params,
}: CategoryDataProps) {
  const resolvedParams = await params;

  const categoryData = await getCategoryData(resolvedParams.category);
  if (!categoryData) notFound();

  const currentSubcategory = categoryData.subcategories.find(
    (sub) => sub.slug === resolvedParams.subcategory
  );
  if (!currentSubcategory) notFound();

  const products = await getSubcategoryProducts(
    categoryData._id.toString(),
    currentSubcategory._id.toString()
  );

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
      {
        "@type": "ListItem",
        position: 3,
        name: currentSubcategory.name,
        item: `https://www.dondralanka.com/products/${resolvedParams.category}/${resolvedParams.subcategory}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Suspense fallback={<LoadingSpinner />}>
        <div className="container mx-auto py-8">
          <CategoryHeader
            category={categoryData}
            subcategories={categoryData.subcategories}
            currentSubcategory={resolvedParams.subcategory}
          />
          <ProductGrid products={products} />
        </div>
      </Suspense>
    </>
  );
}