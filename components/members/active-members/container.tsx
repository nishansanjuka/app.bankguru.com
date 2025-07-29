"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loading from "@/app/loading";
import { columns, UserData } from "./columns";
import { ReFetchButton } from "@/components/shared/re-fetch-button";
import { getOrganizationMembers } from "@/lib/actions/organizations";
import { DataTable } from "@/components/shared/data-table/data-table";
import PageHeader from "@/components/shared/page-header";

export default function MembersContainer() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const {
    data: membersResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["members", page, pageSize],
    queryFn: () => getOrganizationMembers(page, pageSize),
    staleTime: 1000 * 60 * 5, // 5 minutes
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

  if (error || !membersResponse?.success) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {!membersResponse?.success || "Failed to load members"}
        </AlertDescription>
      </Alert>
    );
  }

  const members = membersResponse.data.data;

  return (
    <div className="px-4 lg:px-6">
      <div className="relative flex flex-col gap-4">
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <Loading />
          </div>
        )}
        {members.length > 0 ? (
          <DataTable<UserData>
            data={members}
            columns={columns}
            pageCount={membersResponse.data.pagination.totalPages}
            pageSize={pageSize}
            pageIndex={page - 1}
            onPageChange={setPage}
            header={
              <div className="flex-1">
                <PageHeader
                  title={`Members (${membersResponse.data.pagination.total})`}
                  description="Manage your organization members, view their roles and status"
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
            onPageSizeChange={setPageSize}
            manualPagination={true}
            searchKey="fullName"
            pagination={true}
            toolbar={true}
            facetedFilters={[
              {
                key: "role",
                title: "Role",
              },
            ]}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="rounded-full bg-muted p-4">
              <svg
                className="h-8 w-8 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">No members found</h3>
            <p className="text-sm text-muted-foreground">
              Your organization currently has no members.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
