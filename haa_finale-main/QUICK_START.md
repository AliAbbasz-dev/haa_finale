# ⚡ Quick Start - First HAAven AI Assistant

## 📋 3-Step Setup

### 1️⃣ Get Free API Key (2 minutes)
```
1. Visit: https://console.groq.com
2. Sign up (FREE, no credit card)
3. Go to "API Keys" → "Create API Key"
4. Copy the key (starts with "gsk_")
```

### 2️⃣ Add to .env.local (30 seconds)
```bash
# Add this line to your .env.local file:
GROQ_API_KEY=gsk_your_actual_key_here
```

### 3️⃣ Run Database Migration (1 minute)
```sql
-- In Supabase SQL Editor, paste:
-- (Copy from: scripts/haaven_assistant_schema.sql)

CREATE TABLE IF NOT EXISTS haaven_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes, RLS policies, etc. (see full file)
```

### 4️⃣ Restart Server
```bash
# Ctrl+C to stop, then:
npm run dev
```

---

## ✅ Test It

1. Login to dashboard
2. Click **"First HAAven"** in sidebar (sparkle icon ✨)
3. Try: "What homes do I have?"
4. Should see AI response with your data!

---

## 🎯 What's Already Done

✅ **Pricing System** - Fully implemented (Essentials/Premium/Signature)
- Onboarding flow on first login
- Settings page with usage meters
- Plan upgrades/downgrades ready
- All database tables created

✅ **First HAAven AI** - Ready to use
- Chat interface at `/haaven-assistant`
- Full access to user data
- Context-aware responses
- Chat history saved
- Sidebar navigation added

---

## 📁 New Files Created

```
app/
  (dashboard)/
    haaven-assistant/
      page.tsx           ← Chat UI
  api/
    haaven/
      chat/
        route.ts          ← AI endpoint

scripts/
  haaven_assistant_schema.sql  ← Database

lib/
  supabase.ts           ← Updated types
```

---

## 🔑 Important Files to Update

1. **`.env.local`** - Add `GROQ_API_KEY`
2. **Supabase SQL Editor** - Run `haaven_assistant_schema.sql`

That's it!

---

## 💡 Example Prompts Users Can Try

- "What maintenance is due for my homes?"
- "Show me my vehicle service history"
- "What's my total maintenance cost this year?"
- "When is my next oil change due?"
- "List all my properties"
- "What repairs have I done recently?"
- "What should I prioritize this month?"

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not configured" | Add `GROQ_API_KEY` to `.env.local` and restart |
| Database errors | Run migration SQL in Supabase |
| Sidebar doesn't show "First HAAven" | Clear browser cache, restart dev server |
| AI doesn't know user data | Check Supabase connection, verify user has data |

---

## 📊 System Status

✅ Pricing & Plans - **COMPLETE**
✅ First HAAven AI - **COMPLETE**
✅ Database Schema - **READY**
✅ Frontend UI - **READY**
✅ Backend API - **READY**

**Next:** Just add your API key and you're live! 🎉
