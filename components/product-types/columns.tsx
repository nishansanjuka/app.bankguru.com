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
import { ProductType } from "@/types/product-type";
import { useState } from "react";
import { getQueryClient } from "@/lib/utils";
import { deleteProductType } from "@/lib/actions/products/types";
import { toast } from "sonner";
import { ResponsiveDialog } from "../shared/responsive-dialog";
import { DefineProductTypeContainer } from "@/app/(authenticated)/(super-admin)/dashboard/products/create-types/create-product-types-container";

const TableActions = ({ row }: { row: { original: ProductType } }) => {
  const queryClient = getQueryClient();
  const [onOpenChange, setOnOpenChange] = useState(false);

  const [isLoading, setIsLoading] = useState({
    delete: false,
  });

  async function deleteType(id: string): Promise<void> {
    try {
      setIsLoading((prev) => ({ ...prev, delete: true }));
      const res = await deleteProductType(id);

      if (!res.success) {
        toast.error(res.error || "Failed to delete product type");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["product-types"] });
      toast.success("Product type deleted successfully");
    } catch (error) {
      console.error("Error deleting product type:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  }

  return (
    <>
      {" "}
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
              deleteType(row.original.id);
            }}
            className="flex items-center gap-2 text-red-600"
          >
            {isLoading.delete ? (
              <Loader2 className="h-4 w-4 text-red-500 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-red-500" />
            )}
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ResponsiveDialog
        title="Update Product Type"
        description="Define a new product type by providing the necessary details."
        open={onOpenChange}
        onOpenChange={setOnOpenChange}
        className="w-full sm:w-[40vw] md:w-[90vw] lg:w-[60vw]"
      >
        <DefineProductTypeContainer
          type="update"
          data={row.original}
          id={row.original.id}
          onClose={() => setOnOpenChange(false)}
        />
      </ResponsiveDialog>
    </>
  );
};

export const columns: ColumnDef<ProductType>[] = [
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
