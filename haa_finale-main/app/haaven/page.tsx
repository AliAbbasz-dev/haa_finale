"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2, Home, Car, Wrench, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  { icon: Home, text: "What's the typical maintenance schedule for a home?" },
  { icon: Car, text: "When should I change my car's oil?" },
  { icon: Wrench, text: "How often should I service my HVAC system?" },
  { icon: Home, text: "What are signs of a roof leak?" },
  { icon: Car, text: "What does a check engine light usually mean?" },
  { icon: Wrench, text: "How can I prevent plumbing issues?" },
];

export default function PublicHAAvenPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch("/api/haaven/public-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
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
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Sorry, I'm having trouble connecting right now. Please try again.");

      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/Logo.jpg" alt="HAA" width={110} height={110} />
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-black hover:bg-gray-900 text-white rounded-full">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              First HAAven
            </h1>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Your AI-powered home and auto assistant. Get instant answers to maintenance questions, troubleshooting tips, and expert advice — no login required!
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-8 py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-8 bg-primary rounded-3xl shadow-2xl"
                >
                  <Sparkles className="w-20 h-20 text-black" />
                </motion.div>

                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-bold text-gray-800">Ask Me Anything!</h2>
                  <p className="text-gray-600 max-w-lg">
                    I can help with home maintenance, vehicle care, troubleshooting, and general advice. Try one of these questions:
                  </p>
                </div>

                {/* Suggested Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => sendMessage(prompt.text)}
                      className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all group text-left"
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
                      className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                        message.role === "user"
                          ? "bg-primary text-black"
                          : "bg-gray-100 border border-gray-200 text-gray-800"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold text-primary">First HAAven</span>
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
                <div className="bg-gray-100 border border-gray-200 rounded-2xl px-5 py-4">
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
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about home or auto maintenance..."
                  className="resize-none min-h-[60px] max-h-[200px] rounded-xl border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                  rows={1}
                />
              </div>
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-primary hover:bg-primary-600 text-black rounded-xl h-[60px] px-6 shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Try First HAAven for free! Sign up to save your conversation history and access personalized features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
