"use client";

import { Product } from "@/types/product";
import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductRenderer } from "@/components/products/product-renderer";

interface ProductDetailContainerProps {
  product: Product;
  catId?: string;
}

export const ProductDetailContainer: FC<ProductDetailContainerProps> = ({ 
  product, 
  catId 
}) => {
  const router = useRouter();

  useEffect(() => {
    // If we have a catId, it means this was accessed with category context
    // Redirect to the category page with the product modal
    if (catId) {
      router.replace(`/services/shares?catId=${catId}&id=${product.id}`);
      return;
    }
  }, [catId, product.id, router]);

  // If we have catId, don't render anything as we're redirecting
  if (catId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details */}
        <div className="max-w-md mx-auto">
          <ProductRenderer
            product={product}
            variant="detailed"
            className="max-w-none"
            onProductAction={(action, id) => {
              console.log(`${action} action for product:`, id);
            }}
          />
        </div>
      </div>
    </div>
  );
};
