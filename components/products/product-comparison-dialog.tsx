"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/index";
import { Product } from "@/types/product";
import { Building2, Star, ArrowRight } from "lucide-react";
import Image from "next/image";

interface ProductComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableProducts: Product[];
  currentProduct: Product;
  onCompareSelected: (products: Product[]) => void;
  isLoading?: boolean;
}

export function ProductComparisonDialog({
  open,
  onOpenChange,
  availableProducts,
  currentProduct,
  onCompareSelected,
  isLoading = false,
}: ProductComparisonDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([
    currentProduct,
  ]);

  const handleProductSelect = (product: Product, checked: boolean) => {
    if (checked) {
      if (selectedProducts.length < 4) {
        setSelectedProducts([...selectedProducts, product]);
      }
    } else {
      setSelectedProducts(
        selectedProducts.filter((p) => p.id !== product.id)
      );
    }
  };

  const handleCompare = () => {
    onCompareSelected(selectedProducts);
    onOpenChange(false);
  };

  const isSelected = (productId: string) =>
    selectedProducts.some((p) => p.id === productId);

  const filteredProducts = availableProducts.filter(
    (product) => 
      product.id !== currentProduct.id && 
      product.productType?.code === currentProduct.productType?.code
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl lg:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Compare Products</DialogTitle>
          <DialogDescription>
            Select up to 3 additional {currentProduct.productType?.name} products to compare with {currentProduct.name}.
            You can compare products from different institutions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Product */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox checked disabled />
              <Badge variant="secondary">Currently Selected</Badge>
            </div>
            <ProductComparisonItem product={currentProduct} disabled />
          </div>

          <Separator />

          {/* Selection Counter */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Available {currentProduct.productType?.name} Products
            </h3>
            <Badge variant="outline">
              {selectedProducts.length}/4 selected
            </Badge>
          </div>

          {/* Available Products */}
          <ScrollArea className="h-[30vh]">
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No other {currentProduct.productType?.name} products available for comparison.
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-200",
                      isSelected(product.id)
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={isSelected(product.id)}
                        onCheckedChange={(checked) =>
                          handleProductSelect(product, checked as boolean)
                        }
                        disabled={
                          selectedProducts.length >= 4 &&
                          !isSelected(product.id)
                        }
                      />
                      <div className="flex-1">
                        <ProductComparisonItem product={product} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCompare}
              disabled={selectedProducts.length < 2}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Compare {selectedProducts.length} Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ProductComparisonItemProps {
  product: Product;
  disabled?: boolean;
}

function ProductComparisonItem({ product, disabled }: ProductComparisonItemProps) {
  const institutionLogo = product.details.additionalInfo.find(
    (info) => info.type === "image" && info.label.toLowerCase().includes("logo")
  );

  return (
    <div className={cn("flex items-center space-x-4", disabled && "opacity-75")}>
      {/* Institution Logo */}
      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        {institutionLogo ? (
          <Image
            src={institutionLogo.value.toString()}
            alt={product.institution?.name || "Institution"}
            width={32}
            height={32}
            className="rounded-lg"
          />
        ) : (
          <Building2 className="w-6 h-6 text-gray-500" />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-gray-900 truncate">
            {product.name}
          </h4>
          {product.isFeatured && (
            <Star className="w-4 h-4 text-orange-500 fill-current" />
          )}
        </div>
        <p className="text-sm text-gray-600 truncate">
          {product.institution?.name}
        </p>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-xs text-gray-500">
            Fees: {product.details.fees}
          </span>
          <span className="text-xs text-gray-500">
            Eligibility: {product.details.eligibility}
          </span>
        </div>
      </div>
    </div>
  );
}
