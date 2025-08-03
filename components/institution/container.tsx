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
import {
  getOrganizationDetails,
  OrganizationRes,
} from "@/lib/actions/organizations";

export default function InstitutionsContainer() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const {
    data: organizations,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const res = await getOrganizationDetails();
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch organizations");
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

  if (error || !organizations) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{"Failed to load organizations"}</AlertDescription>
      </Alert>
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
        {organizations.length > 0 ? (
          <DataTable<OrganizationRes>
            data={organizations}
            columns={columns}
            customColumnFilters={columnFilters}
            onCustomColumnFiltersChange={setColumnFilters}
            header={
              <div className="flex-1">
                <PageHeader
                  title={`Institution Types`}
                  description="Manage Institution Types"
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
