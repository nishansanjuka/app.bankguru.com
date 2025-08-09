export interface GuruBotMessage {
  text: string;
  role: "user" | "assistant";
  timestamp: string;
  type?: "text" | "comparison" | "markdown";
  metadata?: {
    productIds?: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comparisonData?: any;
  };
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

export interface ProductChatSource {
  text: string;
  product_id: string;
  product_name: string;
  relevance: number;
}

export interface ProductChatHistoryItem {
  text: string;
  role: string;
  timestamp: string;
}

export interface ProductChatResponse {
  answer: string;
  sources: ProductChatSource[];
  conversation_id: string;
  query_type: string;
  history: ProductChatHistoryItem[];
}

export interface ProductChatRequest {
  query: string;
  product_id: string;
  conversation_id?: string;
  include_history?: boolean;
}

export interface Conversation {
  id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationsResponse {
  status: string;
  conversations: Conversation[];
}

export interface ConversationMessage {
  text: string;
  role: "user" | "assistant";
  timestamp: string;
}

export interface ConversationHistoryResponse {
  status: string;
  conversation_id: string;
  messages: ConversationMessage[];
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
  compareProducts: (productIds: string[]) => Promise<void>;
  askAboutProduct: (query: string, productId: string) => Promise<void>;
  setConversationId: (conversationId: string | null) => void;
}
