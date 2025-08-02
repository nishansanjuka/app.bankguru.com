import { getQueryClient } from "@/lib/utils";
import { getProductCategoryHierarchy } from "@/lib/actions/products/hierarchy";
import { getProducts } from "@/lib/actions/products";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProductCreateContainer from "./product-create-container";

export default async function CreateProductPage() {
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
