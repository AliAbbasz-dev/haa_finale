"use client";

import { Suspense, useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Spinner } from "@/components/ui/spinner";
import AuthGuard from "@/components/auth-guard";
import { OnboardingDialog } from "@/components/dialogs/onboarding-dialog";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useAccount } from "@/hooks/use-account";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user } = useSupabase();
  const { data: account, isLoading } = useAccount(user?.id);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding if user is logged in but has no account
    if (user && !isLoading && !account) {
      setShowOnboarding(true);
    }
  }, [user, account, isLoading]);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-[url('/carousels/homepage-2.png')] bg-cover bg-center bg-fixed">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 bg-white border-r border-gray-200">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 relative">
          <main className="flex-1 overflow-auto p-6 space-y-6">
            <div className="min-h-full">{children}</div>
          </main>
        </div>
      </div>

      {/* Onboarding Dialog */}
      {user && (
        <OnboardingDialog
          open={showOnboarding}
          onOpenChange={setShowOnboarding}
          userId={user.id}
        />
      )}
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthGuard>
        <DashboardContent>{children}</DashboardContent>
      </AuthGuard>
    </Suspense>
  );
}
