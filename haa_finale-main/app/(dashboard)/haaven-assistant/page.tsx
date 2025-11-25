"use client";

import { useState, useRef, useEffect } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2, Home, Car, Wrench, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  { icon: Home, text: "What maintenance is due for my homes?" },
  { icon: Car, text: "Show me my vehicle service history" },
  { icon: Wrench, text: "What should I prioritize this month?" },
];

export default function HAAvenAssistantPage() {
  const { user } = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/haaven/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message. Please check your API key configuration.");

      // Add error message to chat
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please make sure your GROQ_API_KEY is configured in your .env.local file.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-primary-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-xl shadow-lg">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              First HAAven
            </h1>
            <p className="text-sm text-gray-600">Your AI Home & Auto Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-6 bg-primary rounded-3xl shadow-2xl"
            >
              <Sparkles className="w-16 h-16 text-black" />
            </motion.div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Welcome to First HAAven!</h2>
              <p className="text-gray-600 max-w-md">
                I have full access to your homes, vehicles, and maintenance data. Ask me anything!
              </p>
            </div>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => sendMessage(prompt.text)}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all group text-left"
                >
                  <prompt.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                    {prompt.text}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-black"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary">First HAAven</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user" ? "text-black/60" : "text-gray-400"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-gray-600">First HAAven is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your homes, vehicles, or maintenance..."
                className="resize-none min-h-[60px] max-h-[200px] pr-12 rounded-2xl border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
                rows={1}
              />
            </div>
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-primary hover:bg-primary-600 text-black rounded-2xl h-[60px] px-6 shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            First HAAven has access to all your data and can help with home & vehicle management
          </p>
        </div>
      </div>
    </div>
  );
}
