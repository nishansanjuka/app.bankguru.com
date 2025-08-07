import { getProducts } from "@/lib/actions/products";
import { getQueryClient } from "@/lib/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import { Container } from "./container";
import { NavBar } from "@/components/shared/nav-bar";

export default async function LoansPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["loans"],
    queryFn: async () => {
      const res = await getProducts({});
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch loans");
      }
      return res.data;
    },
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavBar />
      <div className="mt-20">
        <Container />
      </div>
    </HydrationBoundary>
  );
}
