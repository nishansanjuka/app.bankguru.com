"use client";

import { useState, useEffect, useMemo } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Combobox from "@/components/ui/combobox";
import { Product } from "@/types/product";

interface FilterState {
  institutionName: string;
  productName: string; // Added product name filter
  additionalFilters: Record<
    string,
    {
      type: "range";
      min?: number;
      max?: number;
    }
  >;
}

interface DynamicFilterSheetProps {
  data: Product[];
  onFilter: (filteredData: Product[]) => void;
  className?: string;
}

export default function DynamicFilterSheet({
  data,
  onFilter,
  className = "",
}: DynamicFilterSheetProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    basic: true,
    additional: true,
  });

  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    institutionName: "",
    productName: "",
    additionalFilters: {},
  });

  // Extract filterable additional fields dynamically
  const filterableFields = useMemo(() => {
    const fields: Record<
      string,
      {
        type: "number" | "percentage";
        label: string;
        values: (string | number)[];
      }
    > = {};

    data.forEach((product) => {
      product.details.additionalInfo.forEach((field) => {
        if (["number", "percentage"].includes(field.type)) {
          if (!fields[field.id]) {
            fields[field.id] = {
              type: field.type as "number" | "percentage",
              label: field.label,
              values: [],
            };
          }
          if (!fields[field.id].values.includes(field.value)) {
            fields[field.id].values.push(field.value);
          }
        }
      });
    });

    return fields;
  }, [data]);

  // Extract unique institutions and products for combobox options
  const institutionOptions = useMemo(() => {
    const institutions = new Set<string>();
    data.forEach((product) => {
      if (product.institution?.name) {
        institutions.add(product.institution.name);
      }
    });
    return Array.from(institutions)
      .sort()
      .map((name) => ({
        value: name,
        label: name,
      }));
  }, [data]);

  const productOptions = useMemo(() => {
    const products = new Set<string>();
    data.forEach((product) => {
      if (product.name) {
        products.add(product.name);
      }
    });
    return Array.from(products)
      .sort()
      .map((name) => ({
        value: name,
        label: name,
      }));
  }, [data]);

  // Initialize additional filters when filterable fields change
  useEffect(() => {
    const newAdditionalFilters: FilterState["additionalFilters"] = {};

    Object.entries(filterableFields).forEach(([fieldId, field]) => {
      if (field.type === "number" || field.type === "percentage") {
        const numericValues = field.values
          .map((v) => (typeof v === "string" ? parseFloat(v) || 0 : v))
          .filter((v) => !isNaN(v));
        const min = Math.min(...numericValues);
        const max = Math.max(...numericValues);
        newAdditionalFilters[fieldId] = {
          type: "range",
          min: isFinite(min) ? min : 0,
          max: isFinite(max) ? max : 100,
        };
      }
    });

    setFilters((prev) => ({
      ...prev,
      additionalFilters: newAdditionalFilters,
    }));
  }, [filterableFields]);

  // Apply filters
  const applyFilters = () => {
    const filtered = data.filter((product) => {
      // Filter by institution name (exact match since using combobox)
      if (
        filters.institutionName &&
        product.institution &&
        product.institution.name !== filters.institutionName
      ) {
        return false;
      }

      // Filter by product name (exact match since using combobox)
      if (filters.productName && product.name !== filters.productName) {
        return false;
      }

      // Additional field filters (only number/percentage ranges)
      for (const [fieldId, filter] of Object.entries(
        filters.additionalFilters
      )) {
        const field = product.details.additionalInfo.find(
          (f) => f.id === fieldId
        );
        if (!field) continue;

        if (
          filter.type === "range" &&
          (filter.min !== undefined || filter.max !== undefined)
        ) {
          const numericValue =
            typeof field.value === "string"
              ? parseFloat(field.value)
              : field.value;
          if (isNaN(numericValue)) continue;

          if (filter.min !== undefined && numericValue < filter.min) {
            return false;
          }
          if (filter.max !== undefined && numericValue > filter.max) {
            return false;
          }
        }
      }

      return true;
    });

    onFilter(filtered);
  };

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, data]);

  const clearFilters = () => {
    setFilters({
      institutionName: "",
      productName: "", // Reset productName
      additionalFilters: Object.fromEntries(
        Object.entries(filterableFields).map(([key, field]) => {
          const numericValues = field.values
            .map((v) => (typeof v === "string" ? parseFloat(v) || 0 : v))
            .filter((v) => !isNaN(v));
          const min = Math.min(...numericValues);
          const max = Math.max(...numericValues);
          return [
            key,
            {
              type: "range",
              min: isFinite(min) ? min : 0,
              max: isFinite(max) ? max : 100,
            },
          ];
        })
      ),
    });
  };

  const hasActiveFilters =
    filters.institutionName ||
    filters.productName || // Include productName in active filters check
    Object.entries(filters.additionalFilters).some(([fieldId, f]) => {
      const field = filterableFields[fieldId];
      if (!field) return false;

      const numericValues = field.values
        .map((v) => (typeof v === "string" ? parseFloat(v) || 0 : v))
        .filter((v) => !isNaN(v));
      const defaultMin = numericValues.length ? Math.min(...numericValues) : 0;
      const defaultMax = numericValues.length
        ? Math.max(...numericValues)
        : 100;

      return (
        (f.min !== undefined && f.min !== defaultMin) ||
        (f.max !== undefined && f.max !== defaultMax)
      );
    });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className={`sm:space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className=" items-center gap-2 hidden sm:flex">
          <Filter className="h-4 w-4" />
          <h2 className="font-medium">Filter Products</h2>
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Content */}
      <div className="space-y-6">
        {/* General Filters (Institution Name and Product Name) */}
        <Collapsible
          open={expandedSections.basic}
          onOpenChange={() => toggleSection("basic")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <h3 className="font-medium text-sm">General Filters</h3>
            {expandedSections.basic ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            {/* Institution Name Filter */}
            <div className="space-y-2">
              <Label
                htmlFor="institutionName"
                className="text-xs font-medium text-muted-foreground"
              >
                Institution Name
              </Label>
              <Combobox
                value={filters.institutionName}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    institutionName: value,
                  }))
                }
                options={institutionOptions}
                placeholder="Select institution..."
                searchPlaceholder="Search institutions..."
                emptyMessage="No institutions found."
                className="h-8 text-sm w-full"
              />
            </div>

            {/* Product Name Filter */}
            <div className="space-y-2">
              <Label
                htmlFor="productName"
                className="text-xs font-medium text-muted-foreground"
              >
                Product Name
              </Label>
              <Combobox
                value={filters.productName}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    productName: value,
                  }))
                }
                options={productOptions}
                placeholder="Select product..."
                searchPlaceholder="Search products..."
                emptyMessage="No products found."
                className="h-8 text-sm w-full"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Additional Fields (only number/percentage) */}
        {Object.keys(filterableFields).length > 0 && (
          <Collapsible
            open={expandedSections.additional}
            onOpenChange={() => toggleSection("additional")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <h3 className="font-medium text-sm">Additional Fields</h3>
              {expandedSections.additional ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              {Object.entries(filterableFields).map(([fieldId, field]) => (
                <div key={fieldId} className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    {field.label}
                    {field.type === "percentage" && " (%)"}
                  </Label>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">
                          Min
                        </Label>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.additionalFilters[fieldId]?.min ?? ""}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              additionalFilters: {
                                ...prev.additionalFilters,
                                [fieldId]: {
                                  ...prev.additionalFilters[fieldId],
                                  min: e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                                },
                              },
                            }))
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">
                          Max
                        </Label>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.additionalFilters[fieldId]?.max ?? ""}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              additionalFilters: {
                                ...prev.additionalFilters,
                                [fieldId]: {
                                  ...prev.additionalFilters[fieldId],
                                  max: e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                                },
                              },
                            }))
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}
