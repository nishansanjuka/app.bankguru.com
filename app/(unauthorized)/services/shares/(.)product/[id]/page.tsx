"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { ProductRenderer } from "@/components/products/product-renderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getProductById } from "@/lib/actions/products";

export default function InterceptedProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState<string>("");

  const catId = searchParams.get("catId");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!productId || !catId) {
      router.back();
      return;
    }

    // Fetch the specific product
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(productId);
        if (!response.success) {
          throw new Error(response.error || "Product not found");
        }
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, catId, router]);

  const handleClose = () => {
    window.location.reload();
  };

  const handleOpenInNewTab = () => {
    // Open the product in a new tab for full page view
    window.open(
      `/services/shares/product/${productId}?catId=${catId}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-md mx-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading product...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="font-semibold text-gray-900">Product Details</h2>
                <p className="text-xs text-gray-600">Quick view</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="h-8"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open
            </Button>
          </div>
        </div>

        {/* Product Content */}
        <div className="p-6">
          <ProductRenderer
            product={product}
            variant="detailed"
            className="max-w-none mx-0"
            onProductAction={(action, id) => {
              // Handle product actions
              console.log(`${action} action for product:`, id);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
