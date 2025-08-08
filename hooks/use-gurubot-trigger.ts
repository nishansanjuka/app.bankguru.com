"use client";

import { useGuruBot } from "@/providers/gurubot-provider";
import { useCallback } from "react";

/**
 * Hook for triggering GuruBot queries from anywhere in the application
 * This allows components to send queries to GuruBot without needing to render the chat interface
 */
export function useGuruBotTrigger() {
  const { triggerQuery, openChat, state } = useGuruBot();

  /**
   * Send a query to GuruBot and open the chat window
   * @param query - The question or prompt to send to GuruBot
   */
  const askGuruBot = useCallback(
    async (query: string) => {
      await triggerQuery(query);
    },
    [triggerQuery]
  );

  /**
   * Open the GuruBot chat window without sending a message
   */
  const showGuruBot = useCallback(() => {
    openChat();
  }, [openChat]);

  /**
   * Send a predefined query based on context
   * Useful for creating "Ask about this" buttons throughout the app
   */
  const askAboutProduct = useCallback(
    async (productName: string, productType?: string) => {
      const query = productType 
        ? `Tell me more about ${productName} ${productType}`
        : `Tell me more about ${productName}`;
      await askGuruBot(query);
    },
    [askGuruBot]
  );

  const askAboutComparison = useCallback(
    async (items: string[]) => {
      const query = `Compare these options: ${items.join(", ")}`;
      await askGuruBot(query);
    },
    [askGuruBot]
  );

  const askForRecommendation = useCallback(
    async (category: string, requirements?: string) => {
      const query = requirements
        ? `Recommend the best ${category} for someone who ${requirements}`
        : `What are the best ${category} options available?`;
      await askGuruBot(query);
    },
    [askGuruBot]
  );

  return {
    askGuruBot,
    showGuruBot,
    askAboutProduct,
    askAboutComparison,
    askForRecommendation,
    isLoading: state.isLoading,
    isOpen: state.isOpen,
  };
}
