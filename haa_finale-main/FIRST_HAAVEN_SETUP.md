# First HAAven AI Assistant - Setup Guide

## 🎉 What's New

**First HAAven** is now integrated into your HAA dashboard! It's an AI-powered assistant that helps users manage their homes and vehicles with intelligent recommendations and answers.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Free Groq API Key

1. Go to **https://console.groq.com**
2. Click **"Sign Up"** (completely FREE, no credit card required)
3. After signing in, go to **"API Keys"** section
4. Click **"Create API Key"**
5. Give it a name (e.g., "HAA First HAAven")
6. Copy the generated API key

### Step 2: Add API Key to Your Project

1. Open your `.env.local` file (in the root of your project)
2. Add this line:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```
   (Replace `gsk_your_key_here` with your actual key from Step 1)

3. Save the file

### Step 3: Run Database Migration

Run this SQL in your **Supabase SQL Editor**:

```sql
-- Copy and paste the contents of:
scripts/haaven_assistant_schema.sql
```

This creates the `haaven_conversations` table to store chat history.

### Step 4: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ You're Done!

Visit **http://localhost:3000/haaven-assistant** (or click "First HAAven" in the sidebar) to start chatting!

---

## 🎯 Features

### What First HAAven Can Do:

✅ **Access ALL user data:**
- Homes and their details
- Vehicles and service history
- Maintenance logs and schedules
- Repair records
- Upcoming tasks and notifications

✅ **Smart Assistance:**
- Answer questions about specific properties or vehicles
- Provide maintenance recommendations
- Analyze costs and trends
- Suggest priorities
- Set up reminders

✅ **Examples of questions users can ask:**
- "What maintenance is due for my homes?"
- "Show me my vehicle service history"
- "What's the total I spent on car repairs this year?"
- "When is my HVAC filter change due?"
- "What should I prioritize this month?"
- "How much have I spent on home maintenance?"

---

## 🔧 Technical Details

### Architecture:
```
User → Chat UI → Next.js API Route → Groq API (Llama 3.1 70B) → Response
                       ↓
                  Supabase (User Data Context)
```

### Files Created:
1. **`app/(dashboard)/haaven-assistant/page.tsx`** - Chat interface UI
2. **`app/api/haaven/chat/route.ts`** - API endpoint with context injection
3. **`scripts/haaven_assistant_schema.sql`** - Database schema
4. **`lib/supabase.ts`** - Updated with conversation types

### Files Modified:
1. **`components/layout/sidebar.tsx`** - Added "First HAAven" navigation item
2. **`package.json`** - Added `groq-sdk` dependency

---

## 🔒 Privacy & Security

- ✅ User data stays in YOUR Supabase database
- ✅ Only sends **relevant context** to Groq (not entire database)
- ✅ Conversations stored with Row Level Security (RLS)
- ✅ Users can only see their own chat history
- ✅ No personal data stored on Groq servers (stateless API)

---

## 💰 Costs

**100% FREE!**
- Groq offers **14,400 requests/day** for free
- Using Llama 3.1 70B model (fast & powerful)
- No credit card required
- No hidden fees

If you need more capacity later, Groq has very affordable paid plans.

---

## 🐛 Troubleshooting

### Error: "GROQ_API_KEY not configured"
**Solution:** Make sure you added `GROQ_API_KEY=your_key` to `.env.local` and restarted the dev server.

### Error: "Failed to insert conversation"
**Solution:** Run the database migration SQL (`scripts/haaven_assistant_schema.sql`) in Supabase.

### Chat not loading user data
**Solution:** Verify that the user has homes/vehicles added in the dashboard. The AI will say "No homes registered" if there's no data.

### API errors in console
**Solution:** Check that your Groq API key is valid. Try generating a new one at https://console.groq.com

---

## 🎨 Customization

### Change AI Model:
Edit `app/api/haaven/chat/route.ts`:
```typescript
model: "llama-3.1-70b-versatile", // Fast, balanced
// OR
model: "llama-3.1-8b-instant",   // Faster, cheaper
// OR
model: "mixtral-8x7b-32768",     // More creative
```

### Modify System Prompt:
Edit the `SYSTEM_PROMPT` constant in `app/api/haaven/chat/route.ts` to change First HAAven's personality or capabilities.

### Add More Context:
Edit the `fetchUserContext()` function in `app/api/haaven/chat/route.ts` to include additional data from your database.

---

## 📊 Monitoring Usage

Check your Groq usage at: https://console.groq.com/usage

You'll see:
- Requests per day
- Tokens used
- Response times

---

## 🚀 Future Enhancements (Optional)

Ideas for v2:
- Voice input/output
- Image analysis (OCR receipts, documents)
- Automatic task creation from conversations
- Proactive notifications based on AI insights
- Integration with calendar for scheduling
- Multi-language support

---

## ✅ Verification Checklist

Before going live:
- [ ] Groq API key added to `.env.local`
- [ ] Database migration run in Supabase
- [ ] Dev server restarted
- [ ] Chat interface loads at `/haaven-assistant`
- [ ] Test message sends successfully
- [ ] AI responds with relevant data
- [ ] Conversation saved to database

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check server terminal for errors
3. Verify Supabase connection
4. Test Groq API key at https://console.groq.com

---

**Enjoy First HAAven! Your users will love it.** ✨
