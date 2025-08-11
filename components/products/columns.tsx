"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Product } from "@/types/product";
import { useState } from "react";
import { ResponsiveDialog } from "../shared/responsive-dialog";
import ProductCreateContainer from "@/app/(authenticated)/(super-admin)/dashboard/products/create/product-create-container";
import { ScrollArea } from "../ui/scroll-area";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <NameContainer row={row} />,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[40ch] truncate">
        {row.original.details.description}
      </div>
    ),
  },
  {
    accessorKey: "fees",
    header: "Fees",
    cell: ({ row }) => <div>{row.original.details.fees}</div>,
  },
  {
    accessorKey: "terms",
    header: "Terms",
    cell: ({ row }) => (
      <div className="max-w-[40ch] truncate">{row.original.details.terms}</div>
    ),
  },
  {
    accessorKey: "eligibility",
    header: "Eligibility",
    cell: ({ row }) => <div>{row.original.details.eligibility}</div>,
  },
];

const NameContainer = ({ row }: { row: Row<Product> }) => {
  const [onOpenChange, setOnOpenChange] = useState(false);

  return (
    <>
      <button
        className="hover:underline cursor-pointer  underline-offset-2"
        onClick={() => setOnOpenChange(true)}
      >
        {row.getValue("name")}
      </button>
      <ResponsiveDialog
        title="Update Product"
        description="Update product details"
        open={onOpenChange}
        onOpenChange={setOnOpenChange}
        className="sm:w-[90vw] max-w-3xl"
      >
        <ScrollArea className="h-[80vh] pr-4">
          <ProductCreateContainer
            type="update"
            onlyProduct={true}
            data={row.original}
            id={row.original.id}
            onClose={() => setOnOpenChange(false)}
          />
        </ScrollArea>
      </ResponsiveDialog>
    </>
  );
};
