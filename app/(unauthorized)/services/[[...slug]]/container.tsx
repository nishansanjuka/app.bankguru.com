"use client";

import { Product } from "@/types/product";
import { FC, useState } from "react";
import { Filters } from "./filters";
import { ProductGrid } from "@/components/products/product-grid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  Filter,
  Bookmark,
} from "lucide-react";
import { SheetContainer } from "@/components/shared/sheet-container";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { saveProduct, unsaveProduct } from "@/lib/actions/products/save";
import Link from "next/link";

export const Container: FC<{ catId: string }> = ({ catId }) => {
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleProductAction = async (action: string, productId: string) => {
    switch (action) {
      case "view_details":
        // "View Full Details" button - go to full product page
        await new Promise((resolve) => setTimeout(resolve, 300));
        window.location.href = `/services/shares/product/${productId}?viewDetails=true`;
        break;
      case "apply":
        // Handle apply action
        console.log("Apply for product:", productId);
        break;
      case "compare":
        // Handle compare action
        console.log("Compare product:", productId);
        break;
      case "ask_guru":
        // Handle ask guru action
        console.log("Ask guru about product:", productId);
        break;
      case "save":
        // Handle save product action
        try {
          console.log("Saving product:", productId);
          const result = await saveProduct(productId);
          if (!result.success) {
            throw new Error(result.message || "Failed to save product");
          }
        } catch (error) {
          console.error("Error saving product:", error);
          throw error; // Let SaveProduct component handle the error
        }
        break;
      case "unsave":
        // Handle unsave product action
        try {
          console.log("Unsaving product:", productId);
          const result = await unsaveProduct(productId);
          if (!result.success) {
            throw new Error(result.message || "Failed to unsave product");
          }
        } catch (error) {
          console.error("Error unsaving product:", error);
          throw error; // Let SaveProduct component handle the error
        }
        break;

      default:
        // Default product interaction - show modal via query params
        router.push(`/services/shares?catId=${catId}&id=${productId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Page Header */}
      <div className="border-b border-gray-200 sticky top-[65px] z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Products
              </h1>
              <p className="text-gray-600 mt-1">
                Compare and find the perfect product for your needs
              </p>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-3">
              {/* Results Count */}
              {filteredData.length > 0 && (
                <Badge variant="secondary" className="hidden sm:flex">
                  {filteredData.length} products found
                </Badge>
              )}

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 gap-2 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filter Toggle */}
              {isMobile ? (
                <div className="w-full flex justify-end">
                  <SheetContainer
                    title="Filter Products"
                    triggerText=""
                    triggerIcon={<Filter className="h-4 w-4" />}
                    isOpen={showFiltersSheet}
                    onOpenChange={setShowFiltersSheet}
                    side="left"
                    size={"icon"}
                  >
                    <Filters setFilteredData={setFilteredData} catId={catId} />
                  </SheetContainer>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 sm:gap-8">
          {/* Filters Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="lg:col-span-3">
              <div className="sticky top-52">
                <Card className="p-6 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                    <h2 className="font-semibold text-gray-900">Filters</h2>
                  </div>
                  <Filters setFilteredData={setFilteredData} catId={catId} />
                </Card>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div
            className={`${
              !isMobile ? "lg:col-span-9" : "col-span-12"
            } transition-all duration-300`}
          >
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Available Products
                </h3>
                <Badge variant="outline" className="sm:hidden">
                  {filteredData.length} results
                </Badge>
              </div>

              {/* Quick Actions */}
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="outline">
                  <Bookmark className="size-4" />
                  <Link href="/saved-products">Saved Products</Link>
                </Button>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className="space-y-6">
              {filteredData.length === 0 ? (
                <Card className="p-12 text-center bg-white/60 backdrop-blur-sm border-dashed">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SlidersHorizontal className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your filters to see more loan products.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        /* Reset filters logic */
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </Card>
              ) : (
                <ProductGrid
                  products={filteredData}
                  variant={viewMode === "grid" ? "compact" : "detailed"}
                  className={
                    viewMode === "grid"
                      ? "grid-cols-1 xl:grid-cols-2"
                      : "grid-cols-1"
                  }
                  onProductAction={handleProductAction}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
