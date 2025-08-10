"use client";

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
import {
  Banknote,
  Star,
  Percent,
  Calculator,
  CheckCircle,
  Clock,
  ArrowRight,
  MessageCircle,
  Building2,
  BarChart,
  Info,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { useGuruBot } from "@/providers/gurubot-provider";

interface LoanProductProps {
  product: Product;
  variant?: "default" | "compact" | "detailed";
  className?: string;
  onApply?: (productId: string) => void;
  onCompare?: (productId: string) => void;
}

export function LoanProduct({
  product,
  className,
  onCompare,
}: LoanProductProps) {
  const { askAboutProduct } = useGuruBot();

  const handleAskGuru = () => {
    const query = `Tell me more about the ${product.name} loan. What are the interest rates, terms, requirements, and application process?`;
    askAboutProduct(query, product.id);
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
        "group hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden",
        "w-full max-w-sm",
        className
      )}
    >
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Banknote className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center space-x-1 mt-1">
                {product.institution?.logoUrl ? (
                  <Image
                    src={product.institution.logoUrl || "/placeholder.svg"}
                    alt={product.institution.name}
                    width={16}
                    height={16}
                    className="rounded"
                  />
                ) : (
                  <Building2 className="w-3 h-3 text-gray-500" />
                )}
                <span className="text-xs text-gray-600">{product.institution?.name}</span>
              </div>
            </div>
          </div>
          {product.isFeatured && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs h-5">
              <Star className="w-3 h-3 mr-1" />
              Best Rate
            </Badge>
          )}
        </div>

        {/* Product Type Badge */}
        <div className="flex items-center space-x-1">
          <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 h-5">
            {product.productType?.name || "Product Type"}
          </Badge>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {interestRate && (
            <div className="p-2 bg-green-50 rounded-lg text-center">
              <Percent className="w-3 h-3 text-green-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">{interestRate.value}%</div>
              <div className="text-xs text-gray-600">Interest Rate</div>
            </div>
          )}

          {maxAmount && (
            <div className="p-2 bg-blue-50 rounded-lg text-center">
              <Calculator className="w-3 h-3 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">${maxAmount.value}</div>
              <div className="text-xs text-gray-600">Max Amount</div>
            </div>
          )}
        </div>

        {/* Accordion for Additional Details */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="py-2 text-xs font-medium text-gray-700 hover:no-underline">
              <div className="flex items-center space-x-2">
                <Info className="w-3 h-3" />
                <span>View Details</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-2">
              <div className="space-y-2">
                {/* Product Image */}
                {productImage && (
                  <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-50">
                    <Image
                      src={productImage.value.toString()}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Loan Features */}
                <div className="space-y-1">
                  <h4 className="font-medium text-xs text-gray-900">Loan Features</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Quick approval process</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span>Flexible repayment terms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Banknote className="w-3 h-3 text-orange-500" />
                      <span>Competitive interest rates</span>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded-lg text-xs">
                  <div>
                    <span className="font-medium text-gray-700">Processing Fee</span>
                    <p className="font-semibold text-gray-900">{formatFees(product.details.fees)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Eligibility</span>
                    <p className="font-semibold text-gray-900">{formatEligibility(product.details.eligibility)}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="p-2 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-800 leading-relaxed">
                    {product.details.description}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={() => window.open(productUrl?.value.toString(), "_blank")}
            className="flex-1 h-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-300 text-xs"
          >
            Apply
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
          <Button
            onClick={handleAskGuru}
            variant="outline"
            size="sm"
            className="h-8 px-2 rounded-lg border-gray-200 hover:bg-gray-50"
            title="Ask GuruBot"
          >
            <MessageCircle className="w-3 h-3" />
          </Button>
          {onCompare && (
            <Button
              onClick={() => onCompare(product.id)}
              variant="outline"
              size="sm"
              className="h-8 px-2 rounded-lg border-gray-200 hover:bg-gray-50"
              title="Compare"
            >
              <BarChart className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
