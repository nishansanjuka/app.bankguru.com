"use client";

import { useState, useCallback } from "react";
import { Product } from "@/types/product";
import { getProducts } from "@/lib/actions/products";
import { useQuery } from "@tanstack/react-query";

interface UseProductComparisonReturn {
  // Dialog state
  isComparisonDialogOpen: boolean;
  openComparisonDialog: (product: Product) => void;
  closeComparisonDialog: () => void;
  
  // View state
  isComparisonViewOpen: boolean;
  openComparisonView: (products: Product[]) => void;
  closeComparisonView: () => void;
  
  // Products
  currentProduct: Product | null;
  availableProducts: Product[];
  selectedProducts: Product[];
  
  // Loading
  isLoading: boolean;
  
  // Actions
  removeProductFromComparison: (productId: string) => void;
  handleCompareSelected: (products: Product[]) => void;
}

export function useProductComparison(): UseProductComparisonReturn {
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);
  const [isComparisonViewOpen, setIsComparisonViewOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Fetch available products for comparison based on current product type
  const { data: availableProducts = [], isLoading } = useQuery({
    queryKey: ["products-for-comparison", currentProduct?.productType?.id],
    queryFn: async () => {
      if (!currentProduct?.productType?.id) return [];
      
      const response = await getProducts({
        productTypeId: currentProduct.productType.id,
        isActive: true,
        limit: 50, // Get more products for comparison
      });
      
      if (response.success) {
        return response.data;
      }
      return [];
    },
    enabled: !!currentProduct?.productType?.id && isComparisonDialogOpen,
  });

  const openComparisonDialog = useCallback((product: Product) => {
    setCurrentProduct(product);
    setIsComparisonDialogOpen(true);
  }, []);

  const closeComparisonDialog = useCallback(() => {
    setIsComparisonDialogOpen(false);
    setCurrentProduct(null);
  }, []);

  const openComparisonView = useCallback((products: Product[]) => {
    setSelectedProducts(products);
    setIsComparisonViewOpen(true);
  }, []);

  const closeComparisonView = useCallback(() => {
    setIsComparisonViewOpen(false);
    setSelectedProducts([]);
  }, []);

  const removeProductFromComparison = useCallback((productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const handleCompareSelected = useCallback((products: Product[]) => {
    closeComparisonDialog();
    openComparisonView(products);
  }, [closeComparisonDialog, openComparisonView]);

  return {
    isComparisonDialogOpen,
    openComparisonDialog,
    closeComparisonDialog,
    isComparisonViewOpen,
    openComparisonView,
    closeComparisonView,
    currentProduct,
    availableProducts,
    selectedProducts,
    isLoading,
    removeProductFromComparison,
    handleCompareSelected,
  };
}
