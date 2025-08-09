"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  DollarSign,
  Shield,
  Smartphone,
  CreditCard,
  ArrowRight,
  Star,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/index";
import { Product } from "@/types/product";
import { useGuruBot } from "@/providers/gurubot-provider";

interface AccountProductProps {
  product: Product;
  variant?: "default" | "compact" | "premium";
  className?: string;
  onOpenAccount?: (productId: string) => void;
  onLearnMore?: (productId: string) => void;
  onCompare?: (productId: string) => void;
}

export function AccountProduct({
  product,
  variant = "default",
  className,
  onOpenAccount,
  onLearnMore,
  onCompare,
}: AccountProductProps) {
  const { askAboutProduct } = useGuruBot();

  const handleAskGuru = () => {
    const query = `Tell me more about the ${product.name} account. What are the interest rates, fees, minimum balance requirements, and benefits?`;
    askAboutProduct(query, product.id);
  };

  // Extract account-specific information
  const interestRate = product.details.additionalInfo.find(
    (info) => info.type === "percentage"
  );

  const minimumBalance = product.details.additionalInfo.find(
    (info) =>
      info.type === "number" && info.label.toLowerCase().includes("minimum")
  );

  const monthlyFee = product.details.additionalInfo.find(
    (info) =>
      info.label.toLowerCase().includes("monthly") &&
      info.label.toLowerCase().includes("fee")
  );

  const formatFees = (fees: string | number) => {
    if (typeof fees === "number") {
      return `$${fees}`;
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

  return (
    <Card
      className={cn(
        "group transition-all duration-300 border-0 bg-white",
        variant === "premium" &&
          "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100",
        variant === "compact" && "max-w-sm",
        className
      )}
    >
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                variant === "premium"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                  : "bg-gradient-to-r from-blue-500 to-blue-600"
              )}
            >
              <Wallet className="w-6 h-6 text-white" />
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
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              <Star className="w-3 h-3 mr-1" />
              Popular
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

        {/* Account Highlights */}
        <div className="grid grid-cols-3 gap-3">
          {interestRate && (
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">
                {interestRate.value}%
              </div>
              <div className="text-xs text-gray-600">APY</div>
            </div>
          )}

          {minimumBalance && (
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">
                $
                {Number.parseInt(
                  minimumBalance.value.toString()
                ).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Min Balance</div>
            </div>
          )}

          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">$250K</div>
            <div className="text-xs text-gray-600">FDIC Insured</div>
          </div>
        </div>

        {/* Account Benefits */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Account Benefits</h4>
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Smartphone className="w-5 h-5 text-blue-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Mobile Banking
                </span>
                <p className="text-sm text-gray-600">
                  24/7 access via mobile app
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <CreditCard className="w-5 h-5 text-green-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Free Debit Card
                </span>
                <p className="text-sm text-gray-600">
                  No annual fee, worldwide acceptance
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Shield className="w-5 h-5 text-orange-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Fraud Protection
                </span>
                <p className="text-sm text-gray-600">
                  Advanced security monitoring
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="p-4 bg-gray-50 rounded-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Monthly Fee
              </span>
              <p className="text-lg font-semibold text-gray-900">
                {monthlyFee
                  ? monthlyFee.value
                  : formatFees(product.details.fees)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                Requirements
              </span>
              <p className="text-lg font-semibold text-gray-900">
                {formatEligibility(product.details.eligibility)}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {variant !== "compact" && (
          <div className="p-4 bg-blue-50 rounded-2xl">
            <p className="text-sm text-blue-800 leading-relaxed">
              {product.details.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={() => onOpenAccount?.(product.id)}
            className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300"
          >
            Open Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="flex space-x-3">
            <Button
              onClick={handleAskGuru}
              variant="outline"
              className="h-12 px-4 rounded-2xl border-gray-200 hover:bg-gray-50"
              title="Ask GuruBot about this account"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            {onLearnMore && (
              <Button
                onClick={() => onLearnMore(product.id)}
                variant="outline"
                className="h-12 px-6 rounded-2xl border-gray-200 hover:bg-gray-50"
              >
                Learn More
              </Button>
            )}
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
