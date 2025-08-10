"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useGuruBotTrigger } from "@/hooks/use-gurubot-trigger";
import { Product } from "@/types/product";
import {
  Building2,
  Star,
  X,
  DollarSign,
  Users,
  FileText,
  Percent,
  Calendar,
  MessageCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface ProductComparisonViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onRemoveProduct?: (productId: string) => void;
  onProductAction?: (action: string, productId: string) => void;
}

export function ProductComparisonView({
  open,
  onOpenChange,
  products,
  onRemoveProduct,
}: ProductComparisonViewProps) {
  const { askForProductComparison, isLoading: isBotLoading } = useGuruBotTrigger();
  
  if (products.length === 0) return null;

  const handleGetAdvice = async () => {
    const productIds = products.map(p => p.id);
    await askForProductComparison(productIds);
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

  const getProductImage = (product: Product) => {
    return product.details.additionalInfo.find(
      (info) => info.id === "product-image"
    );
  };

  const getProductUrl = (product: Product) => {
    return product.details.additionalInfo.find(
      (info) => info.id === "product-url"
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[50vw] max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-900">Product Comparison</h2>
              <Badge variant="secondary" className="text-xs px-2 py-1">
                {products.length} products
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs px-2 py-1 text-gray-600">
              {products[0]?.productType?.name}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="p-6 pt-4">
            {/* Product Grid Layout */}
            <div className="grid gap-3" style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}>
              
              {/* Header Row - Product Cards */}
              <div></div> {/* Empty cell for labels column */}
              {products.map((product) => {
                const productImage = getProductImage(product);
                const productUrl = getProductUrl(product);

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 relative hover:shadow-sm transition-shadow"
                  >
                    {/* Remove Button */}
                    {onRemoveProduct && products.length > 1 && (
                      <Button
                        onClick={() => onRemoveProduct(product.id)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}

                    {/* Institution Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden border">
                        {product.institution?.logoUrl ? (
                          <Image
                            src={product.institution.logoUrl}
                            alt={product.institution?.name || "Institution"}
                            width={16}
                            height={16}
                            className="object-contain"
                          />
                        ) : (
                          <Building2 className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 font-medium truncate">
                          {product.institution?.name}
                        </p>
                      </div>
                      {product.isFeatured && (
                        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs h-5 px-1.5">
                          <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                          Hot
                        </Badge>
                      )}
                    </div>

                    {/* Product Image - Compact */}
                    {productImage && (
                      <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded-md border">
                        <div className="relative w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={productImage.value.toString()}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600">Product image</p>
                        </div>
                      </div>
                    )}

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight mb-3">
                      {product.name}
                    </h3>

                    {/* Explore Button */}
                    {productUrl && (
                      <Button
                        onClick={() => window.open(productUrl.value.toString(), "_blank")}
                        variant="outline"
                        size="sm"
                        className="w-full h-8 text-xs border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Explore
                      </Button>
                    )}
                  </div>
                );
              })}

              {/* Comparison Rows */}
              
              {/* Basic Information Section */}
              <div className="col-span-full mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
                </div>
              </div>
              
              {/* Fees Row */}
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium text-gray-700 text-sm">Processing Fees</span>
              </div>
              {products.map((product) => (
                <div key={`${product.id}-fees`} className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm font-semibold text-green-700">
                    {formatFees(product.details.fees)}
                  </div>
                </div>
              ))}

              {/* Eligibility Row */}
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-700 text-sm">Min. Age Required</span>
              </div>
              {products.map((product) => (
                <div key={`${product.id}-eligibility`} className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-700">
                    {formatEligibility(product.details.eligibility)}
                  </div>
                </div>
              ))}

              {/* Terms Row */}
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-700 text-sm">Terms & Conditions</span>
              </div>
              {products.map((product) => (
                <div key={`${product.id}-terms`} className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-700">
                    {product.details.terms && product.details.terms !== "no terms"
                      ? product.details.terms
                      : "Standard terms apply"}
                  </div>
                </div>
              ))}

              {/* Description Row */}
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700 text-sm">Product Overview</span>
              </div>
              {products.map((product) => (
                <div key={`${product.id}-description`} className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {product.details.description}
                  </div>
                </div>
              ))}

              {/* Additional Features Section */}
              {products.some((p) =>
                p.details.additionalInfo.some((info) => info.type !== "image" && info.id !== "product-url")
              ) && (
                <>
                  <div className="col-span-full mt-6">
                    <Separator className="mb-4 bg-gray-200" />
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                      <h3 className="text-sm font-semibold text-gray-900">Additional Features</h3>
                    </div>
                  </div>

                  {/* Get all unique additional info fields */}
                  {Array.from(
                    new Set(
                      products.flatMap((p) =>
                        p.details.additionalInfo
                          .filter((info) => info.type !== "image" && info.id !== "product-url")
                          .map((info) => info.label)
                      )
                    )
                  ).map((label) => {
                    // Get the first occurrence to determine the icon type
                    const sampleInfo = products
                      .flatMap((p) => p.details.additionalInfo)
                      .find((info) => info.label === label);

                    return (
                      <React.Fragment key={label}>
                        {/* Feature Label */}
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                          {sampleInfo?.type === "percentage" ? (
                            <Percent className="w-4 h-4 text-blue-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="font-medium text-gray-700 text-sm">{label}</span>
                        </div>
                        
                        {/* Feature Values */}
                        {products.map((product) => {
                          const info = product.details.additionalInfo.find(
                            (i) => i.label === label
                          );
                          return (
                            <div key={`${product.id}-${label}`} className="p-3 bg-white border border-gray-200 rounded-lg">
                              {info ? (
                                <div className="text-sm">
                                  {info.type === "percentage" ? (
                                    <span className="font-semibold text-blue-700">
                                      {info.value}%
                                    </span>
                                  ) : (
                                    <span className="text-gray-700 font-medium">
                                      {info.value.toString()}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">N/A</span>
                              )}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-gray-300 hover:bg-gray-100"
              >
                Close Comparison
              </Button>
              <Button
                onClick={handleGetAdvice}
                disabled={isBotLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                {isBotLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Getting Expert Advice...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Get Expert Advice
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {products.length} {products[0]?.productType?.name} products compared
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
