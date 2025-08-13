"use client";

import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  Calendar, 
  Building2, 
  Star,
  BarChart3
} from "lucide-react";

interface SavedProduct {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    productType?: {
      name: string;
    };
    institution?: {
      name: string;
    };
    isFeatured: boolean;
  };
}

interface SavedProductsStatsProps {
  products: SavedProduct[];
}

export function SavedProductsStats({ products }: SavedProductsStatsProps) {
  // Calculate stats
  const totalProducts = products.length;
  const featuredCount = products.filter(item => item.product?.isFeatured).length;
  
  // Get unique institutions
  const uniqueInstitutions = new Set(
    products
      .map(item => item.product?.institution?.name)
      .filter(name => name)
  ).size;

  // Get unique product types
  const uniqueProductTypes = new Set(
    products
      .map(item => item.product?.productType?.name)
      .filter(name => name)
  ).size;

  // Get most recent save date
  const mostRecentSave = products.length > 0 
    ? new Date(Math.max(...products.map(item => new Date(item.createdAt).getTime())))
    : null;

  if (totalProducts === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {/* Total Products */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Total Saved</p>
            <p className="text-2xl font-bold text-blue-900">{totalProducts}</p>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
        </div>
      </Card>

      {/* Featured Products */}
      <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-600 text-sm font-medium">Featured</p>
            <p className="text-2xl font-bold text-amber-900">{featuredCount}</p>
          </div>
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
        </div>
      </Card>

      {/* Unique Institutions */}
      <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium">Institutions</p>
            <p className="text-2xl font-bold text-green-900">{uniqueInstitutions}</p>
          </div>
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
        </div>
      </Card>

      {/* Product Types */}
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 text-sm font-medium">Categories</p>
            <p className="text-2xl font-bold text-purple-900">{uniqueProductTypes}</p>
          </div>
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        </div>
      </Card>

      {/* Last Saved - Full Width */}
      {mostRecentSave && (
        <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 col-span-2 md:col-span-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Last Saved</p>
              <p className="text-lg font-semibold text-gray-900">
                {mostRecentSave.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
