"use client";

import type React from "react";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, ChevronsUpDown, Search, Plus } from "lucide-react";
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
  enhanced?: boolean;
  allowCustom?: boolean;
  customOptionTitle?: string;
  customOptionDescription?: string;
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
  enhanced = false,
  allowCustom = true,
  customOptionTitle = "Add Custom Option",
  customOptionDescription = "Are you sure you want to add this custom option?",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [triggerWidth, setTriggerWidth] = useState<number>(0);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingCustomValue, setPendingCustomValue] = useState("");
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

  // Check if search query matches any existing option
  const hasExactMatch = options.some(
    (option) => option.label.toLowerCase() === searchQuery.toLowerCase()
  );

  // Show custom option if search query doesn't match and allowCustom is true
  const showCustomOption =
    enhanced &&
    allowCustom &&
    searchQuery.trim() !== "" &&
    !hasExactMatch &&
    filteredOptions.length === 0;

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setOpen(false);
    setSearchQuery("");
  };

  const handleCustomOptionClick = () => {
    setPendingCustomValue(searchQuery.trim());
    setShowAlert(true);
  };

  const handleConfirmCustom = () => {
    if (pendingCustomValue) {
      onChange?.(pendingCustomValue);
      setOpen(false);
      setSearchQuery("");
    }
    setShowAlert(false);
    setPendingCustomValue("");
  };

  const handleCancelCustom = () => {
    setShowAlert(false);
    setPendingCustomValue("");
  };

  return (
    <>
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
                      src={selectedOption.iconUrl || "/placeholder.svg"}
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
              ) : value && !selectedOption && enhanced ? (
                // Show custom value if it doesn't match any option and enhanced is true
                <span className="truncate">{value}</span>
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
                            src={option.iconUrl || "/placeholder.svg"}
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
              ) : showCustomOption ? (
                <CommandGroup>
                  <CommandItem
                    onSelect={handleCustomOptionClick}
                    className="flex items-center gap-2 py-2 cursor-pointer text-primary"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      Add &quot;{searchQuery}&quot;
                    </span>
                  </CommandItem>
                </CommandGroup>
              ) : (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{customOptionTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {customOptionDescription} &quot;{pendingCustomValue}&quot; will be
              added as a new option.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelCustom}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCustom}>
              Sure
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
