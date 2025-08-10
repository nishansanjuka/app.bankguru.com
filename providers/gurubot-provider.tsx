"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  GuruBotContextValue,
  GuruBotState,
  GuruBotResponse,
  GuruBotRequest,
  ProductChatRequest,
  ProductChatResponse,
} from "@/types/gurubot";
import {
  ProductComparisonRequest,
  ProductComparisonResponse,
} from "@/types/product-comparison";
import { useClerk, useUser } from "@clerk/nextjs";

// Initial state
const initialState: GuruBotState = {
  isOpen: false,
  isLoading: false,
  conversationId: null,
  messages: [],
  error: null,
};

// Action types
type GuruBotAction =
  | { type: "TOGGLE_CHAT" }
  | { type: "OPEN_CHAT" }
  | { type: "CLOSE_CHAT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "ADD_MESSAGE";
      payload: {
        text: string;
        role: "user" | "assistant";
        type?: "text" | "comparison" | "markdown";
        metadata?: {
          productIds?: string[];
          comparisonData?: Record<string, unknown>;
        };
      };
    }
  | { type: "SET_CONVERSATION_ID"; payload: string }
  | { type: "SET_MESSAGES"; payload: GuruBotState["messages"] }
  | { type: "CLEAR_CONVERSATION" };

// Reducer
function guruBotReducer(
  state: GuruBotState,
  action: GuruBotAction
): GuruBotState {
  switch (action.type) {
    case "TOGGLE_CHAT":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CHAT":
      return { ...state, isOpen: true };
    case "CLOSE_CHAT":
      return { ...state, isOpen: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            text: action.payload.text,
            role: action.payload.role,
            timestamp: new Date().toISOString(),
            type: action.payload.type || "text",
            metadata: action.payload.metadata,
          },
        ],
      };
    case "SET_CONVERSATION_ID":
      return { ...state, conversationId: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "CLEAR_CONVERSATION":
      return {
        ...state,
        conversationId: null,
        messages: [],
        error: null,
      };
    default:
      return state;
  }
}

// Context
const GuruBotContext = createContext<GuruBotContextValue | undefined>(
  undefined
);

// Provider component
export function GuruBotProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(guruBotReducer, initialState);

  const { isSignedIn } = useUser();
  const { redirectToSignIn } = useClerk();

  // API call function for regular chat
  const callGuruBotAPI = useCallback(
    async (request: GuruBotRequest): Promise<GuruBotResponse> => {
      const response = await fetch("/api/gurubot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    []
  );

  // API call function for product chat
  const callProductChatAPI = useCallback(
    async (request: ProductChatRequest): Promise<ProductChatResponse> => {
      const response = await fetch("/api/product-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    []
  );
  const callCompareProductsAPI = useCallback(
    async (
      request: ProductComparisonRequest
    ): Promise<ProductComparisonResponse> => {
      const response = await fetch("/api/compare-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    []
  );

  // Compare products function
  const compareProducts = useCallback(
    async (productIds: string[]) => {
      if (!productIds || productIds.length === 0) return;

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "OPEN_CHAT" });

      // Create new conversation for comparison
      dispatch({ type: "CLEAR_CONVERSATION" });

      // Add user message about comparison request
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          text: `Please compare these ${productIds.length} products and provide detailed analysis with product images and features.`,
          role: "user",
        },
      });

      try {
        const request: ProductComparisonRequest = {
          product_ids: productIds,
          conversation_id: undefined, // Always start new conversation for comparison
        };

        const response = await callCompareProductsAPI(request);

        // Set the new conversation ID from response
        if (response.conversation_id) {
          dispatch({
            type: "SET_CONVERSATION_ID",
            payload: response.conversation_id,
          });
        }

        // Add assistant response with comparison data
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            text: response.summary,
            role: "assistant",
            type: "comparison",
            metadata: {
              productIds,
              comparisonData: {
                comparison: response.comparison,
                products: response.products,
              },
            },
          },
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to compare products";
        dispatch({ type: "SET_ERROR", payload: errorMessage });

        // Add error message to chat
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            text: `Sorry, I encountered an error while comparing products: ${errorMessage}. Please try again.`,
            role: "assistant",
          },
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [callCompareProductsAPI]
  );

  // Ask about product function
  const askAboutProduct = useCallback(
    async (query: string, productId: string) => {
      if (!query.trim() || !productId) return;

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "OPEN_CHAT" });

      // Add user message immediately
      dispatch({ type: "ADD_MESSAGE", payload: { text: query, role: "user" } });

      try {
        const request: ProductChatRequest = {
          query,
          product_id: productId,
          conversation_id: state.conversationId || undefined,
          include_history: true,
        };

        const response = await callProductChatAPI(request);

        // Update conversation ID if it's new
        if (
          response.conversation_id &&
          response.conversation_id !== state.conversationId
        ) {
          dispatch({
            type: "SET_CONVERSATION_ID",
            payload: response.conversation_id,
          });
        }

        // Add assistant response
        dispatch({
          type: "ADD_MESSAGE",
          payload: { text: response.answer, role: "assistant" },
        });

        // Update messages with full history if provided
        if (response.history && response.history.length > 0) {
          const formattedHistory = response.history.map((item) => ({
            text: item.text,
            role: item.role as "user" | "assistant",
            timestamp: item.timestamp,
            type: "text" as const,
          }));
          dispatch({ type: "SET_MESSAGES", payload: formattedHistory });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to get product information";
        dispatch({ type: "SET_ERROR", payload: errorMessage });

        // Add error message to chat
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            text: `Sorry, I encountered an error while getting product information: ${errorMessage}. Please try again.`,
            role: "assistant",
          },
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [state.conversationId, callProductChatAPI]
  );

  // Send message function
  const sendMessage = useCallback(
    async (query: string) => {
      if (!isSignedIn) {
        await redirectToSignIn();
      } else {
        if (!query.trim()) return;

        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        // Add user message immediately
        dispatch({
          type: "ADD_MESSAGE",
          payload: { text: query, role: "user" },
        });

        try {
          const request: GuruBotRequest = {
            query,
            conversation_id: state.conversationId || undefined,
            include_history: true,
          };

          const response = await callGuruBotAPI(request);

          // Update conversation ID if it's new
          if (
            response.conversation_id &&
            response.conversation_id !== state.conversationId
          ) {
            dispatch({
              type: "SET_CONVERSATION_ID",
              payload: response.conversation_id,
            });
          }

          // Add assistant response
          dispatch({
            type: "ADD_MESSAGE",
            payload: { text: response.answer, role: "assistant" },
          });

          // Update messages with full history if provided
          if (response.history && response.history.length > 0) {
            dispatch({ type: "SET_MESSAGES", payload: response.history });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to send message";
          dispatch({ type: "SET_ERROR", payload: errorMessage });

          // Add error message to chat
          dispatch({
            type: "ADD_MESSAGE",
            payload: {
              text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
              role: "assistant",
            },
          });
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSignedIn, state.conversationId, callGuruBotAPI]
  );

  // Trigger query from anywhere (opens chat and sends message)
  const triggerQuery = useCallback(
    async (query: string) => {
      dispatch({ type: "OPEN_CHAT" });
      await sendMessage(query);
    },
    [sendMessage]
  );

  // Chat control functions
  const toggleChat = useCallback(() => {
    dispatch({ type: "TOGGLE_CHAT" });
  }, []);

  const openChat = useCallback(() => {
    dispatch({ type: "OPEN_CHAT" });
  }, []);

  const closeChat = useCallback(() => {
    dispatch({ type: "CLOSE_CHAT" });
  }, []);

  const clearConversation = useCallback(() => {
    dispatch({ type: "CLEAR_CONVERSATION" });
  }, []);

  const setConversationId = useCallback((conversationId: string | null) => {
    if (conversationId) {
      dispatch({ type: "SET_CONVERSATION_ID", payload: conversationId });
    } else {
      dispatch({ type: "CLEAR_CONVERSATION" });
    }
  }, []);

  const contextValue: GuruBotContextValue = {
    state,
    sendMessage,
    toggleChat,
    openChat,
    closeChat,
    clearConversation,
    triggerQuery,
    compareProducts,
    askAboutProduct,
    setConversationId,
  };

  return (
    <GuruBotContext.Provider value={contextValue}>
      {children}
    </GuruBotContext.Provider>
  );
}

// Hook to use GuruBot context
export function useGuruBot() {
  const context = useContext(GuruBotContext);
  if (context === undefined) {
    throw new Error("useGuruBot must be used within a GuruBotProvider");
  }
  return context;
}
