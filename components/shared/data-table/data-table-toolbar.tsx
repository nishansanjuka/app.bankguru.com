/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Table } from "@tanstack/react-table";
import { SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { useMemo } from "react";
import { getUniqueValues } from "./data-table";
import { DataTableFacetedFilter } from "./faceted-filter";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";

// Add these helper functions at the top level
 
const extractSearchableValues = (value: any): string[] => {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "string") return [item];
      if (typeof item === "object") {
        // Handle objects with 'value' property (like emails, phones, etc.)
        if (item.value) return [item.value];
        // Recursively extract values from nested objects
        return Object.values(item).flatMap(extractSearchableValues);
      }
      return [];
    });
  }
  if (typeof value === "object") {
    return Object.values(value).flatMap(extractSearchableValues);
  }
  return [String(value)];
};

// Type for filter configuration
export type FilterConfig = {
  key: string;
  title: string;
};

interface DataTableToolbarProps<TData> {
  table?: Table<TData>;
  filterKey?: string;
  searchPlaceholder?: string;
  data?: TData[];
  /**
   * Array of filter configurations or simple string array of keys
   * If string[] is provided, the key will be used as title
   */
  facetedFilters?: (FilterConfig | string)[];
}

export function DataTableToolbar<TData>({
  table,
  filterKey,
  searchPlaceholder = "Search...",
  data,
  facetedFilters = [],
}: DataTableToolbarProps<TData>) {
  // Convert string[] to FilterConfig[]
  const normalizedFilters = useMemo(
    () =>
      facetedFilters.map((filter) =>
        typeof filter === "string" ? { key: filter, title: filter } : filter
      ),
    [facetedFilters]
  );

  // Memoize filter options for each filter
  const filterOptions = useMemo(
    () =>
      normalizedFilters.reduce(
        (acc, filter) => ({
          ...acc,
          [filter.key]: getUniqueValues(data || [], filter.key)
            .map((value) => {
              // Handle object values
              if (value && typeof value === "object") {
                // If the object has a 'name' or 'title' property, use that
                const displayValue =
                  (value as any).name ||
                  (value as any).title ||
                  (value as any).label ||
                  JSON.stringify(value);
                return {
                  label: displayValue,
                  value: displayValue,
                };
              }

              // Handle primitive values
              const stringValue = value || String(value);
              return {
                label: stringValue,
                value: stringValue,
              };
            })
            .filter(Boolean),
        }),
        {} as Record<string, { label: string; value: string }[]>
      ),
    [data, normalizedFilters]
  );

  if (!table) return null;

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex md:items-center md:justify-between gap-2 sm:flex-1">
      <div className="flex flex-col md:flex-row flex-1 md:items-center gap-2">
        {filterKey && (
          <div className="relative w-full">
            <Input
              className="peer ps-9 pe-9"
              type="search"
              placeholder={searchPlaceholder || "Search..."}
              value={
                (table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                const column = table.getColumn(filterKey);
                if (column) {
                  column.setFilterValue(event.target.value);
                  // Update the filter function for this column
                  column.columnDef.filterFn = (row, columnId, filterValue) => {
                    const value = row.getValue(columnId);
                    const searchableValues = extractSearchableValues(value);
                    return searchableValues.some((str) =>
                      str
                        .toLowerCase()
                        .includes((filterValue as string).toLowerCase())
                    );
                  };
                }
              }}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </div>
        )}
        <ScrollArea className="w-full">
          <div className="flex items-center gap-2">
            {normalizedFilters.map((filter) => {
              const column = table.getColumn(filter.key);
              if (!column) return null;

              return (
                <DataTableFacetedFilter
                  key={filter.key}
                  column={column}
                  title={filter.title}
                  options={filterOptions[filter.key]}
                />
              );
            })}

            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-9 px-2 lg:px-3"
              >
                Reset
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" className="pb-2" />
        </ScrollArea>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
