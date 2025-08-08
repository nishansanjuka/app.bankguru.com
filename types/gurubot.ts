export interface GuruBotMessage {
  text: string;
  role: "user" | "assistant";
  timestamp: string;
}

export interface GuruBotResponse {
  answer: string;
  sources: string[];
  conversation_id: string;
  query_type: string;
  history: GuruBotMessage[];
}

export interface GuruBotRequest {
  query: string;
  conversation_id?: string;
  include_history?: boolean;
}

export interface GuruBotState {
  isOpen: boolean;
  isLoading: boolean;
  conversationId: string | null;
  messages: GuruBotMessage[];
  error: string | null;
}

export interface GuruBotContextValue {
  state: GuruBotState;
  sendMessage: (query: string) => Promise<void>;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  clearConversation: () => void;
  triggerQuery: (query: string) => Promise<void>;
}
