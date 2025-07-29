"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Trash2, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  resendOrganizationInvitation,
  revokeOrganizationInvitation,
} from "@/lib/actions/invitations";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { toast } from "sonner";

export type InvitationData = {
  id: string;
  email: string;
  status: string;
  role: string;
  invitedAt: Date;
  expiresAt: Date | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InvitationActionCell = ({ row }: { row: any }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const { mutate: revokeInvitation, isPending: isRevoking } = useMutation({
    mutationFn: () =>
      revokeOrganizationInvitation(row.original.id, row.original.email),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Invitation revoked successfully");
        queryClient.invalidateQueries({
          queryKey: ["invitations"],
          refetchType: "active",
          exact: false,
        });
        setIsOpen(false);
        setDropdownOpen(false);
      } else {
        setIsOpen(false);
        setDropdownOpen(false);
        toast.error(response.error || "Failed to revoke invitation");
      }
    },
    onError: () => {
      toast.error("Failed to revoke invitation");
    },
  });

  const { mutate: resendInvitation, isPending: isResending } = useMutation({
    mutationFn: () => resendOrganizationInvitation(row.original.email),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: ["invitations"],
          refetchType: "active",
          exact: false,
        });
        toast.success("Invitation resent successfully");
        setDropdownOpen(false);
      } else {
        toast.error(response.error || "Failed to resend invitation");
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to resend invitation"
      );
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={isRevoking || isResending}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              resendInvitation();
            }}
            disabled={
              isRevoking || isResending || row.original.status === "accepted"
            }
            className="flex items-center gap-2"
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            {isResending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>Resend Invitation</span>
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              disabled={
                isRevoking ||
                isResending ||
                row.original.status === "revoked" ||
                row.original.status === "accepted"
              }
              className="flex items-center gap-2 text-red-600"
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Revoke Invitation</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently revoke this
            invitation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => revokeInvitation()}
            disabled={isRevoking}
            className="bg-red-600 hover:bg-red-700"
          >
            {isRevoking ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              "Revoke"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const columns: ColumnDef<InvitationData>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            role.includes("admin")
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {role.toUpperCase().split(":")[1].replace("_", " ") || "UNKNOWN"}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        accepted: "bg-green-100 text-green-800",
        revoked: "bg-red-100 text-red-800",
      };

      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusColors[status.toLowerCase()] ?? "bg-gray-100 text-gray-800"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "invitedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invited Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm text-gray-500">
          {format(row.getValue("invitedAt"), "MMM d, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <InvitationActionCell row={row} />,
  },
];
