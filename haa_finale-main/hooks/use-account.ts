import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { Database } from "@/lib/supabase";
import { toast } from "sonner";

type Account = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

// Fetch user's account
export function useAccount(userId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['account', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });
}

// Create account (typically on first login/signup)
export function useCreateAccount() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (account: AccountInsert) => {
      const { data, error } = await supabase
        .from('accounts')
        .insert(account)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['account', data.user_id] });
      toast.success('Account created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create account');
    },
  });
}

// Update account (e.g., change plan, billing cycle)
export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ accountId, updates }: { accountId: string; updates: AccountUpdate }) => {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', accountId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['account', data.user_id] });
      toast.success('Account updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update account');
    },
  });
}

// Fetch usage limits
export function useUsageLimits(accountId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['usage-limits', accountId],
    queryFn: async () => {
      if (!accountId) return [];

      const { data, error } = await supabase
        .from('usage_limits')
        .select('*')
        .eq('account_id', accountId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!accountId,
  });
}

// Check if user is within plan limits
export function useCheckLimit(accountId?: string, limitType?: string) {
  const { data: limits } = useUsageLimits(accountId);

  if (!limits || !limitType) return { isWithinLimit: true, usage: 0, maxLimit: null };

  const limit = limits.find((l) => l.limit_type === limitType);
  if (!limit) return { isWithinLimit: true, usage: 0, maxLimit: null };

  const isWithinLimit = limit.max_limit === null || limit.current_usage < limit.max_limit;

  return {
    isWithinLimit,
    usage: limit.current_usage,
    maxLimit: limit.max_limit,
  };
}

// Update usage limits
export function useUpdateUsageLimit() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      accountId,
      limitType,
      newUsage,
    }: {
      accountId: string;
      limitType: string;
      newUsage: number;
    }) => {
      const { data, error } = await supabase
        .from('usage_limits')
        .upsert({
          account_id: accountId,
          limit_type: limitType,
          current_usage: newUsage,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['usage-limits', data.account_id] });
    },
    onError: (error: any) => {
      console.error('Failed to update usage limit:', error);
    },
  });
}

// Initialize default usage limits for a new account
export function useInitializeUsageLimits() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      accountId,
      planId,
      planTier,
    }: {
      accountId: string;
      planId: string;
      planTier: string;
    }) => {
      // Define limits based on plan
      const limits: Array<{ limit_type: string; max_limit: number | null }> = [];

      // Residential plans
      if (planId.startsWith('residential')) {
        if (planTier === 'essentials') {
          limits.push(
            { limit_type: 'properties', max_limit: 1 },
            { limit_type: 'vehicles', max_limit: 1 },
            { limit_type: 'documents', max_limit: 5 },
            { limit_type: 'seats', max_limit: 1 }
          );
        } else if (planTier === 'premium') {
          limits.push(
            { limit_type: 'properties', max_limit: null }, // unlimited
            { limit_type: 'vehicles', max_limit: 3 },
            { limit_type: 'documents', max_limit: null }, // unlimited
            { limit_type: 'seats', max_limit: 3 }
          );
        } else if (planTier === 'signature') {
          limits.push(
            { limit_type: 'properties', max_limit: null },
            { limit_type: 'vehicles', max_limit: 4 },
            { limit_type: 'documents', max_limit: null },
            { limit_type: 'seats', max_limit: 5 }
          );
        }
      }

      // Insert all limits
      const limitsToInsert = limits.map((limit) => ({
        account_id: accountId,
        limit_type: limit.limit_type,
        current_usage: 0,
        max_limit: limit.max_limit,
      }));

      const { data, error } = await supabase
        .from('usage_limits')
        .upsert(limitsToInsert)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usage-limits', variables.accountId] });
    },
    onError: (error: any) => {
      console.error('Failed to initialize usage limits:', error);
    },
  });
}
