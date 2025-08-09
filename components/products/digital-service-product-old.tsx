"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Zap,
  Shield,
  CreditCard,
  Wallet,
  QrCode,
  ArrowRight,
  Star,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils/index";
import { Product } from "@/types/product";
import Image from "next/image";

interface DigitalServiceProductProps {
  product: Product;
  variant?: "default" | "compact" | "modern";
  className?: string;
  onGetStarted?: (productId: string) => void;
  onDownload?: (productId: string) => void;
  onCompare?: (productId: string) => void;
}

export function DigitalServiceProduct({
  product,
  variant = "default",
  className,
  onGetStarted,
  onDownload,
  onCompare,
}: DigitalServiceProductProps) {
  // Extract product image and URL
  const productImage = product.details.additionalInfo.find(
    (info) => info.label.toLowerCase().includes("image") || info.label.toLowerCase().includes("photo")
  );
  
  const productUrl = product.details.additionalInfo.find(
    (info) => info.label.toLowerCase().includes("url") || info.label.toLowerCase().includes("link")
  );

  // Extract digital service specific information
  const transactionFee = product.details.additionalInfo.find(
    (info) =>
      info.label.toLowerCase().includes("transaction") ||
      info.label.toLowerCase().includes("fee")
  );

  const dailyLimit = product.details.additionalInfo.find(
    (info) =>
      info.type === "number" && info.label.toLowerCase().includes("limit")
  );

  return (
    <Card
      className={cn(
        "group  transition-all duration-300 border-0 bg-white",
        variant === "modern" &&
          "bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100",
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
                variant === "modern"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                  : "bg-gradient-to-r from-cyan-500 to-cyan-600"
              )}
            >
              <Smartphone className="w-6 h-6 text-white" />
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
            <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200">
              <Star className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-gray-600 border-gray-200">
            {product.productType?.name || "Product Type"}
          </Badge>
          <Badge
            variant="outline"
            className="text-cyan-600 border-cyan-200 bg-cyan-50"
          >
            Digital First
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Service Highlights */}
        <div className="grid grid-cols-3 gap-3">
          {transactionFee && (
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <Zap className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">
                {transactionFee.value}
              </div>
              <div className="text-xs text-gray-600">Transaction Fee</div>
            </div>
          )}

          {dailyLimit && (
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <CreditCard className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">
                $
                {Number.parseInt(
                  dailyLimit.value.toLocaleString()
                ).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Daily Limit</div>
            </div>
          )}

          <div className="text-center p-3 bg-purple-50 rounded-xl">
            <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">Instant</div>
            <div className="text-xs text-gray-600">Processing</div>
          </div>
        </div>

        {/* Digital Features */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Digital Features</h4>
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <QrCode className="w-5 h-5 text-cyan-500" />
              <div>
                <span className="font-medium text-gray-900">
                  QR Code Payments
                </span>
                <p className="text-sm text-gray-600">Scan and pay instantly</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Wallet className="w-5 h-5 text-green-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Digital Wallet
                </span>
                <p className="text-sm text-gray-600">
                  Store cards and make payments
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Shield className="w-5 h-5 text-orange-500" />
              <div>
                <span className="font-medium text-gray-900">
                  Biometric Security
                </span>
                <p className="text-sm text-gray-600">
                  Fingerprint and face recognition
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* App Features */}
        <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl">
          <h5 className="font-medium text-gray-900 mb-3">Available Features</h5>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">Bill Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">Money Transfer</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">Investment Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">Expense Analytics</span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="p-4 bg-gray-50 rounded-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Service Fee
              </span>
              <p className="text-lg font-semibold text-gray-900">
                {product.details.fees}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                Requirements
              </span>
              <p className="text-lg font-semibold text-gray-900">
                {product.details.eligibility}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {variant !== "compact" && (
          <div className="p-4 bg-cyan-50 rounded-2xl">
            <p className="text-sm text-cyan-800 leading-relaxed">
              {product.details.description}
            </p>
          </div>
        )}

        {/* Product Image */}
        {productImage && (
          <div className="relative h-48 w-full rounded-2xl overflow-hidden">
            <Image
              src={productImage.value.toString()}
              alt={`${product.name} preview`}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={() => onGetStarted?.(product.id)}
            className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-2xl transition-all duration-300"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="flex space-x-3">
            {onDownload && (
              <Button
                onClick={() => onDownload(product.id)}
                variant="outline"
                className="h-12 px-6 rounded-2xl border-gray-200 hover:bg-gray-50"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Download
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
