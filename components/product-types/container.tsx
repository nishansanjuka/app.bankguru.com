"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loading from "@/app/loading";
import { columns } from "./columns";
import { ColumnFiltersState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table/data-table";
import PageHeader from "@/components/shared/page-header";
import { ReFetchButton } from "@/components/shared/re-fetch-button";
import { getProductTypes } from "@/lib/actions/products/types";
import { ProductType } from "@/types/product-type";

export default function ProductTypesContainer() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const {
    data: productTypesResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product-types"],
    queryFn: () => getProductTypes(),
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

  if (error || !productTypesResponse?.success) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {!productTypesResponse?.success || "Failed to load product types"}
        </AlertDescription>
      </Alert>
    );
  }

  const ProductTypess = productTypesResponse.data;

  return (
    <div className="px-4 lg:px-6 w-full">
      <div className="relative flex flex-col gap-4">
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <Loading />
          </div>
        )}
        {ProductTypess.length > 0 ? (
          <DataTable<ProductType>
            data={ProductTypess}
            columns={columns}
            customColumnFilters={columnFilters}
            onCustomColumnFiltersChange={setColumnFilters}
            header={
              <div className="flex-1">
                <PageHeader
                  title={`Product Types`}
                  description="Manage Product Types"
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
            No product types found
          </div>
        )}
      </div>
    </div>
  );
}
