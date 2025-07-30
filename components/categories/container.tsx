"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
import { columns } from "./columns";
import { ColumnFiltersState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table/data-table";
import PageHeader from "@/components/shared/page-header";
import { ReFetchButton } from "@/components/shared/re-fetch-button";
import { getCategories } from "@/lib/actions/products/categories";
import { ProductCategory } from "@/types/product-category";

export default function CategoriesContainer() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const {
    data: Categories,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch categories");
      }
      return res.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6 w-full">
      <div className="relative flex flex-col gap-4">
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <Loading />
          </div>
        )}
        {Categories && Categories.length > 0 ? (
          <DataTable<ProductCategory>
            data={Categories}
            columns={columns}
            customColumnFilters={columnFilters}
            onCustomColumnFiltersChange={setColumnFilters}
            header={
              <div className="flex-1">
                <PageHeader
                  title={`Category Types`}
                  description="Manage Category Types"
                />
              </div>
            }
            actionButtons={
              <div className="flex sm:block w-full sm:w-auto justify-end">
                <ReFetchButton
                  isLoading={isLoading || isFetching}
                  refetch={async () => {
                    await refetch();
                  }}
                />
              </div>
            }
            manualPagination={false}
            searchPlaceholder="Search by type name..."
            searchKey="name"
            pagination={true}
            toolbar={true}
          />
        ) : (
          <div className="flex h-96 items-center justify-center text-muted-foreground">
            No institution types found
          </div>
        )}
      </div>
    </div>
  );
}
