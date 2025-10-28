"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Percent,
  Calculator,
  ArrowRight,
  MessageCircle,
  Building2,
  BarChart,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { useGuruBot } from "@/providers/gurubot-provider";
import { ShareProduct } from "@/components/shared/share-product";
import { SaveProduct } from "@/components/shared/save-product";

interface LoanProductProps {
  product: Product;
  variant?: "default" | "compact" | "detailed";
  className?: string;
  onApply?: (productId: string) => void;
  onCompare?: (productId: string) => void;
  onViewDetails?: (productId: string) => void | Promise<void>;
  onSave?: (productId: string) => void | Promise<void>;
  onUnsave?: (productId: string) => void | Promise<void>;
}

export function LoanProduct({
  product,
  className,
  onCompare,
  onViewDetails,
  onSave,
  onUnsave,
}: LoanProductProps) {
  const { askAboutProduct } = useGuruBot();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleAskGuru = () => {
    const query = `Tell me more about the ${product.name} loan. What are the interest rates, terms, requirements, and application process?`;
    askAboutProduct(query, product.id);
  };

  const handleViewDetails = async () => {
    setIsNavigating(true);
    try {
      await onViewDetails?.(product.id);
    } catch (error) {
      console.error("Navigation error:", error);
      setIsNavigating(false);
    }
  };

  // Extract loan-specific information
  const interestRate = product.details.additionalInfo.find(
    (info) => info.type === "percentage"
  );

  const maxAmount = product.details.additionalInfo.find(
    (info) =>
      info.type === "number" &&
      (info.label.toLowerCase().includes("amount") ||
        info.label.toLowerCase().includes("limit"))
  );

  const productImage = product.details.additionalInfo.find(
    (info) => info.id === "product-image"
  );

  const productUrl = product.details.additionalInfo.find(
    (info) => info.id === "product-url"
  );

  // Derived details to show (minimal, from additionalInfo)
  const keyDetails = useMemo(() => {
    const excludeIds = new Set(["product-image", "product-url"]);
    const excludeLabels = ["amount", "limit", "rate", "interest"]; // shown above already

    return product.details.additionalInfo
      .filter((i) => !excludeIds.has(i.id))
      .filter(
        (i) => !excludeLabels.some((k) => i.label?.toLowerCase().includes(k))
      )
      .filter(
        (i) => i.value !== undefined && i.value !== null && i.value !== ""
      )
      .slice(0, 6);
  }, [product.details.additionalInfo]);

  const formatCurrency = (n: unknown) => {
    const num = typeof n === "string" ? Number(n) : (n as number);
    if (Number.isFinite(num)) {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(num as number);
    }
    return String(n);
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow",
        "w-full max-w-md mx-auto pb-0",
        className
      )}
    >
      {/* Featured ribbon */}
      {product.isFeatured && (
        <div className="absolute right-3 top-3 z-10">
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-[10px] px-2 py-0.5">
            <Star className="w-3 h-3 mr-1 fill-current" /> Hot
          </Badge>
        </div>
      )}

      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          {product.institution?.logoUrl ? (
            <div className="w-9 h-9 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src={product.institution.logoUrl || "/placeholder.svg"}
                alt={product.institution.name}
                width={24}
                height={24}
                className="rounded object-contain"
              />
            </div>
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-white" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-medium text-gray-600 truncate">
                {product.institution?.name}
              </p>
              <Badge
                variant="outline"
                className="text-[10px] text-green-700 border-green-200 bg-green-50 px-2 py-0.5"
              >
                {product.productType?.name || "Loan"}
              </Badge>
            </div>
            <h3 className="mt-0.5 font-semibold text-sm md:text-base text-gray-900 leading-tight truncate">
              {product.name}
            </h3>
          </div>

          {productImage && (
            <div className="hidden sm:block relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 ml-2">
              <Image
                src={productImage.value.toString()}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Stats */}
        {(interestRate || maxAmount) && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {interestRate && (
              <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <div className="w-6 h-6 bg-white rounded-md shadow-sm grid place-items-center">
                  <Percent className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {interestRate.value}%
                  </div>
                  <div className="text-[11px] text-gray-500">Rate</div>
                </div>
              </div>
            )}
            {maxAmount && (
              <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <div className="w-6 h-6 bg-white rounded-md shadow-sm grid place-items-center">
                  <Calculator className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(maxAmount.value)}
                  </div>
                  <div className="text-[11px] text-gray-500">Max amount</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Key detail chips */}
        {keyDetails.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {keyDetails.map((d) => (
              <Badge
                key={d.id}
                variant="outline"
                className="bg-white text-gray-700 border-gray-200 text-xs font-normal px-2 py-1"
              >
                <span className="text-gray-500">{d.label}:</span>{" "}
                <span className="ml-1 font-medium">{String(d.value)}</span>
              </Badge>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="mt-4 mb-3 h-px bg-gray-100" />

        {/* Actions */}
        <div className="space-y-2 flex flex-col items-end">
          <div className="flex items-center gap-2 w-full">
            <Button
              onClick={handleViewDetails}
              disabled={isNavigating}
              className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  View details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {productUrl?.value && (
              <Button
                onClick={() =>
                  window.open(productUrl?.value.toString(), "_blank")
                }
                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm px-3"
              >
                Apply
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button
              onClick={handleAskGuru}
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-lg border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              title="Ask GuruBot"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            {onCompare && (
              <Button
                onClick={() => onCompare(product.id)}
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 rounded-lg border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                title="Compare Products"
              >
                <BarChart className="w-4 h-4" />
              </Button>
            )}
            <ShareProduct
              product={product}
              triggerText=""
              className="h-10 w-10 p-0 rounded-lg border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            />
            <SaveProduct
              product={product}
              onSave={onSave}
              onUnsave={onUnsave}
              className="h-10 w-10 p-0 rounded-lg border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
