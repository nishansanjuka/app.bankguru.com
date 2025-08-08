"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import { GuruBotContextValue, GuruBotState, GuruBotResponse, GuruBotRequest } from "@/types/gurubot";

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
  | { type: "ADD_MESSAGE"; payload: { text: string; role: "user" | "assistant" } }
  | { type: "SET_CONVERSATION_ID"; payload: string }
  | { type: "SET_MESSAGES"; payload: GuruBotState["messages"] }
  | { type: "CLEAR_CONVERSATION" };

// Reducer
function guruBotReducer(state: GuruBotState, action: GuruBotAction): GuruBotState {
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
            ...action.payload,
            timestamp: new Date().toISOString(),
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
const GuruBotContext = createContext<GuruBotContextValue | undefined>(undefined);

// Provider component
export function GuruBotProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(guruBotReducer, initialState);

  // API call function
  const callGuruBotAPI = useCallback(async (request: GuruBotRequest): Promise<GuruBotResponse> => {
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
  }, []);

  // Send message function
  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // Add user message immediately
      dispatch({ type: "ADD_MESSAGE", payload: { text: query, role: "user" } });

      try {
        const request: GuruBotRequest = {
          query,
          conversation_id: state.conversationId || undefined,
          include_history: true,
        };

        const response = await callGuruBotAPI(request);

        // Update conversation ID if it's new
        if (response.conversation_id && response.conversation_id !== state.conversationId) {
          dispatch({ type: "SET_CONVERSATION_ID", payload: response.conversation_id });
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
        const errorMessage = error instanceof Error ? error.message : "Failed to send message";
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
    },
    [state.conversationId, callGuruBotAPI]
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

  const contextValue: GuruBotContextValue = {
    state,
    sendMessage,
    toggleChat,
    openChat,
    closeChat,
    clearConversation,
    triggerQuery,
  };

  return <GuruBotContext.Provider value={contextValue}>{children}</GuruBotContext.Provider>;
}

// Hook to use GuruBot context
export function useGuruBot() {
  const context = useContext(GuruBotContext);
  if (context === undefined) {
    throw new Error("useGuruBot must be used within a GuruBotProvider");
  }
  return context;
}
