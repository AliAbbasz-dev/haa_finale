import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { Database } from "@/lib/supabase";
import { toast } from "sonner";

type Seat = Database['public']['Tables']['seats']['Row'];
type SeatInsert = Database['public']['Tables']['seats']['Insert'];
type SeatUpdate = Database['public']['Tables']['seats']['Update'];

// Fetch all seats for an account
export function useSeats(accountId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['seats', accountId],
    queryFn: async () => {
      if (!accountId) return [];

      const { data, error } = await supabase
        .from('seats')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!accountId,
  });
}

// Invite a new seat
export function useInviteSeat() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (seat: SeatInsert) => {
      const { data, error } = await supabase
        .from('seats')
        .insert(seat)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['seats', data.account_id] });
      toast.success('Invitation sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send invitation');
    },
  });
}

// Update a seat (e.g., change role, revoke access)
export function useUpdateSeat() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ seatId, updates }: { seatId: string; updates: SeatUpdate }) => {
      const { data, error } = await supabase
        .from('seats')
        .update(updates)
        .eq('id', seatId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['seats', data.account_id] });
      toast.success('Seat updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update seat');
    },
  });
}

// Delete/revoke a seat
export function useRevokeSeat() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ seatId, accountId }: { seatId: string; accountId: string }) => {
      const { error } = await supabase
        .from('seats')
        .update({ status: 'revoked' })
        .eq('id', seatId);

      if (error) throw error;
      return { seatId, accountId };
    },
    onSuccess: ({ accountId }) => {
      queryClient.invalidateQueries({ queryKey: ['seats', accountId] });
      toast.success('Access revoked successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to revoke access');
    },
  });
}

// Accept a seat invitation
export function useAcceptSeatInvitation() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ seatId, userId }: { seatId: string; userId: string }) => {
      const { data, error } = await supabase
        .from('seats')
        .update({
          user_id: userId,
          status: 'active',
          accepted_at: new Date().toISOString(),
        })
        .eq('id', seatId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['seats', data.account_id] });
      toast.success('Invitation accepted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to accept invitation');
    },
  });
}
