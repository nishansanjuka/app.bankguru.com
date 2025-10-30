"use client";

import { useState, useEffect } from "react";
import { useGuruBot } from "@/providers/gurubot-provider";
import { ConversationHistory } from "@/components/gurubot/conversation-history";
import { FullPageChatWindow } from "@/components/gurubot/full-page-chat-window";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bot, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function GuruBotPage() {
  const { state } = useGuruBot();
  const isMobile = useIsMobile();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(state.conversationId);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Update selected conversation when GuruBot state changes
  useEffect(() => {
    if (
      state.conversationId &&
      state.conversationId !== selectedConversationId
    ) {
      setSelectedConversationId(state.conversationId);
    }
  }, [state.conversationId, selectedConversationId]);

  // Close history panel when conversation is selected on mobile
  const handleConversationSelect = (id: string | null) => {
    setSelectedConversationId(id);
    if (isMobile) {
      setIsHistoryOpen(false);
    }
  };

  // Close history panel when new conversation starts on mobile
  const handleConversationStart = (id: string) => {
    setSelectedConversationId(id);
    if (isMobile) {
      setIsHistoryOpen(false);
    }
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Mobile Header */}
      {/* {isMobile && (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <ConversationHistory
                  selectedConversationId={selectedConversationId}
                  onSelectConversation={handleConversationSelect}
                />
              </SheetContent>
            </Sheet>
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
          {selectedConversationId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedConversationId(null)}
              className="text-xs"
            >
              New Chat
            </Button>
          )}
        </div>
      )} */}

      {/* Desktop Layout */}
      {!isMobile ? (
        <div className="flex-1 grid grid-cols-12 gap-0 2xl:pt-8">
          {/* History Panel - Desktop */}
          <div className="col-span-4 xl:col-span-3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <ConversationHistory
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
            />
          </div>

          {/* Chat Window - Desktop */}
          <div className="col-span-8 xl:col-span-9 bg-white dark:bg-gray-900">
            <FullPageChatWindow
              conversationId={selectedConversationId}
              onConversationStart={setSelectedConversationId}
            />
          </div>
        </div>
      ) : (
        /* Mobile Layout */
        <div className="flex-1 bg-white dark:bg-gray-900">
          <FullPageChatWindow
            conversationId={selectedConversationId}
            onConversationStart={handleConversationStart}
          />
        </div>
      )}
    </div>
  );
}
