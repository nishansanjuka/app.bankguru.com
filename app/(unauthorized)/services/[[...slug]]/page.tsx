import { NavBar } from "@/components/shared/nav-bar";
import { getProducts } from "@/lib/actions/products";
import { getQueryClient } from "@/lib/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import { Container } from "./container";
import { auth } from "@clerk/nextjs/server";

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ catId?: string }>;
}) {
  const params = await searchParams;
  const catId = params.catId;

  const { getToken } = await auth();

  console.log(await getToken());

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["loans", catId],
    queryFn: async () => {
      const res = await getProducts({
        categoryId: catId,
      });
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch loans");
      }
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavBar />
      <div className="mt-28">{catId && <Container catId={catId} />}</div>
    </HydrationBoundary>
  );
}
