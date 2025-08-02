"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Target,
  ArrowRight,
  Star,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils/index";
import { Product } from "@/types/product";

interface InvestmentProductProps {
  product: Product;
  variant?: "default" | "compact" | "premium";
  className?: string;
  onInvest?: (productId: string) => void;
  onViewPortfolio?: (productId: string) => void;
}

export function InvestmentProduct({
  product,
  variant = "default",
  className,
  onInvest,
  onViewPortfolio,
}: InvestmentProductProps) {
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

  return (
    <Card
      className={cn(
        "group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 bg-white",
        variant === "premium" &&
          "bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100",
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
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600"
                  : "bg-gradient-to-r from-purple-500 to-purple-600"
              )}
            >
              <TrendingUp className="w-6 h-6 text-white" />
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
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Star className="w-3 h-3 mr-1" />
              Top Performer
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-gray-600 border-gray-200">
            {product.productType?.name || "Product Type"}
          </Badge>
          <Badge
            variant="outline"
            className="text-purple-600 border-purple-200 bg-purple-50"
          >
            Diversified
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Investment Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {expectedReturn && (
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <BarChart3 className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">
                {expectedReturn.value}%
              </div>
              <div className="text-xs text-gray-600">Expected Return</div>
            </div>
          )}

          {minimumInvestment && (
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">
                $
                {Number.parseInt(
                  minimumInvestment.value.toString()
                ).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Min Investment</div>
            </div>
          )}

          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <Shield className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">Low</div>
            <div className="text-xs text-gray-600">Risk Level</div>
          </div>
        </div>

        {/* Investment Features */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Investment Features</h4>
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <PieChart className="w-5 h-5 text-purple-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Diversified Portfolio
                </span>
                <p className="text-sm text-gray-600">
                  Spread across multiple asset classes
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Target className="w-5 h-5 text-green-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Goal-Based Investing
                </span>
                <p className="text-sm text-gray-600">
                  Aligned with your financial objectives
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Professional Management
                </span>
                <p className="text-sm text-gray-600">
                  Managed by experienced fund managers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-900">
              5-Year Performance
            </span>
            <span className="text-sm text-green-600 font-semibold">+12.4%</span>
          </div>
          <div className="h-16 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-xl flex items-end justify-between px-2 pb-2">
            {[40, 60, 45, 70, 55, 80, 65].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-sm"
                style={{ height: `${height}%`, width: "8px" }}
              />
            ))}
          </div>
        </div>

        {/* Investment Details */}
        <div className="p-4 bg-gray-50 rounded-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Management Fee
              </span>
              <p className="text-lg font-semibold text-gray-900">
                {managementFee ? managementFee.value : product.details.fees}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                Eligibility
              </span>
              <p className="text-lg font-semibold text-gray-900">
                {product.details.eligibility}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {variant !== "compact" && (
          <div className="p-4 bg-purple-50 rounded-2xl">
            <p className="text-sm text-purple-800 leading-relaxed">
              {product.details.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={() => onInvest?.(product.id)}
            className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300"
          >
            Start Investing
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          {onViewPortfolio && (
            <Button
              onClick={() => onViewPortfolio(product.id)}
              variant="outline"
              className="h-12 px-6 rounded-2xl border-gray-200 hover:bg-gray-50"
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
