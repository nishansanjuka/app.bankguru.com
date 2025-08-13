"use client";

import { useState } from "react";
import {
  Card,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Percent,
  Calculator,
  Clock,
  ArrowRight,
  MessageCircle,
  Building2,
  BarChart,
  Info,
  Shield,
  // TrendingUp,
  Zap,
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

  const formatFees = (fees: string | number) => {
    if (typeof fees === "number") {
      return `${fees}%`;
    }
    return fees || "N/A";
  };

  const formatEligibility = (eligibility: string | number) => {
    if (typeof eligibility === "number") {
      return `${eligibility}+ years`;
    }
    return eligibility || "N/A";
  };

  const productImage = product.details.additionalInfo.find(
    (info) => info.id === "product-image"
  );

  const productUrl = product.details.additionalInfo.find(
    (info) => info.id === "product-url"
  );

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden bg-white",
        "w-full max-w-sm mx-auto p-0",
        className
      )}
    >
      {/* Compact Header */}
      <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {product.institution?.logoUrl ? (
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src={product.institution.logoUrl || "/placeholder.svg"}
                  alt={product.institution.name}
                  width={24}
                  height={24}
                  className="rounded object-contain"
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{product.institution?.name}</p>
              <h3 className="font-semibold text-sm text-gray-900 leading-tight truncate">
                {product.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {product.isFeatured && (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-xs px-1.5 py-0.5">
                <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                Hot
              </Badge>
            )}
            <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50 px-1.5 py-0.5">
              {product.productType?.name || "Loan"}
            </Badge>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-100">
          {interestRate && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white rounded-md shadow-sm flex items-center justify-center">
                <Percent className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{interestRate.value}%</div>
                <div className="text-xs text-gray-600">Rate</div>
              </div>
            </div>
          )}

          {maxAmount && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white rounded-md shadow-sm flex items-center justify-center">
                <Calculator className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">${maxAmount.value}</div>
                <div className="text-xs text-gray-600">Max</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Quick Features Preview */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700">Quick approval</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-700">Flexible terms</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700">Competitive</span>
          </div>
        </div>

        {/* Essential Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Processing Fee</p>
            <p className="font-semibold text-gray-900 mt-1">{formatFees(product.details.fees)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Min. Age</p>
            <p className="font-semibold text-gray-900 mt-1">{formatEligibility(product.details.eligibility)}</p>
          </div>
        </div>

        {/* Expandable Details Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border border-gray-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-gray-700 hover:no-underline hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4" />
                <span>View Full Details & Features</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                {/* Product Image - Compact Size */}
                {productImage && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={productImage.value.toString()}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.details.description}</p>
                    </div>
                  </div>
                )}

                {/* Detailed Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm">All Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Zap className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm text-blue-900">Quick approval process within 24 hours</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-sm text-orange-900">Flexible repayment terms up to 30 years</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-green-900">Competitive interest rates starting from {interestRate?.value}%</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {/* <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 text-sm mb-2">About This Loan</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {product.details.description}
                  </p>
                </div> */}

                {/* Performance Indicator */}
                {/* <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    Highly rated loan product with excellent customer satisfaction
                  </span>
                </div> */}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleViewDetails}
            disabled={isNavigating}
            className="w-full h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isNavigating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                View Full Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => window.open(productUrl?.value.toString(), "_blank")}
              className="flex-1 h-10 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm"
            >
              Apply Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <div className="flex space-x-1">
              <Button
                onClick={handleAskGuru}
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 rounded-lg border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                title="Ask GuruBot"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              {onCompare && (
                <Button
                  onClick={() => onCompare(product.id)}
                  variant="outline"
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
      </div>
    </Card>
  );
}
