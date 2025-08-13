"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bookmark, RefreshCw, ArrowRight, Heart } from "lucide-react";

interface EmptyStateProps {
  onRefresh: () => void;
}

export function EmptyState({ onRefresh }: EmptyStateProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-orange-500" />
          Saved Products
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your saved financial products and compare your favorites
        </p>
      </div>

      {/* Empty State */}
      <Card className="max-w-2xl mx-auto p-12 text-center bg-white/60 backdrop-blur-sm border-dashed">
        <div className="relative mb-8">
          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-orange-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-100 rounded-full opacity-30"></div>
          
          {/* Main Icon */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-12 h-12 text-orange-500" />
            <Heart className="w-6 h-6 text-red-400 absolute -top-1 -right-1" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          No Saved Products Yet
        </h3>
        
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Start building your wishlist by saving products that catch your interest. 
          You can save products from any product listing page using the bookmark button.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => window.location.href = '/services'}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Browse Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={onRefresh}
            className="px-6 py-3 rounded-lg font-medium border-2 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">💡</span>
            </div>
            <div className="text-left">
              <h4 className="font-medium text-blue-900 mb-1">How to save products</h4>
              <p className="text-blue-700 text-sm">
                Look for the bookmark icon on any product card and click it to add the product to your saved list. 
                You can then compare, share, and manage all your favorite products from this page.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
