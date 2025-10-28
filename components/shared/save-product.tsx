"use client";

import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Product } from "@/types/product";
import {
  isProductSaved,
  saveProduct,
  unsaveProduct,
} from "@/lib/actions/products/save";

interface SaveProductProps {
  product: Product;
  triggerIcon?: ReactNode;
  triggerText?: string;
  className?: string;
  onSave?: (productId: string) => void | Promise<void>;
  onUnsave?: (productId: string) => void | Promise<void>;
}

export function SaveProduct({
  product,
  triggerIcon,
  triggerText,
  className,
  onSave,
  onUnsave,
}: SaveProductProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Check initial saved status
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        setIsCheckingStatus(true);
        const result = await isProductSaved(product.id);
        if (result.success) {
          setIsSaved(result.isSaved || false);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkSavedStatus();
  }, [product.id]);

  const handleSaveToggle = async () => {
    setIsLoading(true);

    try {
      if (isSaved) {
        // Unsave product
        const result = await unsaveProduct(product.id);
        if (result.success) {
          setIsSaved(false);
          toast.success(result.message || "Product removed from saved items");
          await onUnsave?.(product.id);
        } else {
          toast.error(result.message || "Failed to remove product");
        }
      } else {
        // Save product
        const result = await saveProduct(product.id);
        if (result.success) {
          setIsSaved(true);
          toast.success(result.message || "Product saved successfully");
          await onSave?.(product.id);
        } else {
          toast.error(result.message || "Failed to save product");
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
      console.error("Save/Unsave error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking initial status
  if (isCheckingStatus) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className={className}
        title="Checking save status..."
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        {triggerText && <span className="ml-2">{triggerText}</span>}
      </Button>
    );
  }

  const iconToShow =
    triggerIcon ||
    (isLoading ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : isSaved ? (
      <BookmarkCheck className="w-4 h-4" />
    ) : (
      <Bookmark className="w-4 h-4" />
    ));

  return (
    <Button
      onClick={handleSaveToggle}
      variant="ghost"
      size="sm"
      disabled={isLoading || isCheckingStatus}
      className={className}
      title={
        isLoading
          ? "Processing..."
          : isSaved
          ? "Remove from saved"
          : "Save product"
      }
    >
      {iconToShow}
      {triggerText && <span className="ml-2">{triggerText}</span>}
    </Button>
  );
}
