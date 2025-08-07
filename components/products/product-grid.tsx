"use client";

import { ProductCard } from "./product-card";
import { CreditCardProduct } from "./credit-card-product";
import { LoanProduct } from "./loan-product";
import { AccountProduct } from "./account-product";
import { InvestmentProduct } from "./investment-product";
import { InsuranceProduct } from "./insurance-product";
import { DigitalServiceProduct } from "./digital-service-product";
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
          onApply={(id) => onProductAction?.("apply", id)}
          onCompare={(id) => onProductAction?.("compare", id)}
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
          onApply={(id) => onProductAction?.("apply", id)}
          onCalculate={(id) => onProductAction?.("calculate", id)}
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
          onOpenAccount={(id) => onProductAction?.("open", id)}
          onLearnMore={(id) => onProductAction?.("learn_more", id)}
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
          onInvest={(id) => onProductAction?.("invest", id)}
          onViewPortfolio={(id) => onProductAction?.("view_portfolio", id)}
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
          onGetQuote={(id) => onProductAction?.("quote", id)}
          onCompare={(id) => onProductAction?.("compare", id)}
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
          onGetStarted={(id) => onProductAction?.("get_started", id)}
          onDownload={(id) => onProductAction?.("download", id)}
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
        onViewDetails={(id) => onProductAction?.("view_details", id)}
        onCompare={(id) => onProductAction?.("compare", id)}
        className="max-w-full"
      />
    );
  };

  return (
    <div
      className={cn(
        "grid gap-4",
        variant === "compact" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1",
        className
      )}
    >
      {products.map(renderProduct)}
    </div>
  );
}
