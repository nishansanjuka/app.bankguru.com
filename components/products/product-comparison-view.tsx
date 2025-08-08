"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/product";
import { 
  Building2, 
  Star, 
  X, 
  ArrowRight, 
  DollarSign, 
  Users, 
  FileText,
  Percent,
  Calendar,
  ExternalLink
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
  onProductAction,
}: ProductComparisonViewProps) {
  if (products.length === 0) return null;

  const getInstitutionLogo = (product: Product) => {
    return product.details.additionalInfo.find(
      (info) => info.type === "image" && info.label.toLowerCase().includes("logo")
    );
  };

  const getProductImage = (product: Product) => {
    return product.details.additionalInfo.find(
      (info) => info.type === "image" && !info.label.toLowerCase().includes("logo")
    );
  };

  const renderComparisonRow = (label: string, getValue: (product: Product) => string | React.ReactNode, icon?: React.ReactNode) => (
    <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
        {icon}
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      {products.map((product) => (
        <div key={product.id} className="p-3 bg-white border rounded-lg">
          {getValue(product)}
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Product Comparison ({products.length} products)</span>
            <Badge variant="secondary">
              {products[0]?.productType?.name}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[80vh] px-6">
          <div className="space-y-6 pb-6">
            {/* Product Headers */}
            <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
              <div className="p-3"></div> {/* Empty space for labels column */}
              {products.map((product) => {
                const logo = getInstitutionLogo(product);
                const productImage = getProductImage(product);
                
                return (
                  <div key={product.id} className="relative bg-white border rounded-xl p-4 shadow-sm">
                    {onRemoveProduct && products.length > 1 && (
                      <Button
                        onClick={() => onRemoveProduct(product.id)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {/* Institution Logo */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {logo ? (
                          <Image
                            src={logo.value.toString()}
                            alt={product.institution?.name || "Institution"}
                            width={24}
                            height={24}
                            className="rounded"
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">
                          {product.institution?.name}
                        </p>
                        {product.isFeatured && (
                          <Badge className="bg-orange-100 text-orange-700 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Product Image */}
                    {productImage && (
                      <div className="relative w-full h-24 mb-3 rounded-lg overflow-hidden bg-gray-50">
                        <Image
                          src={productImage.value.toString()}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => onProductAction?.("apply", product.id)}
                        size="sm"
                        className="w-full bg-orange-500 hover:bg-orange-600"
                      >
                        Apply Now
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                      <Button
                        onClick={() => onProductAction?.("view_details", product.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        View Details
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Comparison Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
              
              {renderComparisonRow(
                "Fees",
                (product) => (
                  <div className="text-sm">
                    <span className="font-semibold text-green-600">{product.details.fees}</span>
                  </div>
                ),
                <DollarSign className="w-4 h-4 text-green-600" />
              )}

              {renderComparisonRow(
                "Eligibility",
                (product) => (
                  <div className="text-sm text-gray-700">
                    {product.details.eligibility}
                  </div>
                ),
                <Users className="w-4 h-4 text-blue-600" />
              )}

              {renderComparisonRow(
                "Terms",
                (product) => (
                  <div className="text-sm text-gray-700">
                    {product.details.terms && product.details.terms !== "no terms" 
                      ? product.details.terms 
                      : "No specific terms"
                    }
                  </div>
                ),
                <Calendar className="w-4 h-4 text-purple-600" />
              )}

              {renderComparisonRow(
                "Description",
                (product) => (
                  <div className="text-sm text-gray-700 line-clamp-3">
                    {product.details.description}
                  </div>
                ),
                <FileText className="w-4 h-4 text-gray-600" />
              )}

              {/* Additional Information */}
              {products.some(p => p.details.additionalInfo.some(info => info.type !== "image")) && (
                <>
                  <Separator />
                  <h3 className="text-lg font-semibold text-gray-900">Additional Features</h3>
                  
                  {/* Get all unique additional info fields */}
                  {Array.from(
                    new Set(
                      products.flatMap(p => 
                        p.details.additionalInfo
                          .filter(info => info.type !== "image")
                          .map(info => info.label)
                      )
                    )
                  ).map(label => {
                    // Get the first occurrence to determine the icon type
                    const sampleInfo = products
                      .flatMap(p => p.details.additionalInfo)
                      .find(info => info.label === label);
                    
                    return (
                      <div key={label}>
                        {renderComparisonRow(
                          label,
                          (product) => {
                            const info = product.details.additionalInfo.find(i => i.label === label);
                            if (!info) return <span className="text-gray-400">N/A</span>;
                            
                            return (
                              <div className="text-sm">
                                {info.type === "percentage" ? (
                                  <span className="font-semibold text-blue-600">
                                    {info.value}%
                                  </span>
                                ) : (
                                  <span className="text-gray-700">
                                    {info.value.toString()}
                                  </span>
                                )}
                              </div>
                            );
                          },
                          sampleInfo?.type === "percentage" ? 
                            <Percent className="w-4 h-4 text-blue-600" /> : 
                            <FileText className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close Comparison
            </Button>
            <div className="text-sm text-gray-600">
              Comparing {products.length} {products[0]?.productType?.name} products
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
