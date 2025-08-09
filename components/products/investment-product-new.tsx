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
  TrendingUp,
  Star,
  BarChart3,
  DollarSign,
  Shield,
  PieChart,
  Target,
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

interface InvestmentProductProps {
  product: Product;
  variant?: "default" | "compact" | "premium";
  className?: string;
  onInvest?: (productId: string) => void;
  onViewPortfolio?: (productId: string) => void;
  onCompare?: (productId: string) => void;
}

export function InvestmentProduct({
  product,
  className,
  onInvest,
  onCompare,
}: InvestmentProductProps) {
  const { askAboutProduct } = useGuruBot();

  const handleAskGuru = () => {
    const query = `Tell me more about the ${product.name} investment. What are the expected returns, risks, minimum investment, and portfolio strategy?`;
    askAboutProduct(query, product.id);
  };

  // Extract investment-specific information
  const expectedReturn = product.details.additionalInfo.find(
    (info) =>
      info.type === "percentage" &&
      (info.label.toLowerCase().includes("return") ||
        info.label.toLowerCase().includes("yield"))
  );

  const minimumInvestment = product.details.additionalInfo.find(
    (info) =>
      info.type === "number" && info.label.toLowerCase().includes("minimum")
  );

  const managementFee = product.details.additionalInfo.find(
    (info) =>
      info.label.toLowerCase().includes("management") ||
      info.label.toLowerCase().includes("expense")
  );

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
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
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
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs h-5">
              <Star className="w-3 h-3 mr-1" />
              Top Performer
            </Badge>
          )}
        </div>

        {/* Product Type Badges */}
        <div className="flex items-center space-x-1">
          <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 h-5">
            {product.productType?.name || "Product Type"}
          </Badge>
          <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50 h-5">
            Diversified
          </Badge>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {expectedReturn && (
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <BarChart3 className="w-3 h-3 text-green-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">{expectedReturn.value}%</div>
              <div className="text-xs text-gray-600">Return</div>
            </div>
          )}

          {minimumInvestment && (
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-3 h-3 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">${minimumInvestment.value}</div>
              <div className="text-xs text-gray-600">Min Invest</div>
            </div>
          )}

          <div className="text-center p-2 bg-orange-50 rounded-lg">
            <Shield className="w-3 h-3 text-orange-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-gray-900">Low</div>
            <div className="text-xs text-gray-600">Risk</div>
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

                {/* Investment Features */}
                <div className="space-y-1">
                  <h4 className="font-medium text-xs text-gray-900">Investment Features</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <PieChart className="w-3 h-3 text-purple-500" />
                      <span>Diversified portfolio</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-3 h-3 text-green-500" />
                      <span>Professional management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-3 h-3 text-orange-500" />
                      <span>Risk-adjusted returns</span>
                    </div>
                  </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="p-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Performance (1Y)</span>
                    <span className="text-xs text-green-600 font-semibold">+12.5%</span>
                  </div>
                  <div className="h-8 bg-gradient-to-r from-purple-200 to-indigo-200 rounded flex items-end justify-between px-1">
                    <div className="w-1 bg-purple-400 h-2 rounded-t"></div>
                    <div className="w-1 bg-purple-400 h-4 rounded-t"></div>
                    <div className="w-1 bg-purple-400 h-3 rounded-t"></div>
                    <div className="w-1 bg-purple-400 h-6 rounded-t"></div>
                    <div className="w-1 bg-purple-400 h-5 rounded-t"></div>
                  </div>
                </div>

                {/* Investment Details */}
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium text-gray-700">Management Fee</span>
                      <p className="font-semibold text-gray-900">{managementFee?.value || "0.75%"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Fund Type</span>
                      <p className="font-semibold text-gray-900">Mutual Fund</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-2 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-800 leading-relaxed">
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
            onClick={() => onInvest?.(product.id)}
            className="flex-1 h-8 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 text-xs"
          >
            Start Investing
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
