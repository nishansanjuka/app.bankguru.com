"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/actions/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/product";

export function FeaturedProductsSection() {
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["featured-products", { limit: 3, isFeatured: true }],
    queryFn: () => getProducts({ limit: 3, isFeatured: true }),
  });

  const products = productsResponse?.success ? productsResponse.data : [];

  if (isLoading) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Featured Financial Products
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our top recommended financial products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getProductBadge = (product: Product) => {
    if (product.isFeatured)
      return { text: "Featured", className: "bg-orange-500 text-white" };
    if (product.isActive)
      return { text: "Available", className: "bg-green-500 text-white" };
    return { text: "New", className: "bg-blue-500 text-white" };
  };

  const formatProductDescription = (product: Product) => {
    return (
      product.details?.description ||
      `Discover the benefits of our ${product.name} with competitive rates and flexible terms.`
    );
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Featured Financial Products
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our top recommended financial products with competitive
            rates and benefits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: Product) => {
            const badge = getProductBadge(product);
            return (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-all duration-300 p-0"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={
                      (product.details.additionalInfo.filter(
                        (info) => info.id === "product-image"
                      )[0]?.value as string) || ""
                    }
                    alt={product.name}
                    width={800}
                    height={800}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className={`absolute top-3 left-3 ${badge.className}`}>
                    {badge.text}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {formatProductDescription(product)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="size-4" />
                      {product.productType?.name || "Financial Product"}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
