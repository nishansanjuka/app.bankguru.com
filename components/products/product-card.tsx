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
  Building2,
  Star,
  Percent,
  DollarSign,
  ArrowRight,
  MessageCircle,
  BarChart,
  Info,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { useGuruBot } from "@/providers/gurubot-provider";
import { DynamicFormField } from "@/components/shared/dynamic-form-fields";
import { SaveProduct } from "@/components/shared/save-product";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "detailed";
  className?: string;
  onCompare?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  onSave?: (productId: string) => void | Promise<void>;
  onUnsave?: (productId: string) => void | Promise<void>;
}

export function ProductCard({
  product,
  className,
  onCompare,
  onViewDetails,
  onSave,
  onUnsave,
}: ProductCardProps) {
  const { askAboutProduct } = useGuruBot();

  const handleAskGuru = () => {
    const query = `Tell me more about the ${product.name} product. What are its key features, benefits, and how does it work?`;
    askAboutProduct(query, product.id);
  };
  
  const renderAdditionalInfo = (info: DynamicFormField) => {
    switch (info.type) {
      case "percentage":
        return (
          <div className="flex items-center space-x-1">
            <Percent className="w-3 h-3 text-orange-500" />
            <span className="font-semibold text-gray-900 text-xs">
              {info.value}%
            </span>
          </div>
        );
      case "number":
        return (
          <div className="flex items-center space-x-1">
            <DollarSign className="w-3 h-3 text-orange-500" />
            <span className="font-semibold text-gray-900 text-xs">
              ${Number.parseInt(info.value.toString()).toLocaleString()}
            </span>
          </div>
        );
      default:
        return (
          <div className="space-y-1">
            <p className="text-xs text-gray-900 font-semibold line-clamp-1">
              {info.value}
            </p>
          </div>
        );
    }
  };

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
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
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
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600">{product.institution?.name}</p>
            </div>
          </div>
          {product.isFeatured && (
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs h-5">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Product Type Badges */}
        <div className="flex items-center space-x-1">
          <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 h-5">
            {product.productType?.name}
          </Badge>
          <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 h-5">
            {product.productType?.category?.name}
          </Badge>
        </div>

        {/* Quick Stats Grid - Show first 2 key details */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded-lg text-center">
            <DollarSign className="w-3 h-3 text-orange-500 mx-auto mb-1" />
            <div className="text-xs font-bold text-gray-900">{formatFees(product.details.fees)}</div>
            <div className="text-xs text-gray-600">Fees</div>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg text-center">
            <Building2 className="w-3 h-3 text-blue-500 mx-auto mb-1" />
            <div className="text-xs font-bold text-gray-900">{formatEligibility(product.details.eligibility)}</div>
            <div className="text-xs text-gray-600">Eligibility</div>
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
                      src={productImage.value.toString() || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {product.details.additionalInfo
                    .filter((info) => info.type !== "image")
                    .slice(0, 4)
                    .map((info, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded-lg">
                        <div className="text-xs font-medium text-gray-700 mb-1">{info.label}</div>
                        {renderAdditionalInfo(info)}
                      </div>
                    ))}
                </div>

                {/* Description */}
                <div className="p-2 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-800 leading-relaxed line-clamp-3">
                    {product.details.description}
                  </p>
                </div>

                {/* Terms */}
                {product.details.terms && product.details.terms !== "no terms" && (
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-xs text-gray-700 mb-1">Terms & Conditions</h5>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {product.details.terms}
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={() => onViewDetails?.(product.id)}
            className="flex-1 h-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300 text-xs"
          >
            View Details
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
      </div>
    </Card>
  );
}
