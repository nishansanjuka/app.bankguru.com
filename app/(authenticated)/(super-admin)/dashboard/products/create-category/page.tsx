import React from "react";
import { Container } from "./container";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/utils";
import { getCategories } from "@/lib/actions/products/categories";
import CategoriesContainer from "@/components/categories/container";

export default function DefineCreateCategoryPage() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch categories");
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
          <CategoriesContainer />
        </div>
      </main>
    </HydrationBoundary>
  );
}
