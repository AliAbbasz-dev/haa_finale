import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase"; // Import Database type from the client file

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl.trim() === '' || supabaseUrl === 'your-project-url-here') {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL. Please check your .env.local file and ensure it contains a valid Supabase project URL (e.g., https://xxxxx.supabase.co)'
    );
  }

  if (!supabaseAnonKey || supabaseAnonKey.trim() === '' || supabaseAnonKey === 'your-anon-key-here') {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your .env.local file and ensure it contains a valid Supabase anon key'
    );
  }

  // Validate URL format
  try {
    new URL(supabaseUrl.trim());
  } catch (error) {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL format: "${supabaseUrl}". It should be a valid URL starting with https:// (e.g., https://xxxxx.supabase.co). Make sure there are no quotes or extra spaces around the value.`
    );
  }

  return createServerClient<Database>(
    supabaseUrl.trim(),
    supabaseAnonKey.trim(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
