"use client";

import { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, ButtonProps } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SheetContainerProps = {
  children: ReactNode;
  title: string;
  triggerText: string;
  triggerIcon?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  hasActiveBadge?: boolean;
  badgeText?: string;
  showCloseButton?: boolean;
} & ButtonProps;

export function SheetContainer({
  children,
  title,
  triggerText,
  triggerIcon,
  isOpen,
  onOpenChange,
  className = "",
  side = "left",
  hasActiveBadge = false,
  badgeText = "Active",
  ...buttonProps
}: SheetContainerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          {...buttonProps}
          className={className}
        >
          {triggerIcon}
          {triggerText}
          {hasActiveBadge && (
            <Badge className="ml-2 h-5 px-1.5 text-xs">{badgeText}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side={side} className="w-full sm:w-[400px] p-0">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-gray-900">
              {title}
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
