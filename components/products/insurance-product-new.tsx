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
  Shield,
  Star,
  DollarSign,
  CheckCircle,
  Heart,
  Car,
  Home,
  Plane,
  Users,
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

interface InsuranceProductProps {
  product: Product;
  variant?: "default" | "compact" | "family";
  className?: string;
  onGetQuote?: (productId: string) => void;
  onCompare?: (productId: string) => void;
}

const getInsuranceIcon = (productType: string) => {
  const type = productType.toLowerCase();
  if (type.includes("health") || type.includes("medical")) return Heart;
  if (type.includes("auto") || type.includes("car") || type.includes("vehicle"))
    return Car;
  if (type.includes("home") || type.includes("property")) return Home;
  if (type.includes("travel")) return Plane;
  if (type.includes("life")) return Users;
  return Shield;
};

export function InsuranceProduct({
  product,
  className,
  onGetQuote,
  onCompare,
}: InsuranceProductProps) {
  const { askAboutProduct } = useGuruBot();

  const handleAskGuru = () => {
    const query = `Tell me more about the ${product.name} insurance. What coverage does it provide, what are the premiums, deductibles, and benefits?`;
    askAboutProduct(query, product.id);
  };
  
  const IconComponent = getInsuranceIcon(product.productType?.name || "");

  // Extract product image and URL
  const productImage = product.details.additionalInfo.find(
    (info) =>
      info.label.toLowerCase().includes("image") ||
      info.label.toLowerCase().includes("photo")
  );

  // Extract insurance-specific information
  const premium = product.details.additionalInfo.find(
    (info) =>
      info.label.toLowerCase().includes("premium") ||
      info.label.toLowerCase().includes("monthly")
  );

  const coverage = product.details.additionalInfo.find(
    (info) =>
      info.type === "number" &&
      (info.label.toLowerCase().includes("coverage") ||
        info.label.toLowerCase().includes("limit"))
  );

  const deductible = product.details.additionalInfo.find((info) =>
    info.label.toLowerCase().includes("deductible")
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
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <IconComponent className="w-4 h-4 text-white" />
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
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs h-5">
              <Star className="w-3 h-3 mr-1" />
              Recommended
            </Badge>
          )}
        </div>

        {/* Product Type Badges */}
        <div className="flex items-center space-x-1">
          <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 h-5">
            {product.productType?.name || "Product Type"}
          </Badge>
          <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50 h-5">
            Comprehensive
          </Badge>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {premium && (
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-3 h-3 text-green-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">${premium.value}</div>
              <div className="text-xs text-gray-600">Monthly</div>
            </div>
          )}

          {coverage && (
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <Shield className="w-3 h-3 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">${coverage.value}</div>
              <div className="text-xs text-gray-600">Coverage</div>
            </div>
          )}

          {deductible && (
            <div className="text-center p-2 bg-orange-50 rounded-lg">
              <DollarSign className="w-3 h-3 text-orange-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">${deductible.value}</div>
              <div className="text-xs text-gray-600">Deductible</div>
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
                  <div className="relative h-24 w-full rounded-lg overflow-hidden">
                    <Image
                      src={productImage.value.toString()}
                      alt={`${product.name} preview`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Coverage Benefits */}
                <div className="space-y-1">
                  <h4 className="font-medium text-xs text-gray-900">Coverage Benefits</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span>Comprehensive coverage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-3 h-3 text-blue-500" />
                      <span>24/7 customer support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span>Fast claim processing</span>
                    </div>
                  </div>
                </div>

                {/* Policy Details */}
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium text-gray-700">Policy Term</span>
                      <p className="font-semibold text-gray-900">Annual</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Waiting Period</span>
                      <p className="font-semibold text-gray-900">30 days</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-emerald-800 leading-relaxed">
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
            onClick={() => onGetQuote?.(product.id)}
            className="flex-1 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300 text-xs"
          >
            Get Quote
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
