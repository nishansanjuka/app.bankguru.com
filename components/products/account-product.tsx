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
  Wallet,
  Star,
  TrendingUp,
  DollarSign,
  Shield,
  Smartphone,
  CreditCard,
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
  className,
  onOpenAccount,
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
        "group hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden",
        "w-full max-w-sm",
        className
      )}
    >
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
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
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs h-5">
              <Star className="w-3 h-3 mr-1" />
              Popular
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
        <div className="grid grid-cols-3 gap-2">
          {interestRate && (
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-3 h-3 text-green-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">{interestRate.value}%</div>
              <div className="text-xs text-gray-600">APY</div>
            </div>
          )}

          {minimumBalance && (
            <div className="text-center p-2 bg-orange-50 rounded-lg">
              <DollarSign className="w-3 h-3 text-orange-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">${minimumBalance.value}</div>
              <div className="text-xs text-gray-600">Min Balance</div>
            </div>
          )}

          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <Shield className="w-3 h-3 text-blue-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-gray-900">$250K</div>
            <div className="text-xs text-gray-600">FDIC</div>
          </div>
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

                {/* Account Benefits */}
                <div className="space-y-1">
                  <h4 className="font-medium text-xs text-gray-900">Account Benefits</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-3 h-3 text-blue-500" />
                      <span>Mobile banking & app</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-3 h-3 text-green-500" />
                      <span>Free debit card</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-3 h-3 text-orange-500" />
                      <span>Fraud protection</span>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium text-gray-700">Monthly Fee</span>
                      <p className="font-semibold text-gray-900">{formatFees(product.details.fees)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Eligibility</span>
                      <p className="font-semibold text-gray-900">{formatEligibility(product.details.eligibility)}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800 leading-relaxed">
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
            onClick={() => onOpenAccount?.(product.id)}
            className="flex-1 h-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 text-xs"
          >
            Open Account
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
