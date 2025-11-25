import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase'

export function useDashboardSummary() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('summaries')

      if (error) throw error
      return data[0] || { homes_count: 0, vehicles_count: 0, unread_notifications_count: 0 }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  })
}
