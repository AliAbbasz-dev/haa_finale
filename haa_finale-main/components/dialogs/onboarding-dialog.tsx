"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateAccount, useInitializeUsageLimits } from "@/hooks/use-account";
import { RESIDENTIAL_PLANS, CustomerSegment, BillingCycle } from "@/lib/pricing-constants";
import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function OnboardingDialog({ open, onOpenChange, userId }: OnboardingDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [segment, setSegment] = useState<CustomerSegment>('residential');
  const [selectedPlan, setSelectedPlan] = useState('residential-essentials');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const createAccountMutation = useCreateAccount();
  const initializeLimitsMutation = useInitializeUsageLimits();

  const handleComplete = async () => {
    try {
      // Calculate trial end date (14 days from now)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);

      // Calculate period end (1 month or 1 year from now)
      const periodEnd = new Date();
      if (billingCycle === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      // Determine plan tier
      const planTier = selectedPlan.split('-').pop() || 'essentials';

      // Create account
      const account = await createAccountMutation.mutateAsync({
        user_id: userId,
        customer_segment: segment,
        plan_id: selectedPlan,
        plan_tier: planTier,
        billing_cycle: billingCycle,
        trial_end_date: selectedPlan === 'residential-essentials' ? trialEndDate.toISOString() : null,
        subscription_status: selectedPlan === 'residential-essentials' ? 'trial' : 'active',
        current_period_end: periodEnd.toISOString(),
      });

      // Initialize usage limits
      await initializeLimitsMutation.mutateAsync({
        accountId: account.id,
        planId: selectedPlan,
        planTier,
      });

      // Close dialog and redirect to dashboard
      onOpenChange(false);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            Welcome to HAA!
          </DialogTitle>
          <DialogDescription className="text-base">
            Let's get you set up with the perfect plan
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">What brings you to HAA?</h3>
              <RadioGroup value={segment} onValueChange={(value) => setSegment(value as CustomerSegment)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    segment === 'residential' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <RadioGroupItem value="residential" id="residential" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Homeowner / Driver</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Manage personal homes and vehicles
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    segment === 'landlord' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <RadioGroupItem value="landlord" id="landlord" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Landlord / Property Manager</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Manage rental properties and units
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    segment === 'commercial' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <RadioGroupItem value="commercial" id="commercial" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Commercial Property</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Manage business sites and locations
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    segment === 'marketplace' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <RadioGroupItem value="marketplace" id="marketplace" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Service Provider</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Get leads and grow your business
                      </div>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} size="lg">
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && segment === 'residential' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Your Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {RESIDENTIAL_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`text-left p-6 rounded-xl border-2 transition-all ${
                      selectedPlan === plan.id
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plan.tier === 'premium' && (
                      <div className="mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                    <div className="text-3xl font-bold text-gray-900 mb-4">
                      {plan.tier === 'essentials' ? (
                        'Free'
                      ) : (
                        <>
                          ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                          <span className="text-base text-gray-600">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        </>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>

            {selectedPlan !== 'residential-essentials' && (
              <div>
                <Label className="text-base font-semibold mb-3 block">Billing Cycle</Label>
                <RadioGroup value={billingCycle} onValueChange={(value) => setBillingCycle(value as BillingCycle)}>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer ${
                      billingCycle === 'monthly' ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}>
                      <div>
                        <div className="font-semibold">Monthly</div>
                        <div className="text-sm text-gray-600">Pay monthly</div>
                      </div>
                      <RadioGroupItem value="monthly" id="monthly" />
                    </label>

                    <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer ${
                      billingCycle === 'annual' ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}>
                      <div>
                        <div className="font-semibold">Annual</div>
                        <div className="text-sm text-green-600">Save 20-30%</div>
                      </div>
                      <RadioGroupItem value="annual" id="annual" />
                    </label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleComplete}
                size="lg"
                disabled={createAccountMutation.isPending || initializeLimitsMutation.isPending}
              >
                {createAccountMutation.isPending || initializeLimitsMutation.isPending
                  ? 'Setting up...'
                  : selectedPlan === 'residential-essentials'
                  ? 'Start Free Trial'
                  : 'Continue to Payment'}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && segment !== 'residential' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Almost There!</h3>
              <p className="text-lg text-gray-600 mb-6">
                {segment === 'landlord' && 'Landlord and Property Manager plans require additional setup.'}
                {segment === 'commercial' && 'Commercial plans require additional setup.'}
                {segment === 'marketplace' && 'Service Provider plans require additional setup.'}
              </p>
              <p className="text-gray-600 mb-8">
                Our team will contact you to complete your setup and customize your plan.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={async () => {
                    // Create essentials account as placeholder
                    await handleComplete();
                  }}
                  size="lg"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
