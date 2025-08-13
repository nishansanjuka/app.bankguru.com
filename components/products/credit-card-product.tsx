"use client";

import {
  Card,
  CardContent,
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
  CreditCard,
  Star,
  Percent,
  DollarSign,
  Shield,
  Gift,
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
import { SaveProduct } from "@/components/shared/save-product";

interface CreditCardProductProps {
  product: Product;
  variant?: "default" | "compact" | "premium";
  className?: string;
  onApply?: (productId: string) => void;
  onCompare?: (productId: string) => void;
  onSave?: (productId: string) => void | Promise<void>;
  onUnsave?: (productId: string) => void | Promise<void>;
}

export function CreditCardProduct({
  product,
  className,
  onApply,
  onCompare,
  onSave,
  onUnsave,
}: CreditCardProductProps) {
  const { askAboutProduct } = useGuruBot();

  const handleAskGuru = () => {
    const query = `Tell me more about the ${product.name} credit card. What are its rewards, interest rates, fees, and key benefits?`;
    askAboutProduct(query, product.id);
  };

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
        "group hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden",
        "w-full max-w-sm",
        className
      )}
    >
      {/* Compact Header with Card Visual */}
      <div className="relative h-32 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
        {cardImage ? (
          <Image
            src={cardImage.value.toString() || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-white/80" />
          </div>
        )}

        {/* Overlay Info */}
        <div className="absolute inset-0 bg-black/20 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              {product.institution?.logoUrl ? (
                <Image
                  src={product.institution.logoUrl || "/placeholder.svg"}
                  alt={product.institution.name}
                  width={20}
                  height={20}
                  className="rounded"
                />
              ) : (
                <Building2 className="w-4 h-4 text-white" />
              )}
              <span className="text-white/90 text-xs font-medium">
                {product.institution?.name}
              </span>
            </div>
            {product.isFeatured && (
              <Badge className="bg-white/20 text-white border-white/30 text-xs h-5">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-end">
            <div className="text-white">
              <h3 className="font-bold text-sm leading-tight line-clamp-2">
                {product.name}
              </h3>
            </div>
            <div className="w-8 h-6 bg-white/20 rounded backdrop-blur-sm flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-3 space-y-3">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {interestRate && (
            <div className="text-center p-2 bg-orange-50 rounded-lg">
              <Percent className="w-3 h-3 text-orange-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">{interestRate.value}%</div>
              <div className="text-xs text-gray-600">APR</div>
            </div>
          )}

          {annualFee && (
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-3 h-3 text-green-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">{annualFee.value}</div>
              <div className="text-xs text-gray-600">Annual Fee</div>
            </div>
          )}

          {creditLimit && (
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <Shield className="w-3 h-3 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">${creditLimit.value}</div>
              <div className="text-xs text-gray-600">Limit</div>
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
                {/* Features */}
                <div className="space-y-1">
                  <h4 className="font-medium text-xs text-gray-900 flex items-center">
                    <Gift className="w-3 h-3 mr-1 text-orange-500" />
                    Key Features
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>• Cash back rewards</div>
                    <div>• No foreign transaction fees</div>
                    <div>• Extended warranty protection</div>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="p-2 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800 text-xs mb-1">
                    Eligibility
                  </h5>
                  <p className="text-xs text-orange-700">
                    {product.details.eligibility}
                  </p>
                </div>

                {/* Description */}
                <div className="text-xs text-gray-600 leading-relaxed">
                  {product.details.description}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={() => onApply?.(product.id)}
            className="flex-1 h-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300 text-xs"
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
          <SaveProduct
            product={product}
            onSave={onSave}
            onUnsave={onUnsave}
            className="h-8 px-2 rounded-lg border-gray-200 hover:bg-gray-50"
          />
        </div>
      </CardContent>
    </Card>
  );
}
