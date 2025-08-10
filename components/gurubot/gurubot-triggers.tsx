"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useGuruBotTrigger } from "@/hooks/use-gurubot-trigger";
import { cn } from "@/lib/utils";
import { MessageCircle, HelpCircle, Sparkles } from "lucide-react";

interface GuruBotTriggerButtonProps {
  query?: string;
  variant?: "ask" | "help" | "recommend";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: React.ReactNode;
  productName?: string;
  productType?: string;
  category?: string;
  requirements?: string;
}

/**
 * A button component that triggers GuruBot with predefined or custom queries
 * Can be placed anywhere in the app to provide contextual AI assistance
 */
export function GuruBotTriggerButton({
  query,
  variant = "ask",
  size = "default",
  className,
  children,
  productName,
  productType,
  category,
  requirements,
}: GuruBotTriggerButtonProps) {
  const { askGuruBot, askAboutProduct, askForRecommendation, isLoading } = useGuruBotTrigger();

  const handleClick = async () => {
    if (query) {
      await askGuruBot(query);
    } else if (productName) {
      await askAboutProduct(productName, productType);
    } else if (category) {
      await askForRecommendation(category, requirements);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "help":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "recommend":
        return "bg-purple-500 hover:bg-purple-600 text-white";
      default:
        return "bg-orange-500 hover:bg-orange-600 text-white";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "help":
        return <HelpCircle className="h-4 w-4" />;
      case "recommend":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getDefaultText = () => {
    switch (variant) {
      case "help":
        return "Get Help";
      case "recommend":
        return "Get Recommendations";
      default:
        return "Ask GuruBot";
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || (!query && !productName && !category)}
      size={size}
      className={cn(getVariantStyles(), className)}
    >
      {getIcon()}
      {children || getDefaultText()}
    </Button>
  );
}

interface GuruBotProductCardProps {
  productName: string;
  productType?: string;
  className?: string;
}

/**
 * A floating "Ask about this" button for product cards
 */
export function GuruBotProductCard({ productName, productType, className }: GuruBotProductCardProps) {
  return (
    <GuruBotTriggerButton
      productName={productName}
      productType={productType}
      size="sm"
      variant="ask"
      className={cn("absolute top-2 right-2 h-8 w-8 p-0 rounded-full shadow-lg", className)}
    >
      <MessageCircle className="h-3 w-3" />
      <span className="sr-only">Ask about {productName}</span>
    </GuruBotTriggerButton>
  );
}

interface GuruBotHelpTextProps {
  text: string;
  className?: string;
}

/**
 * Clickable help text that triggers GuruBot
 */
export function GuruBotHelpText({ text, className }: GuruBotHelpTextProps) {
  const { askGuruBot } = useGuruBotTrigger();

  return (
    <button
      onClick={() => askGuruBot(text)}
      className={cn(
        "text-orange-500 hover:text-orange-600 underline underline-offset-2 text-sm transition-colors",
        className
      )}
    >
      {text}
    </button>
  );
}
