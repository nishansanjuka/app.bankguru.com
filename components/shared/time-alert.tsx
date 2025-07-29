"use client";

import { useEffect, useState } from "react";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  PopcornIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface TimedAlertProps {
  /**
   * The variant of the alert.
   * 'success' for positive feedback, 'warning' for caution,
   * 'destructive' for errors, and 'info' for general information.
   */
  variant: "success" | "warning" | "destructive" | "info";
  /** The main title of the alert. */
  title: string;
  /** Optional detailed message for the alert. */
  message?: string;
  /**
   * The duration in milliseconds the alert remains visible before fading out.
   * Defaults to 3000ms (3 seconds).
   */
  showTime?: number;
  /**
   * A boolean prop that controls the visibility of the alert.
   * When `true`, the alert appears. When `false`, it hides.
   */
  show: boolean;
  /**
   * A function to update the parent's state for `show`.
   * Called when the alert finishes its fade-out transition.
   */
  setShow: (show: boolean) => void;
}

/**
 * A reusable alert component that appears, stays for a specified time,
 * and then fades out with smooth transitions.
 */
export function TimedAlert({
  variant,
  title,
  message,
  showTime = 3000,
  show,
  setShow,
}: TimedAlertProps) {
  // State to control the component's mounting/unmounting for transitions
  const [isMounted, setIsMounted] = useState(false);
  // State to control the fade-out transition
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (show) {
      // When `show` becomes true, mount the component and start fade-in
      setIsMounted(true);
      setIsFadingOut(false); // Ensure it's not fading out initially

      // Set a timeout to start the fade-out after `showTime`
      timer = setTimeout(() => {
        setIsFadingOut(true);
      }, showTime);
    } else {
      // If `show` becomes false from the parent, immediately start fade-out
      // This allows the component to transition out even if `showTime` hasn't passed
      setIsFadingOut(true);
    }

    // Cleanup function to clear the timer if the component unmounts or `show` changes
    return () => {
      clearTimeout(timer);
    };
  }, [show, showTime]);

  // Callback for when the CSS transition ends
  const handleTransitionEnd = () => {
    // If the component was fading out, inform the parent to hide it
    // and reset `isMounted` for the next appearance
    if (isFadingOut) {
      setShow(false);
      setIsMounted(false);
    }
  };

  // Determine the icon based on the alert variant
  const Icon = () => {
    // Reduced icon size to h-3.5 w-3.5
    switch (variant) {
      case "success":
        return <CheckCircle2Icon className="h-3.5 w-3.5" />;
      case "warning":
        return <TriangleAlertIcon className="h-3.5 w-3.5" />;
      case "destructive":
        return <AlertCircleIcon className="h-3.5 w-3.5" />;
      case "info":
        return <PopcornIcon className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  // Custom Tailwind classes for different variants, using new color definitions
  const variantClasses = {
    success: "border-success bg-success-background text-success-foreground",
    warning: "border-warning bg-warning-background text-warning-foreground",
    info: "border-info bg-info-background text-info-foreground",
    destructive: "", // 'destructive' uses shadcn's built-in variant styling
  };

  // Only render the component if it's supposed to be shown or is currently fading out
  if (!show && !isMounted) {
    return null;
  }

  return (
    <Alert
      // Use shadcn's 'destructive' variant only for destructive alerts, otherwise 'default'
      variant={variant === "destructive" ? "destructive" : "default"}
      className={cn(
        "transition-all duration-500 ease-in-out transform", // Apply transition properties
        // Control opacity and vertical position for fade-in/out effect
        isFadingOut || !show
          ? "opacity-0 -translate-y-4"
          : "opacity-100 translate-y-0",
        "p-3", // Reduced padding from default p-4
        variantClasses[variant] // Apply custom background/text colors
      )}
      onTransitionEnd={handleTransitionEnd} // Listen for transition completion
    >
      <Icon />
      {/* Reduced font size for title and description */}
      <AlertTitle className="text-sm">{title}</AlertTitle>
      {message && (
        <AlertDescription className="text-xs">{message}</AlertDescription>
      )}
    </Alert>
  );
}
