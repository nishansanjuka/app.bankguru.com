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
import { getInstitutesTypes } from "@/lib/actions/institutions/define-intitue";

export interface AccountTypeComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function AccountTypeCombobox({
  value,
  onChange,
  className,
}: AccountTypeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(value || "");
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);

  const { data: accountTypes } = useQuery({
    queryKey: ["institutions"],
    queryFn: async () => {
      const res = await getInstitutesTypes();
      if (res.success) {
        return res.data;
      } else {
        throw new Error(res.error || "Failed to fetch account types");
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
    localStorage.setItem("accountType", val);
    onChange?.(val);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            !selected && "text-gray-500 font-normal text-sm",
            className
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
            ? accountTypes?.find((t) => t.id === selected)?.name
            : "Select account category..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: buttonWidth ? `${buttonWidth}px` : undefined }}
      >
        <Command>
          <CommandInput placeholder="Search account category..." />
          <CommandList>
            {accountTypes?.map((type) => (
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
