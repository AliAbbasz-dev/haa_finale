import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// System prompt that defines First HAAven's personality and capabilities
const SYSTEM_PROMPT = `You are "First HAAven", an AI assistant specialized in helping homeowners and vehicle owners manage their properties and automobiles.

You have access to the user's complete data including:
- Homes and their details (address, rooms, features, maintenance history)
- Vehicles and their information (make, model, service history, repairs)
- Maintenance logs and schedules
- Repair records and warranties
- Upcoming tasks and notifications

Your capabilities:
- Answer questions about their homes and vehicles
- Provide maintenance recommendations based on their data
- Remind them of upcoming services or tasks
- Analyze costs and trends
- Suggest priorities and improvements
- Help them make informed decisions

Personality:
- Friendly and helpful
- Knowledgeable about home and auto maintenance
- Proactive in suggesting improvements
- Clear and concise in explanations
- Use data from their records to give personalized advice

When you don't have specific data, be honest about it and offer general advice.
Always be encouraging and positive while being realistic about costs and timelines.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          error: "GROQ_API_KEY not configured",
          message: "Please add your Groq API key to .env.local file. Get one free at https://console.groq.com",
        },
        { status: 500 }
      );
    }

    const supabase = createClient();

    // Fetch user's context data
    const context = await fetchUserContext(supabase, userId);

    // Build context-aware system message
    const contextualSystemPrompt = `${SYSTEM_PROMPT}

USER'S DATA:
${context}

Use this data to provide personalized, specific answers. When mentioning specific items, refer to them by their nicknames or identifiers.`;

    // Prepare messages for Groq
    const groqMessages = [
      { role: "system" as const, content: contextualSystemPrompt },
      ...messages.map((msg: Message) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.1-70b-versatile", // Fast and free
      temperature: 0.7,
      max_tokens: 1024,
    });

    const assistantMessage = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // Save conversation to database
    let newConversationId = conversationId;

    if (!conversationId) {
      // Create new conversation
      const { data, error } = await supabase
        .from("haaven_conversations")
        .insert({
          user_id: userId,
          title: messages[0]?.content.substring(0, 50) || "New Conversation",
          messages: [...messages, { role: "assistant", content: assistantMessage, timestamp: new Date().toISOString() }],
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating conversation:", error);
      } else {
        newConversationId = data.id;
      }
    } else {
      // Update existing conversation
      const { error } = await supabase
        .from("haaven_conversations")
        .update({
          messages: [...messages, { role: "assistant", content: assistantMessage, timestamp: new Date().toISOString() }],
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId);

      if (error) {
        console.error("Error updating conversation:", error);
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      conversationId: newConversationId,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Fetch all relevant user data to provide context to the LLM
async function fetchUserContext(supabase: any, userId: string): Promise<string> {
  let contextParts: string[] = [];

  try {
    // Fetch homes
    const { data: homes } = await supabase
      .from("homes")
      .select("*")
      .eq("user_id", userId);

    if (homes && homes.length > 0) {
      contextParts.push(`HOMES (${homes.length} total):`);
      homes.forEach((home: any, index: number) => {
        contextParts.push(`  ${index + 1}. ${home.nickname || "Unnamed"} - ${home.address || "No address"}`);
      });
    } else {
      contextParts.push("HOMES: No homes registered yet.");
    }

    // Fetch vehicles
    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", userId);

    if (vehicles && vehicles.length > 0) {
      contextParts.push(`\nVEHICLES (${vehicles.length} total):`);
      vehicles.forEach((vehicle: any, index: number) => {
        contextParts.push(
          `  ${index + 1}. ${vehicle.year || ""} ${vehicle.make || ""} ${vehicle.model || ""} - ${vehicle.nickname || "Unnamed"}`
        );
        if (vehicle.mileage) {
          contextParts.push(`     Mileage: ${vehicle.mileage.toLocaleString()} miles`);
        }
      });
    } else {
      contextParts.push("\nVEHICLES: No vehicles registered yet.");
    }

    // Fetch maintenance logs
    const { data: maintenanceLogs } = await supabase
      .from("maintenance_logs")
      .select("*")
      .eq("user_id", userId)
      .order("service_date", { ascending: false })
      .limit(10);

    if (maintenanceLogs && maintenanceLogs.length > 0) {
      contextParts.push(`\nRECENT MAINTENANCE (last ${maintenanceLogs.length} records):`);
      maintenanceLogs.forEach((log: any) => {
        const date = new Date(log.service_date).toLocaleDateString();
        contextParts.push(`  - ${log.service_type} on ${date} (Cost: $${log.cost || "N/A"})`);
        if (log.next_due_date) {
          contextParts.push(`    Next due: ${new Date(log.next_due_date).toLocaleDateString()}`);
        }
      });
    } else {
      contextParts.push("\nMAINTENANCE: No maintenance records yet.");
    }

    // Fetch repair logs
    const { data: repairLogs } = await supabase
      .from("repair_logs")
      .select("*")
      .eq("user_id", userId)
      .order("service_date", { ascending: false })
      .limit(10);

    if (repairLogs && repairLogs.length > 0) {
      contextParts.push(`\nRECENT REPAIRS (last ${repairLogs.length} records):`);
      repairLogs.forEach((log: any) => {
        const date = new Date(log.service_date).toLocaleDateString();
        contextParts.push(`  - ${log.repair_type} on ${date} (Cost: $${log.cost || "N/A"})`);
        if (log.warranty) {
          contextParts.push(`    Warranty: ${log.warranty}`);
        }
      });
    } else {
      contextParts.push("\nREPAIRS: No repair records yet.");
    }

    // Fetch notifications/upcoming tasks
    const { data: notifications } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("is_read", false)
      .order("due_date", { ascending: true })
      .limit(5);

    if (notifications && notifications.length > 0) {
      contextParts.push(`\nUPCOMING TASKS (${notifications.length} pending):`);
      notifications.forEach((notif: any) => {
        const dueDate = notif.due_date ? new Date(notif.due_date).toLocaleDateString() : "No date";
        contextParts.push(`  - ${notif.message} (Due: ${dueDate})`);
      });
    } else {
      contextParts.push("\nUPCOMING TASKS: No pending tasks.");
    }

    return contextParts.join("\n");
  } catch (error) {
    console.error("Error fetching user context:", error);
    return "Unable to fetch user data at this time.";
  }
}
