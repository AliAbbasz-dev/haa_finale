"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import {
  RESIDENTIAL_PLANS,
  LANDLORD_PLANS,
  COMMERCIAL_PLANS,
  MARKETPLACE_PLANS,
  CustomerSegment,
  BillingCycle,
  calculateResidentialPlan,
  calculateLandlordPrice,
  calculateCommercialPrice,
} from "@/lib/pricing-constants";

export default function PricingPage() {
  const [segment, setSegment] = useState<CustomerSegment>("residential");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  // Residential Auto-Estimator State
  const [sqft, setSqft] = useState<number | undefined>();
  const [bedrooms, setBedrooms] = useState<number | undefined>();
  const [bathrooms, setBathrooms] = useState<number | undefined>();

  // Landlord Unit Slider State
  const [units, setUnits] = useState<number>(5);

  // Commercial Site Calculator State
  const [sites, setSites] = useState<number>(3);

  // Calculate recommended residential plan
  const recommendedPlan = sqft || bedrooms || bathrooms
    ? calculateResidentialPlan(sqft, bedrooms, bathrooms)
    : null;

  // Calculate landlord pricing
  const landlordPricing = calculateLandlordPrice(units, billingCycle);

  // Calculate commercial pricing
  const commercialPricing = calculateCommercialPrice(sites);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/Logo.jpg" alt="HAA" width={110} height={110} />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/#features"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#about"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/#contact"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </Link>
              <a
                href="https://shop-home-and-auto-assistant.myshopify.com/password"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Shop
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600 hover:bg-[#f1f5f9] hover:text-[#186bbf]">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-black hover:bg-gray-900 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. From homeowners to enterprise property managers,
            we have you covered.
          </p>

          {/* Segment Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              onClick={() => setSegment("residential")}
              variant={segment === "residential" ? "default" : "outline"}
              className="px-6 py-3"
            >
              Residential
            </Button>
            <Button
              onClick={() => setSegment("landlord")}
              variant={segment === "landlord" ? "default" : "outline"}
              className="px-6 py-3"
            >
              Landlords & PMs
            </Button>
            <Button
              onClick={() => setSegment("commercial")}
              variant={segment === "commercial" ? "default" : "outline"}
              className="px-6 py-3"
            >
              Commercial Properties
            </Button>
            <Button
              onClick={() => setSegment("marketplace")}
              variant={segment === "marketplace" ? "default" : "outline"}
              className="px-6 py-3"
            >
              Service Providers
            </Button>
          </div>

          {/* Billing Cycle Toggle (for applicable segments) */}
          {(segment === "residential" || segment === "landlord") && (
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={billingCycle === "monthly" ? "font-semibold text-gray-900" : "text-gray-600"}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  billingCycle === "annual" ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    billingCycle === "annual" ? "translate-x-7" : ""
                  }`}
                />
              </button>
              <span className={billingCycle === "annual" ? "font-semibold text-gray-900" : "text-gray-600"}>
                Annual <span className="text-sm text-green-600 font-normal">(Save 20-30%)</span>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Residential Plans */}
      {segment === "residential" && (
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-7xl">
            {/* Auto-Estimator */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Find Your Perfect Plan
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                Enter your home details to get a personalized recommendation
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet
                  </label>
                  <input
                    type="number"
                    value={sqft || ""}
                    onChange={(e) => setSqft(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g., 2500"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={bedrooms || ""}
                    onChange={(e) => setBedrooms(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g., 3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={bathrooms || ""}
                    onChange={(e) => setBathrooms(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="e.g., 2.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {recommendedPlan && (
                <div className="mt-6 text-center">
                  <p className="text-lg text-gray-700">
                    Recommended plan:{" "}
                    <span className="font-bold text-primary capitalize">{recommendedPlan}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {RESIDENTIAL_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-200 hover:shadow-xl ${
                    plan.tier === "premium"
                      ? "border-primary ring-4 ring-primary/10"
                      : "border-gray-200"
                  } ${recommendedPlan === plan.tier ? "ring-4 ring-green-500/20" : ""}`}
                >
                  {plan.tier === "premium" && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {recommendedPlan === plan.tier && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Recommended
                      </span>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    {plan.tier === "essentials" ? (
                      <div className="text-4xl font-bold text-gray-900">Free</div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-gray-900">
                          ${billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                          <span className="text-lg font-normal text-gray-600">
                            /{billingCycle === "monthly" ? "mo" : "yr"}
                          </span>
                        </div>
                        {billingCycle === "annual" && (
                          <div className="text-sm text-green-600 mt-1">
                            Save ${(plan.monthlyPrice * 12 - plan.annualPrice).toFixed(2)}/year
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mb-6 space-y-2 text-sm text-gray-600">
                    <p><strong>{plan.seats}</strong> family seat{plan.seats > 1 ? "s" : ""}</p>
                    <p><strong>{plan.vehicles}</strong> vehicle{plan.vehicles > 1 ? "s" : ""}</p>
                    {plan.sizingRules.maxSqFt && (
                      <p>Up to {plan.sizingRules.maxSqFt.toLocaleString()} sq ft</p>
                    )}
                    {plan.sizingRules.minSqFt && (
                      <p>{plan.sizingRules.minSqFt.toLocaleString()}+ sq ft</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/signup">
                    <Button
                      className={`w-full ${
                        plan.tier === "premium"
                          ? "bg-primary hover:bg-primary-600"
                          : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    >
                      {plan.tier === "essentials" ? "Start Free Trial" : "Get Started"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Bundle Discount Notice */}
            <div className="mt-12 text-center bg-blue-50 rounded-xl p-6 border border-blue-200">
              <p className="text-blue-900 font-medium">
                💡 Managing multiple properties? Get <strong>15% off</strong> on the 2nd and subsequent
                properties on the same account!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Landlord/PM Plans */}
      {segment === "landlord" && (
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-7xl">
            {/* Unit Slider */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Calculate Your Monthly Cost
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                Pricing based on units under management (UUM)
              </p>

              <div className="max-w-2xl mx-auto">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Number of Units: <strong className="text-2xl text-primary">{units}</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="300"
                  value={units}
                  onChange={(e) => setUnits(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1 unit</span>
                  <span>300 units</span>
                </div>

                {landlordPricing && (
                  <div className="mt-8 text-center bg-primary/5 rounded-xl p-6 border border-primary/20">
                    <p className="text-sm text-gray-600 mb-2">Recommended Plan</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{landlordPricing.plan.name}</p>
                    <p className="text-4xl font-bold text-primary">
                      ${landlordPricing.price.toFixed(2)}
                      <span className="text-lg font-normal text-gray-600">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </p>
                    {landlordPricing.plan.monthlyPricePerUnit && (
                      <p className="text-sm text-gray-600 mt-2">
                        ${landlordPricing.plan.monthlyPricePerUnit.toFixed(2)} per unit/month
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {LANDLORD_PLANS.map((plan, idx) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-200 hover:shadow-xl ${
                    plan.tier === "pro"
                      ? "border-primary ring-4 ring-primary/10"
                      : "border-gray-200"
                  } ${landlordPricing?.plan.id === plan.id ? "ring-4 ring-green-500/20" : ""}`}
                >
                  {plan.tier === "pro" && (
                    <div className="mb-3">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    {plan.tier === "lite" ? (
                      <div className="text-3xl font-bold text-gray-900">
                        ${billingCycle === "monthly" ? plan.fixedMonthlyPrice : plan.fixedAnnualPrice}
                        <span className="text-sm font-normal text-gray-600">/mo</span>
                      </div>
                    ) : plan.tier === "enterprise" ? (
                      <div className="text-2xl font-bold text-gray-900">Custom Pricing</div>
                    ) : (
                      <div className="text-2xl font-bold text-gray-900">
                        ${plan.monthlyPricePerUnit}/unit
                        <div className="text-sm font-normal text-gray-600 mt-1">
                          Min ${plan.minMonthlyPrice}/mo
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4 text-sm text-gray-600">
                    <strong>
                      {plan.unitRange.min}-{plan.unitRange.max || "250+"} units
                    </strong>
                  </div>

                  <ul className="space-y-2 mb-6 text-sm">
                    {plan.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 5 && (
                      <li className="text-primary font-medium">
                        +{plan.features.length - 5} more features
                      </li>
                    )}
                  </ul>

                  <Link href={plan.tier === "enterprise" ? "/#contact" : "/signup"}>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800">
                      {plan.tier === "enterprise" ? "Contact Sales" : "Get Started"}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Commercial Plans */}
      {segment === "commercial" && (
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-7xl">
            {/* Site Calculator */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Calculate Your Monthly Cost
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                Pricing based on sites/locations
              </p>

              <div className="max-w-2xl mx-auto">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Number of Sites: <strong className="text-2xl text-primary">{sites}</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={sites}
                  onChange={(e) => setSites(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1 site</span>
                  <span>100 sites</span>
                </div>

                {commercialPricing && (
                  <div className="mt-8 text-center bg-primary/5 rounded-xl p-6 border border-primary/20">
                    <p className="text-sm text-gray-600 mb-2">Recommended Plan</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{commercialPricing.plan.name}</p>
                    <p className="text-4xl font-bold text-primary">
                      {commercialPricing.plan.customPricing ? (
                        "Custom"
                      ) : (
                        <>
                          ${commercialPricing.price.toFixed(2)}
                          <span className="text-lg font-normal text-gray-600">/mo</span>
                        </>
                      )}
                    </p>
                    {commercialPricing.plan.pricePerSite && (
                      <p className="text-sm text-gray-600 mt-2">
                        ${commercialPricing.plan.pricePerSite} per site/month
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {COMMERCIAL_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-200 hover:shadow-xl ${
                    plan.tier === "growth"
                      ? "border-primary ring-4 ring-primary/10"
                      : "border-gray-200"
                  } ${commercialPricing?.plan.id === plan.id ? "ring-4 ring-green-500/20" : ""}`}
                >
                  {plan.tier === "growth" && (
                    <div className="mb-3">
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    {plan.customPricing ? (
                      <div className="text-3xl font-bold text-gray-900">Custom</div>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">
                        ${plan.pricePerSite}/site
                        <div className="text-sm font-normal text-gray-600 mt-1">
                          Min ${plan.minMonthlyPrice}/mo
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-6 text-sm text-gray-600">
                    <strong>
                      {plan.siteRange.min}-{plan.siteRange.max || "51+"} sites
                    </strong>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.customPricing ? "/#contact" : "/signup"}>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800">
                      {plan.customPricing ? "Contact Sales" : "Get Started"}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Marketplace/Service Provider Plans */}
      {segment === "marketplace" && (
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Service Provider Plans
              </h2>
              <p className="text-lg text-gray-600">
                Connect with customers and grow your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MARKETPLACE_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-200 hover:shadow-xl ${
                    plan.tier === "pro"
                      ? "border-primary ring-4 ring-primary/10"
                      : "border-gray-200"
                  }`}
                >
                  {plan.tier === "pro" && (
                    <div className="mb-3">
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-gray-900">
                      ${plan.monthlyPrice}
                      <span className="text-lg font-normal text-gray-600">/mo</span>
                    </div>
                    {plan.leadCredits !== null && plan.leadCredits > 0 && (
                      <div className="text-sm text-green-600 mt-1">
                        Includes {plan.leadCredits} lead credits
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/signup">
                    <Button
                      className={`w-full ${
                        plan.tier === "pro"
                          ? "bg-primary hover:bg-primary-600"
                          : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    >
                      {plan.tier === "free" ? "Get Started" : "Upgrade Now"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Lead Pricing Info */}
            <div className="mt-12 bg-gray-100 rounded-2xl p-8 border border-gray-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Pay-Per-Lead Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">$8-$15</div>
                  <div className="text-sm font-medium text-gray-700 mb-3">Low Complexity</div>
                  <p className="text-xs text-gray-600">Lockout, minor repair</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">$20-$35</div>
                  <div className="text-sm font-medium text-gray-700 mb-3">Medium Complexity</div>
                  <p className="text-xs text-gray-600">Appliance install, brake service</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">$40-$120</div>
                  <div className="text-sm font-medium text-gray-700 mb-3">High Complexity</div>
                  <p className="text-xs text-gray-600">HVAC install, roof repair, engine work</p>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-6">
                💯 <strong>Bad-lead protection:</strong> 100% credit for invalid leads within 72 hours
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Upgrades are prorated immediately,
                while downgrades take effect at the start of your next billing cycle.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens after the 14-day trial?
              </h3>
              <p className="text-gray-600">
                The Essentials plan gives you 14 days to explore the platform. After the trial, your property
                becomes read-only unless you upgrade to Premium or Signature.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do annual plans auto-renew?
              </h3>
              <p className="text-gray-600">
                Yes, annual plans auto-renew. You'll receive renewal reminders 30 and 7 days before your
                renewal date.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards and ACH transfers for qualifying accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-primary-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of homeowners, landlords, and service providers managing their properties
            with HAA.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/signup">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full shadow-lg">
                Start Free Trial
              </Button>
            </Link>
            <a href="mailto:sales@homeandautoassistant.com">
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold rounded-full"
              >
                Contact Sales
              </Button>
            </a>
          </div>
          <p className="text-sm opacity-75">
            Have pricing questions? Email us at{" "}
            <a href="mailto:sales@homeandautoassistant.com" className="underline font-semibold hover:opacity-90">
              sales@homeandautoassistant.com
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/Logo.jpg" alt="HAA" width={110} height={110} />
              </div>
              <p className="text-gray-400">
                Track every fix, every mile, every warranty. Your complete home and auto assistant.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <a
                    href="https://shop-home-and-auto-assistant.myshopify.com/password"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Shop
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/#about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=61583506209910"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/homeandautollc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/homeandautoassistant/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            &copy; {new Date().getFullYear()} HAA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
