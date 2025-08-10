"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Building2,
  ArrowRight,
  Percent,
  DollarSign,
  Calendar,
  Users,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/index";
import { Product } from "@/types/product";
import { DynamicFormField } from "../shared/dynamic-form-fields";
import { useGuruBot } from "@/providers/gurubot-provider";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "detailed";
  className?: string;
  onCompare?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
}

export function ProductCard({
  product,
  variant = "default",
  className,
  onCompare,
  onViewDetails,
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
            <span className="font-semibold text-gray-900 text-sm">
              {info.value}%
            </span>
          </div>
        );
      case "number":
        return (
          <div className="flex items-center space-x-1">
            <DollarSign className="w-3 h-3 text-orange-500" />
            <span className="font-semibold text-gray-900 text-sm">
              ${Number.parseInt(info.value.toString()).toLocaleString()}
            </span>
          </div>
        );
      default:
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-900 font-semibold line-clamp-1">
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
        "group transition-all duration-300 border-0 bg-white",
        variant === "compact" && "max-w-sm",
        className
      )}
    >
      <CardHeader className="space-y-4 pb-4">
        {/* Institution & Featured Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              {product.institution?.logoUrl ? (
                <Image
                  src={product.institution.logoUrl || "/placeholder.svg"}
                  alt={product.institution.name}
                  width={32}
                  height={32}
                  className="rounded-xl"
                />
              ) : (
                <Building2 className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600">
                {product.institution?.name}
              </p>
            </div>
          </div>
          {product.isFeatured && (
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Product Type */}
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-gray-600 border-gray-200">
            {product.productType?.name}
          </Badge>
          <Badge variant="outline" className="text-gray-600 border-gray-200">
            {product.productType?.category?.name}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Left side - Image */}
          <div className="flex-shrink-0">
            {productImage && (
              <div className="relative w-48 h-32 rounded-2xl overflow-hidden bg-gray-50">
                <Image
                  src={productImage.value.toString() || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Right side - Content */}
          <div className="flex-1 space-y-4">
            {/* Key Details */}
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Fees
                  </span>
                </div>
                <p className="text-sm text-gray-900 font-semibold">
                  {formatFees(product.details.fees)}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Eligibility
                  </span>
                </div>
                <p className="text-sm text-gray-900 font-semibold">
                  {formatEligibility(product.details.eligibility)}
                </p>
              </div>

              {/* Additional Info inline */}
              {product.details.additionalInfo
                .filter((info) => info.type !== "image")
                .slice(0, 2)
                .map((info) => (
                  <div key={info.id} className="space-y-1">
                    {renderAdditionalInfo(info)}
                  </div>
                ))}
            </div>

            {/* Description */}
            {variant !== "compact" && (
              <div className="space-y-2">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {product.details.description}
                </p>
              </div>
            )}

            {/* Terms */}
            {product.details.terms && product.details.terms !== "no terms" && (
              <div className="p-3 bg-orange-50 rounded-xl">
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-orange-800">
                      Terms
                    </span>
                    <p className="text-sm text-orange-700 mt-1 line-clamp-1">
                      {product.details.terms}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <Button
                onClick={() => onViewDetails?.(product.id)}
                className="flex-1 h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-300"
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="flex space-x-2">
                <Button
                  onClick={handleAskGuru}
                  variant="outline"
                  size="sm"
                  className="h-10 px-3 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-300"
                  title="Ask GuruBot about this product"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                {onCompare && (
                  <Button
                    onClick={() => onCompare(product.id)}
                    variant="outline"
                    className="h-10 px-4 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-300"
                  >
                    Compare
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
