"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ProductCategory } from "@/types/product-category";

// Placeholder methods for update and delete
export async function updateCategory(
  id: string,
  data: Partial<Omit<ProductCategory, "id">>
): Promise<ProductCategory> {
  // TODO: Implement update Category logic
  throw new Error("Not implemented");
}

export async function deleteCategory(id: string): Promise<void> {
  // TODO: Implement delete Category logic
  throw new Error("Not implemented");
}

const TableActions = ({ row }: { row: { original: ProductCategory } }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => updateCategory(row.original.id, {})}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          <span>Update</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => deleteCategory(row.original.id)}
          className="flex items-center gap-2 text-red-600"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <TableActions row={row} />,
  },
];
