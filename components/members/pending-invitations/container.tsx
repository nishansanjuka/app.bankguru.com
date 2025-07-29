"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loading from "@/app/loading";
import { columns, InvitationData } from "./columns";
import { ColumnFiltersState } from "@tanstack/react-table";
import { OrgRole } from "@/types/auth";
import { getOrganizationInvitations } from "@/lib/actions/invitations";
import { DataTable } from "@/components/shared/data-table/data-table";
import PageHeader from "@/components/shared/page-header";
import { ReFetchButton } from "@/components/shared/re-fetch-button";

export default function InvitationsContainer({
  includedRoles,
  notIncludedRoles,
  status,
}: {
  includedRoles?: OrgRole[];
  notIncludedRoles?: OrgRole[];
  status: "accepted" | "pending" | "revoked";
}) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const {
    data: invitationsResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["invitations", page, pageSize, includedRoles, notIncludedRoles],
    queryFn: () =>
      getOrganizationInvitations(
        page,
        pageSize,
        status,
        includedRoles,
        notIncludedRoles
      ),
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

  if (error || !invitationsResponse?.success) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {!invitationsResponse?.success || "Failed to load invitations"}
        </AlertDescription>
      </Alert>
    );
  }

  const invitations = invitationsResponse.data.data;

  return (
    <div className="px-4 lg:px-6">
      <div className="relative flex flex-col gap-4">
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <Loading />
          </div>
        )}
        {invitations.length > 0 ? (
          <DataTable<InvitationData>
            data={invitations}
            columns={columns}
            pageCount={invitationsResponse.data.pagination.totalPages}
            pageSize={pageSize}
            pageIndex={page - 1}
            onPageChange={setPage}
            customColumnFilters={columnFilters}
            onCustomColumnFiltersChange={setColumnFilters}
            header={
              <div className="flex-1">
                <PageHeader
                  title={`Pending Invitations (${
                    invitationsResponse.data.data.filter(
                      (i) => i.status === "pending"
                    ).length
                  }) - All (${invitationsResponse.data.pagination.total})`}
                  description="Manage your organization's pending invitations"
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
            searchPlaceholder="Search by email..."
            searchKey="email"
            pagination={true}
            toolbar={true}
          />
        ) : (
          <div className="flex h-96 items-center justify-center text-muted-foreground">
            No pending invitations
          </div>
        )}
      </div>
    </div>
  );
}
