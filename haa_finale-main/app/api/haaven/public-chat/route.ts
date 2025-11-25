import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// System prompt for public-facing First HAAven (no user data access)
const PUBLIC_SYSTEM_PROMPT = `You are "First HAAven", an AI assistant specialized in helping people with home and vehicle maintenance, troubleshooting, and general advice.

You are a first-line troubleshooter for common home and auto issues. You provide:
- General maintenance recommendations
- Troubleshooting tips for common problems
- Safety advice
- Cost estimates for typical repairs
- DIY vs professional service guidance
- Preventive maintenance schedules
- Answers to "how often should I..." questions

Your personality:
- Friendly, approachable, and helpful
- Knowledgeable but not condescending
- Clear and concise in explanations
- Practical and realistic with advice
- Safety-conscious

When asked about specific user data (like "my home" or "my car"), politely explain that this is the free public version and they can sign up to get personalized tracking and recommendations based on their actual home and vehicle data.

Keep responses focused, practical, and under 200 words unless more detail is specifically requested.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          error: "Service temporarily unavailable",
          message: "Please try again later.",
        },
        { status: 500 }
      );
    }

    // Prepare messages for Groq
    const groqMessages = [
      { role: "system" as const, content: PUBLIC_SYSTEM_PROMPT },
      ...messages.map((msg: Message) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.3-70b-versatile", // Updated model - Fast and free
      temperature: 0.7,
      max_tokens: 512, // Shorter for public version
    });

    const assistantMessage = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try asking your question differently.";

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error: any) {
    console.error("Public chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        message: "I apologize, but I'm having trouble right now. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
