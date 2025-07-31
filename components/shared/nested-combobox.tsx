"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Search,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductType {
  id: string;
  categoryId: string;
  code: string;
  name: string;
  description: string;
}

interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string;
  level: number;
  children?: Category[];
  productTypes?: ProductType[];
}

interface NestedComboboxData {
  data: Category[];
}

interface NestedComboboxProps {
  data: NestedComboboxData;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function NestedCombobox({
  data,
  value,
  onChange,
  placeholder = "Select an option...",
  className,
}: NestedComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState<Category[]>([]);
  const [navigationHistory, setNavigationHistory] = useState<Category[][]>([]);
  const [triggerWidth, setTriggerWidth] = useState<number>(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Find all products from the data structure
  const allProducts = useMemo(() => {
    const products: ProductType[] = [];

    const extractProducts = (categories: Category[]) => {
      categories.forEach((category) => {
        if (category.productTypes) {
          products.push(...category.productTypes);
        }
        if (category.children) {
          extractProducts(category.children);
        }
      });
    };

    extractProducts(data.data);
    return products;
  }, [data.data]);

  // Find the selected product by ID
  const selectedProduct = useMemo(() => {
    if (!value) return null;
    return allProducts.find((product) => product.id === value) || null;
  }, [value, allProducts]);

  // Get current level items (categories or subcategories)
  const currentItems = useMemo(() => {
    if (currentPath.length === 0) {
      return data.data;
    }
    const currentCategory = currentPath[currentPath.length - 1];
    return currentCategory.children || [];
  }, [currentPath, data.data]);

  // Get current level product types
  const currentProductTypes = useMemo(() => {
    // Helper to recursively collect product types
    const getAllProductTypes = (category: Category): ProductType[] => {
      const current = category.productTypes || [];
      const childTypes = category.children
        ? category.children.flatMap(getAllProductTypes)
        : [];
      return [...current, ...childTypes];
    };

    // At root level (level 0), don't show any product types
    if (currentPath.length === 0) {
      return [];
    }

    const currentCategory = currentPath[currentPath.length - 1];
    return getAllProductTypes(currentCategory);
  }, [currentPath]);

  // Track trigger width changes
  useEffect(() => {
    const updateTriggerWidth = () => {
      if (triggerRef.current) {
        setTriggerWidth(triggerRef.current.offsetWidth);
      }
    };

    // Initial width measurement
    updateTriggerWidth();

    // Create ResizeObserver for more accurate tracking
    const resizeObserver = new ResizeObserver(() => {
      updateTriggerWidth();
    });

    // Observe the trigger element
    if (triggerRef.current) {
      resizeObserver.observe(triggerRef.current);
    }

    // Fallback window resize listener
    window.addEventListener("resize", updateTriggerWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTriggerWidth);
    };
  }, []);

  // Update width when popover opens
  useEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery) return currentItems;
    return currentItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentItems, searchQuery]);

  const filteredProductTypes = useMemo(() => {
    if (!searchQuery) return currentProductTypes;
    return currentProductTypes.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentProductTypes, searchQuery]);

  const navigateToCategory = (category: Category) => {
    setNavigationHistory((prev) => [...prev, currentPath]);
    setCurrentPath((prev) => [...prev, category]);
    setSearchQuery("");
  };

  const navigateBack = () => {
    if (navigationHistory.length > 0) {
      const previousPath = navigationHistory[navigationHistory.length - 1];
      setCurrentPath(previousPath);
      setNavigationHistory((prev) => prev.slice(0, -1));
    } else {
      setCurrentPath([]);
    }
    setSearchQuery("");
  };

  const selectItem = (product: ProductType) => {
    onChange?.(product.id); // Just pass the product ID
    setOpen(false);
    setCurrentPath([]);
    setNavigationHistory([]);
    setSearchQuery("");
  };

  const resetSelection = () => {
    onChange?.(""); // Just pass an empty string
    setCurrentPath([]);
    setNavigationHistory([]);
    setSearchQuery("");
  };

  const getBreadcrumb = () => {
    if (currentPath.length === 0) return "All Categories";
    return currentPath.map((p) => p.name).join(" / ");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between h-10 font-normal", className)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedProduct ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Badge variant="secondary" className="text-xs">
                  {selectedProduct.code.replace("_", " ")}
                </Badge>
                <span className="truncate">{selectedProduct.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: triggerWidth > 0 ? `${triggerWidth}px` : "400px" }}
      >
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
            />
          </div>

          {/* Navigation Header */}
          <div className="flex items-center justify-between p-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              {currentPath.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateBack}
                  className="h-6 w-6 p-0"
                >
                  <ArrowLeft className="h-3 w-3" />
                </Button>
              )}
              <span className="text-xs font-medium text-muted-foreground">
                {getBreadcrumb()}
              </span>
            </div>
            {selectedProduct && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetSelection}
                className="h-6 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
          </div>

          <CommandList className="max-h-[300px]">
            {/* Categories/Subcategories */}
            {filteredItems.length > 0 && (
              <CommandGroup heading="Categories">
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      // Only navigate, never select categories
                      if (item.children && item.children.length > 0) {
                        navigateToCategory(item);
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between py-2",
                      !item.children || item.children.length === 0
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.children && item.children.length > 0 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Product Types */}
            {filteredProductTypes.length > 0 && (
              <CommandGroup heading="Products">
                {filteredProductTypes.map((product) => (
                  <CommandItem
                    key={product.id}
                    onSelect={() => selectItem(product)}
                    className="flex items-center justify-between py-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Badge variant="outline" className="text-xs shrink-0">
                        {product.code.replace("_", " ")}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {value === product.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredItems.length === 0 &&
              filteredProductTypes.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
