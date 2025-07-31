import { getQueryClient } from "@/lib/utils";
import Container from "./container";
import { getProductCategoryHierarchy } from "@/lib/actions/products/hierarchy";
import ProductCreateContainer from "./products/create/product-create-container";

export default function DashboardPage() {
  const queryClient = getQueryClient();

  // Pre-fetch the product category hierarchy
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
  });
  return <ProductCreateContainer />;
}
