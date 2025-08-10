import { NavBar } from "@/components/shared/nav-bar";
import { getProductById } from "@/lib/actions/products";
import { getQueryClient } from "@/lib/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import { notFound } from "next/navigation";
import { ProductDetailContainer } from "./container";

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ catId?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const productId = resolvedParams.id;
  const catId = resolvedSearchParams.catId;

  // Fetch the product on the server
  const productResponse = await getProductById(productId);
  
  if (!productResponse.success || !productResponse.data) {
    notFound();
  }

  const queryClient = getQueryClient();
  
  // Prefetch the product data
  await queryClient.prefetchQuery({
    queryKey: ["product", productId],
    queryFn: async () => productResponse.data,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavBar />
      <div className="mt-20">
        <ProductDetailContainer 
          product={productResponse.data} 
          catId={catId} 
        />
      </div>
    </HydrationBoundary>
  );
}
