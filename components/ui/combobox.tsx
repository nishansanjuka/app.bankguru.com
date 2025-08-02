"use client";

import { useState, useRef, useEffect } from "react";
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
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconUrl?: string;
}

interface ComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

export default function Combobox({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [triggerWidth, setTriggerWidth] = useState<number>(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  // Find selected option
  const selectedOption = options.find((option) => option.value === value);

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("justify-between h-10 font-normal", className)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedOption ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {selectedOption.iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedOption.iconUrl}
                    alt={selectedOption.label}
                    width={16}
                    height={16}
                    className="w-4 h-4 shrink-0 rounded-sm"
                  />
                ) : selectedOption.icon ? (
                  <selectedOption.icon className="w-4 h-4 shrink-0" />
                ) : null}
                <span className="truncate">{selectedOption.label}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: triggerWidth > 0 ? `${triggerWidth}px` : "200px" }}
      >
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 !bg-transparent"
            />
          </div>

          <CommandList className="max-h-[300px]">
            {filteredOptions.length > 0 ? (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="flex items-center justify-between py-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {option.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={option.iconUrl}
                          alt={option.label}
                          width={16}
                          height={16}
                          className="w-4 h-4 shrink-0 rounded-sm"
                        />
                      ) : option.icon ? (
                        <option.icon className="w-4 h-4 shrink-0" />
                      ) : null}
                      <span className="truncate">{option.label}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
