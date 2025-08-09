"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useGuruBot } from "@/providers/gurubot-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ComparisonMessage } from "./comparison-message";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  MessageCircle,
  Send,
  X,
  Maximize2,
  Minimize,
  RotateCcw,
  Bot,
  User,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface GuruBotProps {
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export function GuruBot({
  className,
  position = "bottom-right",
}: GuruBotProps) {
  const { state, sendMessage, toggleChat, closeChat, clearConversation } =
    useGuruBot();
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Enhanced auto-scroll with smooth behavior and better timing
  const scrollToBottom = useCallback((force = false) => {
    if (messagesEndRef.current) {
      // Check if user is near bottom before auto-scrolling (unless forced)
      const scrollContainer = scrollAreaRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer && !force) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        if (!isNearBottom) return; // Don't auto-scroll if user scrolled up
      }

      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => scrollToBottom(true), 100);
    return () => clearTimeout(timer);
  }, [state.messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (state.isOpen && !isMinimized) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [state.isOpen, isMinimized]);

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.isOpen) {
        closeChat();
      }
    };

    if (state.isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [state.isOpen, closeChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || state.isLoading) return;

    const message = inputValue;
    setInputValue("");

    // Scroll to bottom immediately when user sends message
    setTimeout(() => scrollToBottom(true), 50);

    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
    // Scroll to bottom after animation
    setTimeout(() => scrollToBottom(true), 300);
  };

  const getPositionClasses = () => {
    const base = "fixed z-50";
    const positions = {
      "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
      "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
      "top-right": "top-4 right-4 sm:top-6 sm:right-6",
      "top-left": "top-4 left-4 sm:top-6 sm:left-6",
    };
    return `${base} ${positions[position]}`;
  };

  const getChatPositionClasses = () => {
    if (isMaximized) {
      return "fixed inset-4 z-[100]";
    }
    return getPositionClasses();
  };

  const getChatWindowClasses = () => {
    if (isMaximized) {
      return "sm:w-[70vw] sm:h-[80vh] mx-auto z-[100] sm:translate-y-[10vh] max-w-none max-h-none";
    }
    return "w-[320px] sm:w-80 md:w-96 h-[500px] max-h-[80vh]";
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "HH:mm");
    } catch {
      return "";
    }
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Markdown Message Component
  const MarkdownMessage = ({
    content,
    messageId,
  }: {
    content: string;
    messageId: string;
  }) => {
    return (
      <div className="relative group">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // Custom styling for markdown elements
              h1: ({ children }) => (
                <h1 className="text-lg font-bold mb-2 text-foreground">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-semibold mb-2 text-foreground">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold mb-1 text-foreground">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="text-sm">{children}</li>,
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-muted/50 text-foreground px-1 py-0.5 rounded text-xs font-mono">
                      {children}
                    </code>
                  );
                }
                return (
                  <code
                    className={cn(
                      "block bg-muted/30 p-2 rounded text-xs font-mono overflow-x-auto",
                      className
                    )}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-muted/30 p-3 rounded mb-2 overflow-x-auto">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-orange-500/30 pl-3 italic text-muted-foreground mb-2">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 underline"
                >
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-2">
                  <table className="min-w-full border border-muted">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-muted px-2 py-1 bg-muted/30 font-semibold text-xs">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-muted px-2 py-1 text-xs">
                  {children}
                </td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(content, messageId)}
          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-muted"
        >
          {copiedMessageId === messageId ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
    );
  };

  // Floating chat icon
  if (!state.isOpen) {
    return (
      <Button
        onClick={toggleChat}
        size="icon"
        className={cn(
          getPositionClasses(),
          "h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 focus:scale-110",
          " hover:animate-none focus:animate-none backdrop-blur-sm",
          className
        )}
        aria-label="Open GuruBot Chat"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    );
  }

  // Chat window
  return (
    <Card
      className={cn(
        getChatPositionClasses(),
        getChatWindowClasses(),
        "flex flex-col shadow-2xl border-2 transition-all duration-300 backdrop-blur-sm p-0",
        isMinimized && "h-14",
        isMaximized && "rounded-lg",
        !isMaximized && "rounded-xl",
        className
      )}
    >
      {/* Header */}
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white",
          isMaximized ? "rounded-t-lg" : "rounded-t-xl"
        )}
      >
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold truncate">
              GuruBot
            </CardTitle>
            <p className="text-xs opacity-90 truncate">
              {state.isLoading ? "Thinking..." : "Ready to help"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMaximize}
            className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20 transition-colors"
            aria-label={isMaximized ? "Restore window" : "Maximize window"}
          >
            {isMaximized ? (
              <Minimize className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearConversation}
            className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20 transition-colors"
            aria-label="Clear conversation"
          >
            <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeChat}
            className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          {/* Messages */}
          <CardContent className="flex-1 p-0 flex flex-col min-h-0">
            <ScrollArea
              ref={scrollAreaRef}
              className="flex-1 px-3 sm:px-4 py-2 overflow-hidden"
            >
              <div
                ref={messagesContainerRef}
                className="space-y-3 sm:space-y-4 pr-2"
              >
                {state.messages.length === 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <Bot className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-orange-500 mb-3" />
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">
                      Welcome to GuruBot!
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 px-4">
                      Ask me anything about banking, loans, credit cards, and
                      more.
                    </p>
                  </div>
                )}

                {state.messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-2 sm:gap-3 items-end",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[85%] sm:max-w-[75%] rounded-lg px-3 py-2 text-sm break-words",
                        message.role === "user"
                          ? "bg-orange-500 text-white rounded-br-sm"
                          : "bg-muted text-foreground border rounded-bl-sm"
                      )}
                    >
                      {message.role === "assistant" ? (
                        message.type === "comparison" &&
                        message.metadata?.comparisonData ? (
                          <ComparisonMessage summary={message.text} />
                        ) : (
                          <MarkdownMessage
                            content={message.text}
                            messageId={`${index}-${message.timestamp}`}
                          />
                        )
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {message.text}
                        </p>
                      )}
                      {message.timestamp && message.type !== "comparison" && (
                        <p
                          className={cn(
                            "text-xs mt-1.5 opacity-70",
                            message.role === "user"
                              ? "text-orange-100"
                              : "text-muted-foreground"
                          )}
                        >
                          {formatMessageTime(message.timestamp)}
                        </p>
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {state.isLoading && (
                  <div className="flex gap-2 sm:gap-3 justify-start items-end">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="max-w-[75%] rounded-lg px-3 py-2 text-sm bg-muted text-foreground border rounded-bl-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {state.error && (
                  <div className="flex justify-center">
                    <Badge variant="destructive" className="text-xs">
                      Error: {state.error}
                    </Badge>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-1" />
              </div>
            </ScrollArea>

            <Separator />

            {/* Input */}
            <div className="p-3 sm:p-4 bg-background/50 backdrop-blur-sm">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me about banking products..."
                  disabled={state.isLoading}
                  className="flex-1 text-sm resize-none border-muted-foreground/20 focus:border-orange-500"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={state.isLoading || !inputValue.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white transition-colors h-9 w-9"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center hidden sm:block">
                Press Enter to send • Shift+Enter for new line • Esc to close
              </p>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
