/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterConfig } from "@/components/shared/data-table/data-table-toolbar";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchKey?: string;
  pageSize?: number;
  pageCount?: number;
  customColumnFilters?: ColumnFiltersState;
  onCustomColumnFiltersChange?: React.Dispatch<
    React.SetStateAction<ColumnFiltersState>
  >;
  pageIndex?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  manualPagination?: boolean;
  pagination?: boolean;
  toolbar?: boolean;
  children?: React.ReactNode;
  header?: React.ReactNode;
  actionButtons?: React.ReactNode;
  facetedFilters?: (FilterConfig | string)[];
  emptyState?: React.ReactNode;
  searchPlaceholder?: string;
}

export interface DataTableToolbarProps {
  table: any;
  filterKey?: string;
  searchPlaceholder?: string;
}

export interface DataTablePaginationProps {
  table: any;
}

export type ContactData = {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
};
