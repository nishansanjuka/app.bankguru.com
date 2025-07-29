import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { MoreHorizontal, Trash2, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  removeOrganizationMember,
  updateOrganizationMemberRole,
} from "@/lib/actions/organizations";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { toast } from "sonner";

export type UserData = {
  id: string;
  profile: string;
  fullName: string;
  role: string;
  joinedDate: Date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ActionCell = ({ row }: { row: any }) => {
  const queryClient = useQueryClient();
  const isAdmin = row.getValue("role") === "org:admin";
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const { mutate: deleteMember, isPending: isDeleting } = useMutation({
    mutationFn: () => removeOrganizationMember(row.original.id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["members"] });
        toast.success("Member removed successfully");
        setIsOpen(false);
      } else {
        toast.error(response.error || "Failed to remove member");
      }
    },
    onError: () => {
      throw new Error("Failed to remove member");
    },
  });

  const { mutate: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: () =>
      updateOrganizationMemberRole(
        row.original.id,
        isAdmin ? "org:standard_user" : "org:admin"
      ),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          `Member role updated to ${
            isAdmin ? "Standard User" : "Admin"
          } successfully`
        );
        queryClient.invalidateQueries({ queryKey: ["members"] });
      } else {
        toast.error(response.error || "Failed to update role");
      }
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={isDeleting || isUpdating}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              updateRole();
            }}
            disabled={isDeleting || isUpdating}
            className="flex items-center gap-2"
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            {isUpdating ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <UserCog className="h-4 w-4" />
            )}
            <span>{isAdmin ? "Make Member" : "Make Admin"}</span>
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              disabled={isDeleting || isUpdating}
              className="flex items-center gap-2 text-red-600"
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete User</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove this
            member from your organization and will remove all of the
            member&apos;s business card details and all relevant data belongs to
            this member.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMember()}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "profile",
    header: "Avatar",
    cell: ({ row }) => {
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={row.getValue("profile")} alt="User avatar" />
          <AvatarFallback className="tracking-wider">
            {`${row.original.fullName.split(" ")[0][0]}${
              row.original.fullName.split(" ")[1][0]
            }`}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.fullName}</span>
        </div>
      );
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
            role === "org:admin"
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
    accessorKey: "joinedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm text-gray-500">
          {format(row.getValue("joinedDate"), "MMM d, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
