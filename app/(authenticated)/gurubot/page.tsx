"use client";

import { useState, useEffect } from "react";
import { useGuruBot } from "@/providers/gurubot-provider";
import { ConversationHistory } from "@/components/gurubot/conversation-history";
import { FullPageChatWindow } from "@/components/gurubot/full-page-chat-window";

export default function GuruBotPage() {
  const { state } = useGuruBot();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    state.conversationId
  );

  // Update selected conversation when GuruBot state changes
  useEffect(() => {
    if (state.conversationId && state.conversationId !== selectedConversationId) {
      setSelectedConversationId(state.conversationId);
    }
  }, [state.conversationId, selectedConversationId]);

  return (
    <div className=" bg-gray-50 dark:bg-gray-900">
      <div className="h-full grid grid-cols-12 gap-0">
        {/* History Panel - 3 columns */}
        <div className="col-span-5 lg:col-span-3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <ConversationHistory
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>

        {/* Chat Window - 9 columns */}
        <div className="col-span-7 lg:col-span-9 bg-white dark:bg-gray-900">
          <FullPageChatWindow
            conversationId={selectedConversationId}
            onConversationStart={(id: string) => setSelectedConversationId(id)}
          />
        </div>
      </div>
    </div>
  );
}
