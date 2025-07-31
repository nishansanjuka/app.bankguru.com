"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { getQueryClient } from "@/lib/utils";
import { deleteInstituteType } from "@/lib/actions/institutions/define-intitue";
import { ResponsiveDialog } from "../shared/responsive-dialog";
import { DefineInstitutionsContainer } from "@/app/(authenticated)/(super-admin)/dashboard/institutions/create/create-institutions-container";
import { toast } from "sonner";
import { InstitutionTypes } from "@/types/institution-types";

const TableActions = ({ row }: { row: { original: InstitutionTypes } }) => {
  const queryClient = getQueryClient();
  const [onOpenChange, setOnOpenChange] = useState(false);

  const [isLoading, setIsLoading] = useState({
    delete: false,
  });

  async function deleteInstitutionData(id: string): Promise<void> {
    try {
      setIsLoading((prev) => ({ ...prev, delete: true }));
      const res = await deleteInstituteType(id);

      if (!res.success) {
        toast.error(res.error || "Failed to delete institution");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      toast.success("Institution deleted successfully!");
    } catch (error) {
      console.error("Error deleting institution:", error);
      toast.error("Failed to delete institution");
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setOnOpenChange(true)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            <span>Update</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              deleteInstitutionData(row.original.id);
            }}
            className="flex items-center gap-2 text-red-600"
          >
            {isLoading.delete ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-red-500" />
            )}
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ResponsiveDialog
        title="Update Category"
        description="Update the details of this category."
        open={onOpenChange}
        onOpenChange={setOnOpenChange}
        className="w-full sm:w-[40vw] md:w-[90vw] lg:w-[60vw]"
      >
        <DefineInstitutionsContainer
          type="update"
          data={{
            description: row.original.description,
            name: row.original.name,
            code: row.original.code,
          }}
          id={row.original.id}
          onClose={() => setOnOpenChange(false)}
        />
      </ResponsiveDialog>
    </>
  );
};

export const columns: ColumnDef<InstitutionTypes>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <TableActions row={row} />,
  },
];
