import { createBrowserClient } from "@supabase/ssr";
// Removed: import { createServerClient } from '@supabase/ssr'
// Removed: import { cookies } from 'next/headers'

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string;
          user_id: string;
          customer_segment: 'residential' | 'landlord' | 'commercial' | 'marketplace';
          plan_id: string;
          plan_tier: string;
          billing_cycle: 'monthly' | 'annual';
          trial_end_date: string | null;
          subscription_status: 'trial' | 'active' | 'past_due' | 'canceled' | 'paused';
          current_period_start: string;
          current_period_end: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          add_ons: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          customer_segment: 'residential' | 'landlord' | 'commercial' | 'marketplace';
          plan_id: string;
          plan_tier: string;
          billing_cycle: 'monthly' | 'annual';
          trial_end_date?: string | null;
          subscription_status?: 'trial' | 'active' | 'past_due' | 'canceled' | 'paused';
          current_period_start?: string;
          current_period_end: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          add_ons?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          customer_segment?: 'residential' | 'landlord' | 'commercial' | 'marketplace';
          plan_id?: string;
          plan_tier?: string;
          billing_cycle?: 'monthly' | 'annual';
          trial_end_date?: string | null;
          subscription_status?: 'trial' | 'active' | 'past_due' | 'canceled' | 'paused';
          current_period_start?: string;
          current_period_end?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          add_ons?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      seats: {
        Row: {
          id: string;
          account_id: string;
          user_id: string | null;
          email: string | null;
          role: 'owner' | 'admin' | 'member' | 'guest';
          status: 'pending' | 'active' | 'revoked';
          invited_at: string;
          accepted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          user_id?: string | null;
          email?: string | null;
          role?: 'owner' | 'admin' | 'member' | 'guest';
          status?: 'pending' | 'active' | 'revoked';
          invited_at?: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          user_id?: string | null;
          email?: string | null;
          role?: 'owner' | 'admin' | 'member' | 'guest';
          status?: 'pending' | 'active' | 'revoked';
          invited_at?: string;
          accepted_at?: string | null;
          created_at?: string;
        };
      };
      property_tiers: {
        Row: {
          id: string;
          home_id: string;
          account_id: string;
          tier: 'premium' | 'signature';
          sqft: number | null;
          bedrooms: number | null;
          bathrooms: number | null;
          is_active: boolean;
          assigned_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          account_id: string;
          tier: 'premium' | 'signature';
          sqft?: number | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          is_active?: boolean;
          assigned_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          account_id?: string;
          tier?: 'premium' | 'signature';
          sqft?: number | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          is_active?: boolean;
          assigned_at?: string;
          created_at?: string;
        };
      };
      units: {
        Row: {
          id: string;
          account_id: string;
          property_id: string | null;
          unit_number: string | null;
          address: string | null;
          status: 'active' | 'vacant' | 'maintenance' | 'archived';
          tenant_name: string | null;
          tenant_email: string | null;
          tenant_phone: string | null;
          lease_start_date: string | null;
          lease_end_date: string | null;
          rent_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          property_id?: string | null;
          unit_number?: string | null;
          address?: string | null;
          status?: 'active' | 'vacant' | 'maintenance' | 'archived';
          tenant_name?: string | null;
          tenant_email?: string | null;
          tenant_phone?: string | null;
          lease_start_date?: string | null;
          lease_end_date?: string | null;
          rent_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          property_id?: string | null;
          unit_number?: string | null;
          address?: string | null;
          status?: 'active' | 'vacant' | 'maintenance' | 'archived';
          tenant_name?: string | null;
          tenant_email?: string | null;
          tenant_phone?: string | null;
          lease_start_date?: string | null;
          lease_end_date?: string | null;
          rent_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sites: {
        Row: {
          id: string;
          account_id: string;
          name: string;
          address: string | null;
          site_type: string | null;
          sqft: number | null;
          status: 'active' | 'inactive' | 'archived';
          manager_name: string | null;
          manager_email: string | null;
          manager_phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          name: string;
          address?: string | null;
          site_type?: string | null;
          sqft?: number | null;
          status?: 'active' | 'inactive' | 'archived';
          manager_name?: string | null;
          manager_email?: string | null;
          manager_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          name?: string;
          address?: string | null;
          site_type?: string | null;
          sqft?: number | null;
          status?: 'active' | 'inactive' | 'archived';
          manager_name?: string | null;
          manager_email?: string | null;
          manager_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          provider_user_id: string;
          customer_user_id: string | null;
          category: string;
          subcategory: string | null;
          complexity: 'low' | 'medium' | 'high';
          price_paid: number;
          zip_code: string;
          description: string | null;
          status: 'new' | 'accepted' | 'contacted' | 'quoted' | 'won' | 'lost' | 'spam';
          credit_eligible: boolean;
          credit_issued: boolean;
          credit_amount: number | null;
          created_at: string;
          updated_at: string;
          credited_at: string | null;
        };
        Insert: {
          id?: string;
          provider_user_id: string;
          customer_user_id?: string | null;
          category: string;
          subcategory?: string | null;
          complexity: 'low' | 'medium' | 'high';
          price_paid: number;
          zip_code: string;
          description?: string | null;
          status?: 'new' | 'accepted' | 'contacted' | 'quoted' | 'won' | 'lost' | 'spam';
          credit_eligible?: boolean;
          credit_issued?: boolean;
          credit_amount?: number | null;
          created_at?: string;
          updated_at?: string;
          credited_at?: string | null;
        };
        Update: {
          id?: string;
          provider_user_id?: string;
          customer_user_id?: string | null;
          category?: string;
          subcategory?: string | null;
          complexity?: 'low' | 'medium' | 'high';
          price_paid?: number;
          zip_code?: string;
          description?: string | null;
          status?: 'new' | 'accepted' | 'contacted' | 'quoted' | 'won' | 'lost' | 'spam';
          credit_eligible?: boolean;
          credit_issued?: boolean;
          credit_amount?: number | null;
          created_at?: string;
          updated_at?: string;
          credited_at?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          account_id: string | null;
          user_id: string;
          type: 'subscription' | 'lead_purchase' | 'add_on' | 'credit' | 'refund';
          amount: number;
          currency: string;
          stripe_payment_id: string | null;
          stripe_invoice_id: string | null;
          description: string | null;
          metadata: any;
          status: 'pending' | 'succeeded' | 'failed' | 'refunded';
          created_at: string;
        };
        Insert: {
          id?: string;
          account_id?: string | null;
          user_id: string;
          type: 'subscription' | 'lead_purchase' | 'add_on' | 'credit' | 'refund';
          amount: number;
          currency?: string;
          stripe_payment_id?: string | null;
          stripe_invoice_id?: string | null;
          description?: string | null;
          metadata?: any;
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded';
          created_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string | null;
          user_id?: string;
          type?: 'subscription' | 'lead_purchase' | 'add_on' | 'credit' | 'refund';
          amount?: number;
          currency?: string;
          stripe_payment_id?: string | null;
          stripe_invoice_id?: string | null;
          description?: string | null;
          metadata?: any;
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded';
          created_at?: string;
        };
      };
      usage_limits: {
        Row: {
          id: string;
          account_id: string;
          limit_type: string;
          current_usage: number;
          max_limit: number | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          limit_type: string;
          current_usage?: number;
          max_limit?: number | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          limit_type?: string;
          current_usage?: number;
          max_limit?: number | null;
          updated_at?: string;
        };
      };
      haaven_conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          messages: any; // Array of {role: 'user'|'assistant', content: string, timestamp: string}
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          messages?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          messages?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      homes: {
        Row: {
          id: string;
          user_id: string;
          nickname: string | null;
          address: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nickname?: string | null;
          address?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nickname?: string | null;
          address?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      rooms: {
        Row: {
          id: string;
          home_id: string;
          user_id: string;
          name: string | null;
          paint_color: string | null;
          flooring: string | null;
          installer: string | null;
          purchase_from: string | null;
          warranty_json: any | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          user_id: string;
          name?: string | null;
          paint_color?: string | null;
          flooring?: string | null;
          installer?: string | null;
          purchase_from?: string | null;
          warranty_json?: any | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          user_id?: string;
          name?: string | null;
          paint_color?: string | null;
          flooring?: string | null;
          installer?: string | null;
          purchase_from?: string | null;
          warranty_json?: any | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      outside_items: {
        Row: {
          id: string;
          home_id: string;
          user_id: string;
          name: string | null;
          type: string | null;
          notes: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          user_id: string;
          name?: string | null;
          type?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          user_id?: string;
          name?: string | null;
          type?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          home_id: string;
          user_id: string;
          item_name: string | null;
          cost: number | null;
          purchase_date: string | null;
          warranty_end_date: string | null;
          notes: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          user_id: string;
          item_name?: string | null;
          cost?: number | null;
          purchase_date?: string | null;
          warranty_end_date?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          user_id?: string;
          item_name?: string | null;
          cost?: number | null;
          purchase_date?: string | null;
          warranty_end_date?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      home_maintenance: {
        Row: {
          id: string;
          home_id: string;
          user_id: string;
          task_name: string | null;
          due_date: string | null;
          is_completed: boolean;
          notes: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          user_id: string;
          task_name?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          user_id?: string;
          task_name?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      home_improvements: {
        Row: {
          id: string;
          home_id: string;
          user_id: string;
          project_name: string | null;
          completion_date: string | null;
          notes: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          user_id: string;
          project_name?: string | null;
          completion_date?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          user_id?: string;
          project_name?: string | null;
          completion_date?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          make: string | null;
          model: string | null;
          year: number | null;
          nickname: string | null;
          mileage: number | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          make?: string | null;
          model?: string | null;
          year?: number | null;
          nickname?: string | null;
          mileage?: number | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          make?: string | null;
          model?: string | null;
          year?: number | null;
          nickname?: string | null;
          mileage?: number | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      vehicle_maintenance: {
        Row: {
          id: string;
          vehicle_id: string;
          user_id: string;
          service_company: string | null;
          service_type: string | null;
          service_date: string | null;
          mileage: number | null;
          cost: number | null;
          notes: string | null;
          image_url: string | null;
          next_service_mileage: number | null;
          next_service_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          user_id: string;
          service_company?: string | null;
          service_type?: string | null;
          service_date?: string | null;
          mileage?: number | null;
          cost?: number | null;
          notes?: string | null;
          image_url?: string | null;
          next_service_mileage?: number | null;
          next_service_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          user_id?: string;
          service_type?: string | null;
          service_date?: string | null;
          mileage?: number | null;
          cost?: number | null;
          notes?: string | null;
          image_url?: string | null;
          next_service_mileage?: number | null;
          next_service_date?: string | null;
          created_at?: string;
        };
      };
      vehicle_repairs: {
        Row: {
          id: string;
          vehicle_id: string;
          user_id: string;
          repair_type: string | null;
          service_date: string | null;
          mileage: number | null;
          cost: number | null;
          notes: string | null;
          image_url: string | null;
          warranty_end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          user_id: string;
          repair_type?: string | null;
          service_date?: string | null;
          mileage?: number | null;
          cost?: number | null;
          notes?: string | null;
          image_url?: string | null;
          warranty_end_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          user_id?: string;
          repair_type?: string | null;
          service_date?: string | null;
          mileage?: number | null;
          cost?: number | null;
          notes?: string | null;
          image_url?: string | null;
          warranty_end_date?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string | null;
          entity_id: string | null;
          message: string | null;
          due_date: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type?: string | null;
          entity_id?: string | null;
          message?: string | null;
          due_date?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string | null;
          entity_id?: string | null;
          message?: string | null;
          due_date?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      service_providers: {
        Row: {
          id: string;
          created_by: string;
          name: string | null;
          category: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          address: string | null;
          rating: number | null;
          tags: string[] | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          name?: string | null;
          category?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          address?: string | null;
          rating?: number | null;
          tags?: string[] | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          created_by?: string;
          name?: string | null;
          category?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          address?: string | null;
          rating?: number | null;
          tags?: string[] | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          created_by: string;
          title: string | null;
          content: string | null;
          tags: string[] | null;
          image_url: string | null;
          social_link_url: string | null;
          upvotes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          title?: string | null;
          content?: string | null;
          tags?: string[] | null;
          image_url?: string | null;
          social_link_url?: string | null;
          upvotes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          created_by?: string;
          title?: string | null;
          content?: string | null;
          tags?: string[] | null;
          image_url?: string | null;
          social_link_url?: string | null;
          upvotes?: number;
          created_at?: string;
        };
      };
    };
    Functions: {
      summaries: {
        Args: Record<PropertyKey, never>;
        Returns: {
          homes_count: number;
          vehicles_count: number;
          unread_notifications_count: number;
        }[];
      };
    };
  };
};

export const createClient = () => {
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

  return createBrowserClient<Database>(
    supabaseUrl.trim(),
    supabaseAnonKey.trim()
  );
};
