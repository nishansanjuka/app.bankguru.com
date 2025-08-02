"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MultiInputProps {
  items: string[];
  setItems: (items: string[]) => void;
  label: string;
  description?: string;
  placeholder?: string;
  validate?: (item: string) => boolean;
  maxItems?: number;
}

export function MultiInput({
  items,
  setItems,
  label,
  description,
  placeholder = "Enter item and press Enter",
  validate,
  maxItems,
}: MultiInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const addItem = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) return;

    if (items.includes(trimmedValue)) {
      setError("Item already exists");
      return;
    }

    if (maxItems && items.length >= maxItems) {
      setError(`Maximum ${maxItems} items allowed`);
      return;
    }

    if (validate && !validate(trimmedValue)) {
      setError("Invalid format");
      return;
    }

    setItems([...items, trimmedValue]);
    setInputValue("");
    setError("");
  };

  const removeItem = (indexToRemove: number) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    } else if (e.key === "Backspace" && !inputValue && items.length > 0) {
      removeItem(items.length - 1);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (error) setError("");
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="multi-input" className="text-sm font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Input
            id="multi-input"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`transition-colors ${
              error ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
          {error && (
            <p className="text-xs text-destructive mt-1 animate-in slide-in-from-top-1 duration-200">
              {error}
            </p>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md border border-dashed animate-in fade-in-0 duration-300">
            {items.map((item, index) => (
              <Badge
                key={`${item}-${index}`}
                variant="secondary"
                className="group flex items-center gap-1.5 pr-1 pl-3 py-1.5 text-sm font-normal bg-background border hover:bg-muted/50 transition-colors animate-in zoom-in-95 duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="truncate max-w-[200px]">{item}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive rounded-full opacity-60 group-hover:opacity-100 transition-all duration-200"
                  onClick={() => removeItem(index)}
                  aria-label={`Remove ${item}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {maxItems && (
          <p className="text-xs text-muted-foreground">
            {items.length} of {maxItems} items
          </p>
        )}
      </div>
    </div>
  );
}
