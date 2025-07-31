"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Star,
  Percent,
  DollarSign,
  Shield,
  Zap,
  Gift,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/index";
import { Product } from "@/types/product";

interface CreditCardProductProps {
  product: Product;
  variant?: "default" | "compact" | "premium";
  className?: string;
  onApply?: (productId: string) => void;
  onCompare?: (productId: string) => void;
}

export function CreditCardProduct({
  product,
  variant = "default",
  className,
  onApply,
  onCompare,
}: CreditCardProductProps) {
  // Extract key credit card specific info
  const annualFee = product.details.additionalInfo.find(
    (info) =>
      info.label.toLowerCase().includes("annual fee") ||
      info.label.toLowerCase().includes("fee")
  );

  const interestRate = product.details.additionalInfo.find(
    (info) =>
      info.type === "percentage" &&
      (info.label.toLowerCase().includes("rate") ||
        info.label.toLowerCase().includes("apr"))
  );

  const creditLimit = product.details.additionalInfo.find(
    (info) =>
      info.type === "number" &&
      (info.label.toLowerCase().includes("limit") ||
        info.label.toLowerCase().includes("credit"))
  );

  const cardImage = product.details.additionalInfo.find(
    (info) => info.type === "image"
  );

  return (
    <Card
      className={cn(
        "group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 overflow-hidden",
        variant === "premium" &&
          "bg-gradient-to-br from-gray-900 to-gray-800 text-white",
        variant === "compact" && "max-w-sm",
        className
      )}
    >
      {/* Card Visual */}
      <div
        className={cn(
          "relative h-48 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700",
          variant === "premium" && "from-gray-800 via-gray-900 to-black"
        )}
      >
        {cardImage ? (
          <Image
            src={cardImage.value.toString() || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <CreditCard className="w-16 h-16 text-white/80" />
          </div>
        )}

        {/* Card Overlay Info */}
        <div className="absolute inset-0 bg-black/20 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white font-bold text-xl">{product.name}</h3>
              <p className="text-white/80 text-sm">
                {product.institution?.name || "Bank Institution"}
              </p>
            </div>
            {product.isFeatured && (
              <Badge className="bg-white/20 text-white border-white/30">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-end">
            <div className="text-white">
              <div className="text-2xl font-mono">•••• •••• •••• ••••</div>
              <div className="text-sm opacity-80 mt-1">Valid Thru 12/28</div>
            </div>
            <div className="w-12 h-8 bg-white/20 rounded backdrop-blur-sm flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {interestRate && (
            <div className="text-center p-4 bg-orange-50 rounded-2xl">
              <Percent className="w-5 h-5 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {interestRate.value}%
              </div>
              <div className="text-xs text-gray-600">APR</div>
            </div>
          )}

          {annualFee && (
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {annualFee.value}
              </div>
              <div className="text-xs text-gray-600">Annual Fee</div>
            </div>
          )}

          {creditLimit && (
            <div className="text-center p-4 bg-blue-50 rounded-2xl">
              <Shield className="w-5 h-5 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                $
                {Number.parseInt(
                  creditLimit?.value.toString()
                ).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Credit Limit</div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Gift className="w-4 h-4 mr-2 text-orange-500" />
            Key Features
          </h4>
          <div className="grid gap-2">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-700">
                Instant approval process
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Shield className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-700">
                Fraud protection included
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Gift className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-700">
                Rewards on every purchase
              </span>
            </div>
          </div>
        </div>

        {/* Eligibility */}
        <div className="p-4 bg-orange-50 rounded-2xl">
          <h5 className="font-medium text-orange-800 mb-2">
            Eligibility Requirements
          </h5>
          <p className="text-sm text-orange-700">
            {product.details.eligibility}
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={() => onApply?.(product.id)}
            className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl transition-all duration-300"
          >
            Apply Now
            <ArrowRight className="w-4 h-4 ml-2" />
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
      </CardContent>
    </Card>
  );
}
