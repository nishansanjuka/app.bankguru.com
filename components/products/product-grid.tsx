"use client";

import { ProductCard } from "./product-card";
import { CreditCardProduct } from "./credit-card-product";
import { LoanProduct } from "./loan-product";
import { AccountProduct } from "./account-product";
import { InvestmentProduct } from "./investment-product";
import { InsuranceProduct } from "./insurance-product";
import { DigitalServiceProduct } from "./digital-service-product";
import { ProductComparisonDialog } from "./product-comparison-dialog";
import { ProductComparisonView } from "./product-comparison-view";
import { useProductComparison } from "@/hooks/use-product-comparison";
import { cn } from "@/lib/utils/index";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  variant?: "default" | "compact" | "detailed";
  className?: string;
  onProductAction?: (action: string, productId: string) => void;
}

export function ProductGrid({
  products,
  variant = "default",
  className,
  onProductAction,
}: ProductGridProps) {
  const {
    isComparisonDialogOpen,
    openComparisonDialog,
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

  const handleProductActionInternal = (action: string, productId: string) => {
    if (action === "compare") {
      const product = products.find(p => p.id === productId);
      if (product) {
        openComparisonDialog(product);
      }
    } else {
      onProductAction?.(action, productId);
    }
  };

  const renderProduct = (product: Product) => {
    const productType = product.productType?.code.toLowerCase();

    // Credit and Debit Cards
    if (
      productType?.includes("credit_card") ||
      productType?.includes("debit_card") ||
      productType?.includes("card")
    ) {
      return (
        <CreditCardProduct
          key={product.id}
          product={product}
          variant={variant as "compact" | "default" | "premium"}
          onApply={(id) => handleProductActionInternal("apply", id)}
          onCompare={(id) => handleProductActionInternal("compare", id)}
          className="max-w-full"
        />
      );
    }

    // Loans and Leasing (including your CAR_LEASING)
    if (
      productType?.includes("loan") ||
      productType?.includes("mortgage") ||
      productType?.includes("leasing") ||
      productType?.includes("financing") ||
      productType?.includes("car_leasing")
    ) {
      return (
        <LoanProduct
          key={product.id}
          product={product}
          variant={variant}
          onApply={(id) => handleProductActionInternal("apply", id)}
          onCalculate={(id) => handleProductActionInternal("calculate", id)}
          onCompare={(id) => handleProductActionInternal("compare", id)}
          className="max-w-full"
        />
      );
    }

    // Banking Accounts
    if (
      productType?.includes("account") ||
      productType?.includes("savings") ||
      productType?.includes("checking") ||
      productType?.includes("deposit")
    ) {
      return (
        <AccountProduct
          key={product.id}
          product={product}
          variant={variant as "default" | "compact" | "premium"}
          onOpenAccount={(id) => handleProductActionInternal("open", id)}
          onLearnMore={(id) => handleProductActionInternal("learn_more", id)}
          onCompare={(id) => handleProductActionInternal("compare", id)}
          className="max-w-full"
        />
      );
    }

    // Investment Products
    if (
      productType?.includes("investment") ||
      productType?.includes("mutual") ||
      productType?.includes("etf") ||
      productType?.includes("portfolio") ||
      productType?.includes("retirement") ||
      productType?.includes("ira")
    ) {
      return (
        <InvestmentProduct
          key={product.id}
          product={product}
          variant={variant as "default" | "compact" | "premium"}
          onInvest={(id) => handleProductActionInternal("invest", id)}
          onViewPortfolio={(id) => handleProductActionInternal("view_portfolio", id)}
          onCompare={(id) => handleProductActionInternal("compare", id)}
          className="max-w-full"
        />
      );
    }

    // Insurance Products
    if (
      productType?.includes("insurance") ||
      productType?.includes("life") ||
      productType?.includes("health") ||
      productType?.includes("auto_insurance") ||
      productType?.includes("home_insurance") ||
      productType?.includes("travel")
    ) {
      return (
        <InsuranceProduct
          key={product.id}
          product={product}
          variant={variant as "default" | "compact" | "family"}
          onGetQuote={(id) => handleProductActionInternal("quote", id)}
          onCompare={(id) => handleProductActionInternal("compare", id)}
          className="max-w-full"
        />
      );
    }

    // Digital Services
    if (
      productType?.includes("digital") ||
      productType?.includes("mobile") ||
      productType?.includes("wallet") ||
      productType?.includes("payment") ||
      productType?.includes("fintech") ||
      productType?.includes("app")
    ) {
      return (
        <DigitalServiceProduct
          key={product.id}
          product={product}
          variant={variant as "default" | "compact" | "modern"}
          onGetStarted={(id) => handleProductActionInternal("get_started", id)}
          onDownload={(id) => handleProductActionInternal("download", id)}
          onCompare={(id) => handleProductActionInternal("compare", id)}
          className="max-w-full"
        />
      );
    }

    // Default fallback to generic ProductCard
    return (
      <ProductCard
        key={product.id}
        product={product}
        variant={variant}
        onViewDetails={(id) => handleProductActionInternal("view_details", id)}
        onCompare={(id) => handleProductActionInternal("compare", id)}
        className="max-w-full"
      />
    );
  };

  return (
    <>
      <div
        className={cn(
          "grid gap-4",
          variant === "compact" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1",
          className
        )}
      >
        {products.map(renderProduct)}
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
        onProductAction={onProductAction}
      />
    </>
  );
}
