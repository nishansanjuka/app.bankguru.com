"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  Percent,
  Calculator,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/index";
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
  variant = "default",
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
        "group transition-all duration-300 border-0 bg-white",
        variant === "compact" && "max-w-sm",
        className
      )}
    >
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <Banknote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600">
                {product.institution?.name || "Bank Institution"}
              </p>
            </div>
          </div>
          {product.isFeatured && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
              <Star className="w-3 h-3 mr-1" />
              Best Rate
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-gray-600 border-gray-200">
            {product.productType?.name || "Product Type"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Product Image */}
        {productImage && (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gray-50">
            <Image
              src={productImage.value.toString()}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Key Loan Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {interestRate && (
            <div className="p-4 bg-green-50 rounded-2xl text-center">
              <Percent className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {interestRate.value}%
              </div>
              <div className="text-sm text-gray-600">Interest Rate</div>
            </div>
          )}

          {maxAmount && (
            <div className="p-4 bg-blue-50 rounded-2xl text-center">
              <Calculator className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                ${Number.parseInt(maxAmount.value.toString()).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Max Amount</div>
            </div>
          )}
        </div>

        {/* Loan Features */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Loan Features</h4>
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Quick Approval
                </span>
                <p className="text-sm text-gray-600">
                  Get approved within 24 hours
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Flexible Terms
                </span>
                <p className="text-sm text-gray-600">
                  Choose repayment period up to 7 years
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Banknote className="w-5 h-5 text-orange-500" />
              <div>
                <span className="font-medium text-gray-900">
                  No Hidden Fees
                </span>
                <p className="text-sm text-gray-600">
                  Transparent pricing structure
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
          <div>
            <span className="text-sm font-medium text-gray-700">
              Processing Fee
            </span>
            <p className="text-lg font-semibold text-gray-900">
              {formatFees(product.details.fees)}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">
              Eligibility
            </span>
            <p className="text-lg font-semibold text-gray-900">
              {formatEligibility(product.details.eligibility)}
            </p>
          </div>
        </div>

        {/* Description */}
        {variant !== "compact" && (
          <div className="p-4 bg-orange-50 rounded-2xl">
            <p className="text-sm text-orange-800 leading-relaxed">
              {product.details.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={() => window.open(productUrl?.value.toString(), "_blank")}
            className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-300"
          >
            Apply Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="flex space-x-3">
            <Button
              onClick={handleAskGuru}
              variant="outline"
              className="h-12 px-4 rounded-2xl border-gray-200 hover:bg-gray-50"
              title="Ask GuruBot about this loan"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            {onCompare && (
              <Button
                onClick={() => onCompare(product.id)}
                variant="outline"
                className="h-12 px-6 rounded-2xl border-gray-200 hover:bg-gray-50"
              >
                Compare
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
