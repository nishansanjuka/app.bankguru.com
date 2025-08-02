import { getQueryClient } from "@/lib/utils";
import { getProductCategoryHierarchy } from "@/lib/actions/products/hierarchy";
import ProductCreateContainer from "./products/create/product-create-container";
import { getProducts } from "@/lib/actions/products";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  // Pre-fetch the product category hierarchy
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["productCategoryHierarchy"],
      queryFn: async () => {
        const res = await getProductCategoryHierarchy();
        if (!res.success) {
          throw new Error(res.error);
        } else {
          return res.data;
        }
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["products"],
      queryFn: () => getProducts(),
    }),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductCreateContainer />
    </HydrationBoundary>
  );
}
