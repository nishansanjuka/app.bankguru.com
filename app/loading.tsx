import { Loader2 } from "lucide-react";
import React from "react";

export default function Loading({
  isActualLoading = true,
  text,
}: {
  isActualLoading?: boolean;
  text?: string;
}) {
  return (
    <div className="flex justify-center h-screen">
      <div className="flex flex-col items-center justify-center space-y-2">
        <Loader2 className="size-6 animate-spin mt-10" />
        <span>{isActualLoading ? " please wait..." : text}</span>
      </div>
    </div>
  );
}
