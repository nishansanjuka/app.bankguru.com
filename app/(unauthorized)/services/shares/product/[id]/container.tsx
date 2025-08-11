"use client";

import { Product } from "@/types/product";
import { FC } from "react";
import { ProductRenderer } from "@/components/products/product-renderer";
import { useProductComparison } from "@/hooks/use-product-comparison";
import { ProductComparisonDialog } from "@/components/products/product-comparison-dialog";
import { ProductComparisonView } from "@/components/products/product-comparison-view";

interface ProductDetailContainerProps {
  product: Product;
  catId?: string; // Keep it optional in case it's still passed from the page
}

export const ProductDetailContainer: FC<ProductDetailContainerProps> = ({ 
  product
}) => {
  const {
    isComparisonDialogOpen,
    closeComparisonDialog,
    isComparisonViewOpen,
    closeComparisonView,
    currentProduct,
    availableProducts,
    selectedProducts,
    isLoading,
    removeProductFromComparison,
    handleCompareSelected,
  } = useProductComparison();

  console.log("ProductDetailContainer render - comparison state:", {
    isComparisonDialogOpen,
    isComparisonViewOpen,
    currentProductId: currentProduct?.id,
    availableProductsCount: availableProducts.length,
    selectedProductsCount: selectedProducts.length,
    isLoading
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="w-full">
          {/* Product Details */}
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

      {/* Comparison Dialog */}
      {currentProduct && (
        <ProductComparisonDialog
          open={isComparisonDialogOpen}
          onOpenChange={closeComparisonDialog}
          currentProduct={currentProduct}
          availableProducts={availableProducts}
          onCompareSelected={handleCompareSelected}
          isLoading={isLoading}
        />
      )}

      {/* Comparison View */}
      <ProductComparisonView
        open={isComparisonViewOpen}
        onOpenChange={closeComparisonView}
        products={selectedProducts}
        onRemoveProduct={removeProductFromComparison}
        onProductAction={(action, id) => {
          console.log(`Comparison view action: ${action} for product:`, id);
        }}
      />
    </>
  );
};
