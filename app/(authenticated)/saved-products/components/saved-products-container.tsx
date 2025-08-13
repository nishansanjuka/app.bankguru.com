"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { getSavedProducts } from "@/lib/actions/products/save";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Bookmark,
  Calendar,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { ProductGrid } from "@/components/products/product-grid";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "./empty-state";
import { SavedProductsStats } from "./saved-products-stats";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";
type ViewMode = "grid" | "list";

interface SavedProductItem {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export function SavedProductsContainer() {
  const [savedProducts, setSavedProducts] = useState<SavedProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const fetchSavedProducts = async () => {
    try {
      setIsLoading(true);
      const result = await getSavedProducts();

      if (result.success && Array.isArray(result.data)) {
        setSavedProducts(result.data as SavedProductItem[]);
        // Extract products for the grid display
        const products = result.data
          .map((item: SavedProductItem) => item.product)
          .filter((product): product is Product => product !== undefined);
        setFilteredProducts(products);
      } else {
        toast.error(result.message || "Failed to load saved products");
        setSavedProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error fetching saved products:", error);
      toast.error("Failed to load saved products");
      setSavedProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = savedProducts
      .map((item) => item.product)
      .filter((product): product is Product => product !== undefined);

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.institution?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.productType?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          const aItem = savedProducts.find((item) => item.product?.id === a.id);
          const bItem = savedProducts.find((item) => item.product?.id === b.id);
          return (
            new Date(bItem?.createdAt || 0).getTime() -
            new Date(aItem?.createdAt || 0).getTime()
          );
        case "oldest":
          const aItemOld = savedProducts.find(
            (item) => item.product?.id === a.id
          );
          const bItemOld = savedProducts.find(
            (item) => item.product?.id === b.id
          );
          return (
            new Date(aItemOld?.createdAt || 0).getTime() -
            new Date(bItemOld?.createdAt || 0).getTime()
          );
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [savedProducts, searchQuery, sortBy]);

  const handleProductAction = async (action: string, productId: string) => {
    switch (action) {
      case "view_details":
        // Navigate to product details
        window.location.href = `/services/shares/product/${productId}?viewDetails=true`;
        break;
      case "unsave":
        // Remove from saved products
        setSavedProducts((prev) =>
          prev.filter((item) => item.product?.id !== productId)
        );
        toast.success("Product removed from saved items");
        break;
      case "compare":
        // Handle comparison
        console.log("Compare product:", productId);
        break;
      default:
        console.log("Unknown action:", action, productId);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    // TODO: Implement bulk delete API call
    setSavedProducts((prev) =>
      prev.filter((item) => !selectedProducts.includes(item.product?.id || ""))
    );
    setSelectedProducts([]);
    toast.success(
      `${selectedProducts.length} products removed from saved items`
    );
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "name-asc":
        return "Name A-Z";
      case "name-desc":
        return "Name Z-A";
      default:
        return "Sort";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (savedProducts.length === 0) {
    return <EmptyState onRefresh={fetchSavedProducts} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-orange-500" />
              Saved Products
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your saved financial products and compare your favorites
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSavedProducts}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>

            {selectedProducts.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedProducts.length})
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <SavedProductsStats products={savedProducts} />
      </div>

      {/* Controls */}
      <div className="mb-6">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search saved products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <SortAsc className="w-4 h-4" />
                    {getSortLabel(sortBy)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-asc")}>
                    <SortAsc className="w-4 h-4 mr-2" />
                    Name A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
                    <SortDesc className="w-4 h-4 mr-2" />
                    Name Z-A
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
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
            </div>
          </div>
        </Card>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-gray-900">
            Your Saved Products
          </h3>
          <Badge variant="secondary">
            {filteredProducts.length} of {savedProducts.length} products
          </Badge>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search query to find the products you&apos;re
              looking for.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        </Card>
      ) : (
        <ProductGrid
          products={filteredProducts}
          variant={viewMode === "grid" ? "compact" : "detailed"}
          className={
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }
          onProductAction={handleProductAction}
        />
      )}
    </div>
  );
}
