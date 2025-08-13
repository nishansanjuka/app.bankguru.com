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
  Smartphone,
  Star,
  Zap,
  CreditCard,
  Clock,
  QrCode,
  Wallet,
  Shield,
  CheckCircle,
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

interface DigitalServiceProductProps {
  product: Product;
  variant?: "default" | "compact" | "modern";
  className?: string;
  onGetStarted?: (productId: string) => void;
  onDownload?: (productId: string) => void;
  onCompare?: (productId: string) => void;
  onSave?: (productId: string) => void | Promise<void>;
  onUnsave?: (productId: string) => void | Promise<void>;
}

export function DigitalServiceProduct({
  product,
  className,
  onGetStarted,
  onCompare,
  onSave,
  onUnsave,
}: DigitalServiceProductProps) {
  const { askAboutProduct } = useGuruBot();

  const handleAskGuru = () => {
    const query = `Tell me more about the ${product.name} digital service. What are its features, benefits, and how does it work?`;
    askAboutProduct(query, product.id);
  };

  // Extract product image
  const productImage = product.details.additionalInfo.find(
    (info) => info.label.toLowerCase().includes("image") || info.label.toLowerCase().includes("photo")
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
        "group hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden",
        "w-full max-w-sm",
        className
      )}
    >
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
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
            <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 text-xs h-5">
              <Star className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>

        {/* Product Type Badges */}
        <div className="flex items-center space-x-1">
          <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 h-5">
            {product.productType?.name || "Product Type"}
          </Badge>
          <Badge variant="outline" className="text-xs text-cyan-600 border-cyan-200 bg-cyan-50 h-5">
            Digital First
          </Badge>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {transactionFee && (
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <Zap className="w-3 h-3 text-green-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">{transactionFee.value}</div>
              <div className="text-xs text-gray-600">Fee</div>
            </div>
          )}

          {dailyLimit && (
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <CreditCard className="w-3 h-3 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-900">${dailyLimit.value}</div>
              <div className="text-xs text-gray-600">Daily Limit</div>
            </div>
          )}

          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <Clock className="w-3 h-3 text-purple-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-gray-900">Instant</div>
            <div className="text-xs text-gray-600">Processing</div>
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
                  <div className="relative h-24 w-full rounded-lg overflow-hidden">
                    <Image
                      src={productImage.value.toString()}
                      alt={`${product.name} preview`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Digital Features */}
                <div className="space-y-1">
                  <h4 className="font-medium text-xs text-gray-900">Digital Features</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <QrCode className="w-3 h-3 text-cyan-500" />
                      <span>QR code payments</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-3 h-3 text-green-500" />
                      <span>Digital wallet integration</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-3 h-3 text-orange-500" />
                      <span>Advanced security</span>
                    </div>
                  </div>
                </div>

                {/* App Features */}
                <div className="p-2 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                  <h5 className="font-medium text-xs text-gray-900 mb-2">Available Features</h5>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>P2P transfers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Bill payments</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Expense tracking</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Budgeting tools</span>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium text-gray-700">Platform</span>
                      <p className="font-semibold text-gray-900">iOS & Android</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Availability</span>
                      <p className="font-semibold text-gray-900">24/7</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-2 bg-cyan-50 rounded-lg">
                  <p className="text-xs text-cyan-800 leading-relaxed">
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
            onClick={() => onGetStarted?.(product.id)}
            className="flex-1 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 text-xs"
          >
            Get Started
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
