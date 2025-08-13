import { Suspense } from "react";
import { Metadata } from "next";
import { SavedProductsSkeleton } from "./components/saved-products-skeleton";
import { SavedProductsContainer } from "./components/saved-products-container";

export const metadata: Metadata = {
  title: "Saved Products | BankGuru",
  description: "View and manage your saved financial products",
};

export default function SavedProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-28 mt-10">
      <Suspense fallback={<SavedProductsSkeleton />}>
        <SavedProductsContainer />
      </Suspense>
    </div>
  );
}
