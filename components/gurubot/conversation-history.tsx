"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Trash2, Plus, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils/index";
import { Conversation, ConversationsResponse } from "@/types/gurubot";

interface ConversationHistoryProps {
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string | null) => void;
}

export function ConversationHistory({
  selectedConversationId,
  onSelectConversation,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/conversations");
      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }

      const data: ConversationsResponse = await response.json();
      setConversations(data.conversations || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete conversation: ${response.status}`);
      }

      // Remove from local state
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );

      // If this was the selected conversation, clear selection
      if (selectedConversationId === conversationId) {
        onSelectConversation(null);
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  // Start new conversation
  const startNewConversation = () => {
    onSelectConversation(null);
    window.location.reload(); // Reload to reset the state
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="h-16">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Conversations
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your chat history with GuruBot
            </p>
          </div>
          <Button
            onClick={startNewConversation}
            size="icon"
            variant={"outline"}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Conversations List with Proper ScrollArea */}
      <ScrollArea className=" h-[80vh] sm:h-[calc(80vh-3.5rem)]">
        <div className="p-4 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-sm font-medium mb-2">
                {error}
              </div>
              <Button
                onClick={fetchConversations}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                No conversations yet
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Start chatting with GuruBot to see your history here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
                    selectedConversationId === conversation.id &&
                      "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700"
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            selectedConversationId === conversation.id
                              ? "bg-orange-100 dark:bg-orange-800/30"
                              : "bg-gray-100 dark:bg-gray-700"
                          )}
                        >
                          <MessageCircle
                            className={cn(
                              "w-4 h-4",
                              selectedConversationId === conversation.id
                                ? "text-orange-600 dark:text-orange-400"
                                : "text-gray-500 dark:text-gray-400"
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            Conversation
                          </h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Created {formatDate(conversation.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                Updated {formatDate(conversation.updated_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Sticky Footer */}
      {/* <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <Button
          onClick={fetchConversations}
          variant="outline"
          size="sm"
          className="w-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Loading...
            </>
          ) : (
            <RefreshCcw className="w-4 h-4" />
          )}
        </Button>
      </div> */}
    </div>
  );
}
