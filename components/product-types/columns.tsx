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
import { ProductType } from "@/types/product-type";

// Placeholder methods for update and delete
export async function updateProductType(
  id: string,
  data: Partial<Omit<ProductType, "id">>
): Promise<ProductType> {
  // TODO: Implement update ProductType logic
  throw new Error("Not implemented");
}

export async function deleteProductType(id: string): Promise<void> {
  // TODO: Implement delete ProductType logic
  throw new Error("Not implemented");
}

const TableActions = ({ row }: { row: { original: ProductType } }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => updateProductType(row.original.id, {})}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          <span>Update</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => deleteProductType(row.original.id)}
          className="flex items-center gap-2 text-red-600"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
