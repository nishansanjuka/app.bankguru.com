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
import { ProductCategory } from "@/types/product-category";
import { deleteCategories } from "@/lib/actions/products/categories";
import { getQueryClient } from "@/lib/utils";
import { useState } from "react";
import { ResponsiveDialog } from "../shared/responsive-dialog";
import { DefineCategoriesContainer } from "@/app/(authenticated)/(super-admin)/dashboard/products/create-category/create-product-category-container";
import { toast } from "sonner";

const TableActions = ({ row }: { row: { original: ProductCategory } }) => {
  const queryClient = getQueryClient();
  const [onOpenChange, setOnOpenChange] = useState(false);

  const [isLoading, setIsLoading] = useState({
    delete: false,
  });

  async function deleteCategory(id: string): Promise<void> {
    try {
      setIsLoading((prev) => ({ ...prev, delete: true }));
      const res = await deleteCategories(id);

      if (!res.success) {
        toast.error(res.error || "Failed to delete category");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["categories" , "productCategoryHierarchy"] });
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
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
            disabled={isLoading.delete}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteCategory(row.original.id);
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
        <DefineCategoriesContainer
          type="update"
          data={{
            description: row.original.description,
            name: row.original.name,
            parentId: row.original.parentId,
          }}
          id={row.original.id}
          onClose={() => setOnOpenChange(false)}
        />
      </ResponsiveDialog>
    </>
  );
};

export const columns: ColumnDef<ProductCategory>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div className="truncate max-w-[40ch]">{row.getValue("description")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <TableActions row={row} />,
  },
];
