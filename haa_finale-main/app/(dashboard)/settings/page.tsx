"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useAccount, useUsageLimits } from "@/hooks/use-account";
import { useSeats, useInviteSeat, useRevokeSeat } from "@/hooks/use-seats";
import {
  RESIDENTIAL_PLANS,
  LANDLORD_PLANS,
  COMMERCIAL_PLANS,
  MARKETPLACE_PLANS,
} from "@/lib/pricing-constants";
import {
  Check,
  X,
  Mail,
  Users,
  CreditCard,
  Shield,
  Crown,
  Zap,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useSupabase();
  const { data: account, isLoading: accountLoading } = useAccount(user?.id);
  const { data: seats } = useSeats(account?.id);
  const { data: usageLimits } = useUsageLimits(account?.id);
  const inviteSeatMutation = useInviteSeat();
  const revokeSeatMutation = useRevokeSeat();

  const [inviteEmail, setInviteEmail] = useState("");

  // Find current plan details
  const getCurrentPlan = () => {
    if (!account) return null;

    const allPlans = [
      ...RESIDENTIAL_PLANS,
      ...LANDLORD_PLANS,
      ...COMMERCIAL_PLANS,
      ...MARKETPLACE_PLANS,
    ];

    return allPlans.find((p) => p.id === account.plan_id);
  };

  const currentPlan = getCurrentPlan();

  // Get usage for a specific limit type
  const getUsage = (limitType: string) => {
    const limit = usageLimits?.find((l) => l.limit_type === limitType);
    return {
      current: limit?.current_usage || 0,
      max: limit?.max_limit,
    };
  };

  const handleInviteSeat = async () => {
    if (!account || !inviteEmail) return;

    // Check seat limit
    const seatUsage = getUsage('seats');
    if (seatUsage.max && (seats?.length || 0) >= seatUsage.max) {
      alert('You have reached your seat limit. Please upgrade your plan.');
      return;
    }

    await inviteSeatMutation.mutateAsync({
      account_id: account.id,
      email: inviteEmail,
      role: 'member',
      status: 'pending',
    });

    setInviteEmail("");
  };

  const handleRevokeSeat = async (seatId: string) => {
    if (!account) return;
    if (confirm('Are you sure you want to revoke this seat?')) {
      await revokeSeatMutation.mutateAsync({ seatId, accountId: account.id });
    }
  };

  if (accountLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account settings...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertCircle className="w-6 h-6" />
              No Active Plan
            </CardTitle>
            <CardDescription className="text-yellow-800">
              You don't have an active subscription yet. Choose a plan to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pricing">
              <Button className="bg-primary hover:bg-primary-600">
                View Pricing Plans
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const propertiesUsage = getUsage('properties');
  const vehiclesUsage = getUsage('vehicles');
  const documentsUsage = getUsage('documents');
  const seatsUsage = getUsage('seats');

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Account Settings</h1>

      {/* Current Plan Card */}
      <Card className="mb-8 border-2 border-primary">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {currentPlan?.tier === 'signature' || currentPlan?.tier === 'enterprise' ? (
                  <Crown className="w-6 h-6 text-yellow-500" />
                ) : currentPlan?.tier === 'pro' || currentPlan?.tier === 'premium' ? (
                  <Zap className="w-6 h-6 text-primary" />
                ) : (
                  <Shield className="w-6 h-6 text-gray-500" />
                )}
                {currentPlan?.name || 'Unknown Plan'}
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                {account.billing_cycle === 'annual' ? 'Billed Annually' : 'Billed Monthly'}
                {' • '}
                <Badge variant={account.subscription_status === 'active' ? 'default' : 'secondary'}>
                  {account.subscription_status.charAt(0).toUpperCase() + account.subscription_status.slice(1)}
                </Badge>
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {currentPlan && 'monthlyPrice' in currentPlan ? (
                  <>
                    ${account.billing_cycle === 'annual'
                      ? currentPlan.annualPrice
                      : currentPlan.monthlyPrice}
                    <span className="text-lg text-gray-600">
                      /{account.billing_cycle === 'annual' ? 'year' : 'month'}
                    </span>
                  </>
                ) : (
                  'Custom Pricing'
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Plan Details</h3>
              <ul className="space-y-2">
                {currentPlan?.features.slice(0, 5).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Subscription Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Segment:</span>
                  <span className="font-medium capitalize">{account.customer_segment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Period:</span>
                  <span className="font-medium">
                    {new Date(account.current_period_start).toLocaleDateString()} - {new Date(account.current_period_end).toLocaleDateString()}
                  </span>
                </div>
                {account.trial_end_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trial Ends:</span>
                    <span className="font-medium">{new Date(account.trial_end_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href="/pricing">
              <Button variant="outline" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Upgrade Plan
              </Button>
            </Link>
            <Link href="/#contact">
              <Button variant="ghost">Contact Support</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Usage & Limits Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Usage & Limits
          </CardTitle>
          <CardDescription>
            Track your current usage against your plan limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Properties */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Properties</div>
              <div className="text-2xl font-bold text-gray-900">
                {propertiesUsage.current}
                {propertiesUsage.max && (
                  <span className="text-base text-gray-600"> / {propertiesUsage.max}</span>
                )}
                {!propertiesUsage.max && (
                  <span className="text-sm text-green-600 ml-2">Unlimited</span>
                )}
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{
                    width: propertiesUsage.max
                      ? `${Math.min((propertiesUsage.current / propertiesUsage.max) * 100, 100)}%`
                      : '100%',
                  }}
                />
              </div>
            </div>

            {/* Vehicles */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Vehicles</div>
              <div className="text-2xl font-bold text-gray-900">
                {vehiclesUsage.current}
                {vehiclesUsage.max && (
                  <span className="text-base text-gray-600"> / {vehiclesUsage.max}</span>
                )}
                {!vehiclesUsage.max && (
                  <span className="text-sm text-green-600 ml-2">Unlimited</span>
                )}
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{
                    width: vehiclesUsage.max
                      ? `${Math.min((vehiclesUsage.current / vehiclesUsage.max) * 100, 100)}%`
                      : '100%',
                  }}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Documents</div>
              <div className="text-2xl font-bold text-gray-900">
                {documentsUsage.current}
                {documentsUsage.max && (
                  <span className="text-base text-gray-600"> / {documentsUsage.max}</span>
                )}
                {!documentsUsage.max && (
                  <span className="text-sm text-green-600 ml-2">Unlimited</span>
                )}
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{
                    width: documentsUsage.max
                      ? `${Math.min((documentsUsage.current / documentsUsage.max) * 100, 100)}%`
                      : '100%',
                  }}
                />
              </div>
            </div>

            {/* Seats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Team Seats</div>
              <div className="text-2xl font-bold text-gray-900">
                {seats?.filter(s => s.status === 'active').length || 0}
                {seatsUsage.max && (
                  <span className="text-base text-gray-600"> / {seatsUsage.max}</span>
                )}
                {!seatsUsage.max && (
                  <span className="text-sm text-green-600 ml-2">Unlimited</span>
                )}
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{
                    width: seatsUsage.max
                      ? `${Math.min(((seats?.filter(s => s.status === 'active').length || 0) / seatsUsage.max) * 100, 100)}%`
                      : '100%',
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Seats Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Team Members
          </CardTitle>
          <CardDescription>
            Manage family members or team access to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Invite Form */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Label htmlFor="invite-email" className="text-sm font-medium text-gray-700 mb-2 block">
              Invite Team Member
            </Label>
            <div className="flex gap-2">
              <Input
                id="invite-email"
                type="email"
                placeholder="email@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleInviteSeat}
                disabled={!inviteEmail || inviteSeatMutation.isPending}
              >
                <Mail className="w-4 h-4 mr-2" />
                {inviteSeatMutation.isPending ? 'Sending...' : 'Send Invite'}
              </Button>
            </div>
            {seatsUsage.max && (
              <p className="text-xs text-gray-500 mt-2">
                {seats?.filter(s => s.status === 'active').length || 0} of {seatsUsage.max} seats used
              </p>
            )}
          </div>

          {/* Seats List */}
          <div className="space-y-3">
            {seats?.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {seat.email?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{seat.email}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Badge variant={seat.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {seat.status}
                      </Badge>
                      <span className="capitalize">{seat.role}</span>
                    </div>
                  </div>
                </div>
                {seat.status !== 'revoked' && seat.role !== 'owner' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeSeat(seat.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Revoke
                  </Button>
                )}
              </div>
            ))}

            {(!seats || seats.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No team members yet. Invite someone to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Billing & Payment
          </CardTitle>
          <CardDescription>
            Manage your payment methods and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900">
              <strong>Coming Soon:</strong> Stripe integration for payment management will be available soon.
              For now, please contact support to update your payment information.
            </p>
          </div>
          <Link href="/#contact">
            <Button variant="outline">Contact Support</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
