"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useGuruBot } from "@/providers/gurubot-provider";
import { ConversationHistoryResponse, ConversationMessage } from "@/types/gurubot";
import { Markdown } from "./markdown";

interface FullPageChatWindowProps {
  conversationId: string | null;
  onConversationStart: (conversationId: string) => void;
}

export function FullPageChatWindow({
  conversationId,
  onConversationStart,
}: FullPageChatWindowProps) {
  const { state, sendMessage } = useGuruBot();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation history
  const fetchConversationHistory = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/conversations/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch conversation: ${response.status}`);
      }

      const data: ConversationHistoryResponse = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversation");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const messageText = inputValue;
    setInputValue("");
    
    try {
      // Add user message to local state immediately
      const userMessage: ConversationMessage = {
        text: messageText,
        role: "user",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      // Send message using GuruBot provider
      await sendMessage(messageText);
      
      // If this is a new conversation and we get a conversation ID, notify parent
      if (!conversationId && state.conversationId) {
        onConversationStart(state.conversationId);
      }

    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversation history when conversationId changes
  useEffect(() => {
    if (conversationId) {
      fetchConversationHistory(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  // Update messages from GuruBot state
  useEffect(() => {
    if (state.messages.length > 0 && (!conversationId || conversationId === state.conversationId)) {
      const formattedMessages: ConversationMessage[] = state.messages.map(msg => ({
        text: msg.text,
        role: msg.role,
        timestamp: msg.timestamp,
      }));
      setMessages(formattedMessages);
    }
  }, [state.messages, conversationId, state.conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-6 bg-white hidden sm:block dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              GuruBot
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your AI financial advisor
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="h-[70vh] p-6">
        <div className="space-y-6 max-w-[90%] mx-auto">
          {/* Welcome Message */}
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to GuruBot!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                I&apos;m here to help you with financial advice, product comparisons, and answer any banking questions you might have.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex space-x-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-5xl ${
                  message.role === "user"
                    ? "bg-orange-600 text-white rounded-2xl rounded-br-sm px-4 py-3"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <Markdown>{message.text}</Markdown>
                  </div>
                ) : (
                  <p className="text-sm">{message.text}</p>
                )}
                
                <div
                  className={`text-xs mt-2 ${
                    message.role === "user"
                      ? "text-orange-100"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {(isLoading || state.isLoading) && (
            <div className="flex space-x-4 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    GuruBot is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask GuruBot anything about finance, banking, or products..."
              className="flex-1 h-12 text-base"
              disabled={isLoading || state.isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || state.isLoading}
              className="h-12 px-6 bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          {/* <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("What are the best savings accounts available?")}
              disabled={isLoading || state.isLoading}
            >
              Best savings accounts
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("Compare credit cards with no annual fee")}
              disabled={isLoading || state.isLoading}
            >
              No-fee credit cards
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("What should I know about investment options?")}
              disabled={isLoading || state.isLoading}
            >
              Investment advice
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
