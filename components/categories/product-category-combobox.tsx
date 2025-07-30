"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/actions/products/categories";

export interface ProductCategoryComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  type?: "create" | "update";
}

export function ProductCategoryCombobox({
  value,
  type = "create",
  onChange,
}: ProductCategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(value || "");
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      if (res.success) {
        return res.data;
      } else {
        throw new Error(res.error || "Failed to fetch product categories");
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Set width on mount and resize
  useEffect(() => {
    function updateWidth() {
      if (buttonRef.current) {
        const width = buttonRef.current.offsetWidth;
        setButtonWidth(width);
        // Set CSS variable on the parent node (popover trigger's parent)
        const parent = buttonRef.current.parentElement;
        if (parent) {
          parent.style.setProperty("--combobox-width", `${width}px`);
        }
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  const handleSelect = (val: string) => {
    setSelected(val);
    setOpen(false);
    onChange?.(val);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={type === "update"}
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-14 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 text-base transition-all duration-300",
            !selected && "text-gray-500 font-normal text-sm"
          )}
          style={
            {
              ["--combobox-width"]: buttonWidth
                ? `${buttonWidth}px`
                : undefined,
            } as React.CSSProperties
          }
        >
          {selected
            ? categories?.find((t) => t.id === selected)?.name
            : "Select product category..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: buttonWidth ? `${buttonWidth}px` : undefined }}
      >
        <Command>
          <CommandInput placeholder="Search product category..." />
          <CommandList>
            {categories?.map((type) => (
              <CommandItem
                key={type.id}
                value={type.id}
                onSelect={() => handleSelect(type.id)}
                className="flex items-center justify-between"
              >
                <span>{type.name}</span>
                {selected === type.id && (
                  <Check className="w-4 h-4 text-orange-500" />
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
