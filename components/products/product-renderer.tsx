"use client";

import { Product } from "@/types/product";
import { ProductPage } from "@/components/product-pages/loans";

interface ProductRendererProps {
  product: Product;
  variant?:
    | "default"
    | "compact"
    | "detailed"
    | "premium"
    | "family"
    | "modern";
  className?: string;
  onProductAction?: (action: string, productId: string) => void;
}

export function ProductRenderer({
  product,
  onProductAction,
}: ProductRendererProps) {
  const handleProductAction = (action: string, productId: string) => {
    onProductAction?.(action, productId);
  };

  // const productType = product.productType?.code.toLowerCase();

  // // Credit and Debit Cards
  // if (
  //   productType?.includes("credit_card") ||
  //   productType?.includes("debit_card") ||
  //   productType?.includes("card")
  // ) {
  //   return (
  //     <CreditCardProduct
  //       product={product}
  //       variant={variant as "compact" | "default" | "premium"}
  //       onApply={(id) => handleProductAction("apply", id)}
  //       onCompare={(id) => handleProductAction("compare", id)}
  //       className={className}
  //     />
  //   );
  // }

  // // Loans and Leasing (including CAR_LEASING)
  // if (
  //   productType?.includes("loan") ||
  //   productType?.includes("mortgage") ||
  //   productType?.includes("leasing") ||
  //   productType?.includes("financing") ||
  //   productType?.includes("car_leasing") ||
  //   productType?.includes("uththamachara") ||
  //   productType?.includes("upahara")
  // ) {
  //   return (
  //     <ProductPage
  //       product={product}
  //       onApply={(id) => handleProductAction("apply", id)}
  //       onCompare={(id) => handleProductAction("compare", id)}
  //       onAskGuru={(query, id) => handleProductAction("ask_guru", id)}
  //     />
  //   );
  // }

  // // Banking Accounts
  // if (
  //   productType?.includes("account") ||
  //   productType?.includes("savings") ||
  //   productType?.includes("checking") ||
  //   productType?.includes("deposit")
  // ) {
  //   return (
  //     <AccountProduct
  //       product={product}
  //       variant={variant as "default" | "compact" | "premium"}
  //       onOpenAccount={(id) => handleProductAction("open", id)}
  //       onLearnMore={(id) => handleProductAction("learn_more", id)}
  //       onCompare={(id) => handleProductAction("compare", id)}
  //       className={className}
  //     />
  //   );
  // }

  // // Investment Products
  // if (
  //   productType?.includes("investment") ||
  //   productType?.includes("mutual") ||
  //   productType?.includes("etf") ||
  //   productType?.includes("portfolio") ||
  //   productType?.includes("retirement") ||
  //   productType?.includes("ira")
  // ) {
  //   return (
  //     <InvestmentProduct
  //       product={product}
  //       variant={variant as "default" | "compact" | "premium"}
  //       onInvest={(id) => handleProductAction("invest", id)}
  //       onViewPortfolio={(id) => handleProductAction("view_portfolio", id)}
  //       onCompare={(id) => handleProductAction("compare", id)}
  //       className={className}
  //     />
  //   );
  // }

  // // Insurance Products
  // if (
  //   productType?.includes("insurance") ||
  //   productType?.includes("life") ||
  //   productType?.includes("health") ||
  //   productType?.includes("auto_insurance") ||
  //   productType?.includes("home_insurance") ||
  //   productType?.includes("travel")
  // ) {
  //   return (
  //     <InsuranceProduct
  //       product={product}
  //       variant={variant as "default" | "compact" | "family"}
  //       onGetQuote={(id) => handleProductAction("quote", id)}
  //       onCompare={(id) => handleProductAction("compare", id)}
  //       className={className}
  //     />
  //   );
  // }

  // // Digital Services
  // if (
  //   productType?.includes("digital") ||
  //   productType?.includes("mobile") ||
  //   productType?.includes("wallet") ||
  //   productType?.includes("payment") ||
  //   productType?.includes("fintech") ||
  //   productType?.includes("app")
  // ) {
  //   return (
  //     <DigitalServiceProduct
  //       product={product}
  //       variant={variant as "default" | "compact" | "modern"}
  //       onGetStarted={(id) => handleProductAction("get_started", id)}
  //       onDownload={(id) => handleProductAction("download", id)}
  //       onCompare={(id) => handleProductAction("compare", id)}
  //       className={className}
  //     />
  //   );
  // }

  // Default fallback to generic ProductCard
  return (
    <ProductPage
      product={product}
      onApply={(id) => handleProductAction("apply", id)}
      onCompare={(id) => handleProductAction("compare", id)}
      onAskGuru={(query, id) => handleProductAction("ask_guru", id)}
    />
  );
}
