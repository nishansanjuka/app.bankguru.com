"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableProps } from "@/types/data-table";

export function DataTable<TData>({
  data,
  columns,
  searchKey,
  pageSize = 10,
  pageCount,
  pageIndex,
  onPageChange,
  onPageSizeChange,
  manualPagination = false,
  children,
  pagination = true,
  toolbar = true,
  actionButtons,
  customColumnFilters,
  onCustomColumnFiltersChange,
  searchPlaceholder,
  header,
  emptyState,
  facetedFilters,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters: customColumnFilters ?? columnFilters,
      pagination: {
        pageIndex: pageIndex ?? 0,
        pageSize: pageSize ?? 10,
      },
    },
    enableRowSelection: true,
    enableSorting: true,
    enableColumnFilters: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: onCustomColumnFiltersChange ?? setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination,
    pageCount: pageCount,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater(table.getState().pagination);
        onPageChange?.(newState.pageIndex + 1);
        onPageSizeChange?.(newState.pageSize);
      }
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {header}
          {actionButtons}
        </div>
        <div className="flex gap-2 flex-col sm:flex-row sm:items-center">
          {toolbar && (
            <DataTableToolbar
              facetedFilters={facetedFilters}
              data={data}
              table={table}
              filterKey={searchKey}
              searchPlaceholder={searchPlaceholder}
            />
          )}
        </div>
      </div>
      {!emptyState || data.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        emptyState
      )}
      {(!emptyState || data.length > 0) && pagination && (
        <DataTablePagination table={table} />
      )}
      {children}
    </div>
  );
}

export type Value = Record<"value" | "label", string>;
// Function to get unique values for dropdown filter
export const getUniqueValues = <T, K extends keyof T>(
  data: T[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnKey: any
): Value[] => {
  const uniqueValues = Array.from(
    new Set(data.map((item) => item[columnKey as K]))
  ).filter(Boolean);

  return uniqueValues.map((val) => ({
    value: String(val), // Convert value to string for the "value" field
    label: String(val), // Convert value to string for the "label" field
  }));
};
