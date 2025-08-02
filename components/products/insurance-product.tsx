"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Heart,
  Car,
  Home,
  Plane,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils/index";
import { Product } from "@/types/product";

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
  variant = "default",
  className,
  onGetQuote,
  onCompare,
}: InsuranceProductProps) {
  const IconComponent = getInsuranceIcon(product.productType?.name || "");

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
        "group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 bg-white",
        variant === "family" &&
          "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100",
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
                variant === "family"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600"
              )}
            >
              <IconComponent className="w-6 h-6 text-white" />
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
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
              <Star className="w-3 h-3 mr-1" />
              Recommended
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-gray-600 border-gray-200">
            {product.productType?.name || "Product Type"}
          </Badge>
          <Badge
            variant="outline"
            className="text-emerald-600 border-emerald-200 bg-emerald-50"
          >
            Comprehensive
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Insurance Highlights */}
        <div className="grid grid-cols-3 gap-3">
          {premium && (
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">
                ${premium.value}
              </div>
              <div className="text-xs text-gray-600">Monthly Premium</div>
            </div>
          )}

          {coverage && (
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">
                $
                {Number.parseInt(
                  coverage.value.toLocaleString()
                ).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Coverage Limit</div>
            </div>
          )}

          {deductible && (
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">
                ${deductible.value}
              </div>
              <div className="text-xs text-gray-600">Deductible</div>
            </div>
          )}
        </div>

        {/* Coverage Benefits */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Coverage Benefits</h4>
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <div>
                <span className="font-medium text-gray-900">
                  24/7 Claims Support
                </span>
                <p className="text-sm text-gray-600">
                  Round-the-clock assistance
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Comprehensive Protection
                </span>
                <p className="text-sm text-gray-600">
                  Wide range of covered incidents
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Family Coverage
                </span>
                <p className="text-sm text-gray-600">Protect your loved ones</p>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Details */}
        <div className="p-4 bg-gray-50 rounded-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Policy Fee
              </span>
              <p className="text-lg font-semibold text-gray-900">
                {product.details.fees}
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
          <div className="p-4 bg-emerald-50 rounded-2xl">
            <p className="text-sm text-emerald-800 leading-relaxed">
              {product.details.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={() => onGetQuote?.(product.id)}
            className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-300"
          >
            Get Quote
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
