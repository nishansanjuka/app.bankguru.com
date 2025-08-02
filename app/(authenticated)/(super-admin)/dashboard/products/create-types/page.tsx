import React from "react";
import { Container } from "./container";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/utils";
import { getProductTypes } from "@/lib/actions/products/types";
import ProductTypesContainer from "@/components/product-types/container";

export default function DefineCreateProductTypePage() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["product-types"],
    queryFn: async () => {
      const res = await getProductTypes();
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch product types");
      }
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex-1 items-start gap-4 p-2 sm:px-6 sm:py-0 w-full ">
        <div className="mt-5 mb-2">
          <Container />
        </div>

        <div className="w-full mt-10 container mx-auto">
          <ProductTypesContainer />
        </div>
      </main>
    </HydrationBoundary>
  );
}
