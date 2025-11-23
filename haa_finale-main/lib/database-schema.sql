-- HAA Pricing & Plans Database Schema
-- Source: HAA Pricing & Plans – Developer Hand-Off (v1.0)

-- ===================================================================
-- ACCOUNTS TABLE
-- Stores account-level information including plan and billing details
-- ===================================================================
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_segment TEXT NOT NULL CHECK (customer_segment IN ('residential', 'landlord', 'commercial', 'marketplace')),
  plan_id TEXT NOT NULL,
  plan_tier TEXT NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  trial_end_date TIMESTAMP WITH TIME ZONE,
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled', 'paused')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  add_ons JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ===================================================================
-- SEATS TABLE
-- Tracks family/team seats for account sharing
-- ===================================================================
CREATE TABLE IF NOT EXISTS seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'revoked')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- PROPERTY_TIERS TABLE
-- Tracks tier assignment for residential properties (size-based pricing)
-- ===================================================================
CREATE TABLE IF NOT EXISTS property_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('premium', 'signature')),
  sqft INTEGER,
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  is_active BOOLEAN DEFAULT TRUE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(home_id)
);

-- ===================================================================
-- UNITS TABLE (for Landlord/PM plans)
-- Tracks rental units under management
-- ===================================================================
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  property_id UUID REFERENCES homes(id) ON DELETE SET NULL,
  unit_number TEXT,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'vacant', 'maintenance', 'archived')),
  tenant_name TEXT,
  tenant_email TEXT,
  tenant_phone TEXT,
  lease_start_date DATE,
  lease_end_date DATE,
  rent_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- SITES TABLE (for Commercial plans)
-- Tracks commercial sites/locations
-- ===================================================================
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  site_type TEXT,
  sqft INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  manager_name TEXT,
  manager_email TEXT,
  manager_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- LEADS TABLE (for Marketplace/Service Provider plans)
-- Tracks marketplace leads and purchases
-- ===================================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  complexity TEXT NOT NULL CHECK (complexity IN ('low', 'medium', 'high')),
  price_paid DECIMAL(10,2) NOT NULL,
  zip_code TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'accepted', 'contacted', 'quoted', 'won', 'lost', 'spam')),
  credit_eligible BOOLEAN DEFAULT TRUE,
  credit_issued BOOLEAN DEFAULT FALSE,
  credit_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  credited_at TIMESTAMP WITH TIME ZONE
);

-- ===================================================================
-- TRANSACTIONS TABLE
-- Tracks all financial transactions (subscriptions, leads, add-ons)
-- ===================================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('subscription', 'lead_purchase', 'add_on', 'credit', 'refund')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_payment_id TEXT,
  stripe_invoice_id TEXT,
  description TEXT,
  metadata JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- USAGE_LIMITS TABLE
-- Tracks current usage vs plan limits (for enforcement)
-- ===================================================================
CREATE TABLE IF NOT EXISTS usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  limit_type TEXT NOT NULL,
  current_usage INTEGER NOT NULL DEFAULT 0,
  max_limit INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(account_id, limit_type)
);

-- ===================================================================
-- INDEXES for performance
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_plan_id ON accounts(plan_id);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(subscription_status);
CREATE INDEX IF NOT EXISTS idx_seats_account_id ON seats(account_id);
CREATE INDEX IF NOT EXISTS idx_seats_user_id ON seats(user_id);
CREATE INDEX IF NOT EXISTS idx_property_tiers_home_id ON property_tiers(home_id);
CREATE INDEX IF NOT EXISTS idx_property_tiers_account_id ON property_tiers(account_id);
CREATE INDEX IF NOT EXISTS idx_units_account_id ON units(account_id);
CREATE INDEX IF NOT EXISTS idx_sites_account_id ON sites(account_id);
CREATE INDEX IF NOT EXISTS idx_leads_provider_user_id ON leads(provider_user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_limits_account_id ON usage_limits(account_id);

-- ===================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================

-- Accounts: Users can only see their own account
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own account" ON accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own account" ON accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own account" ON accounts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seats: Users can see seats for their account
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view seats for their account" ON seats FOR SELECT USING (
  account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  OR user_id = auth.uid()
);
CREATE POLICY "Account owners can manage seats" ON seats FOR ALL USING (
  account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
);

-- Property Tiers: Users can manage tiers for their properties
ALTER TABLE property_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own property tiers" ON property_tiers FOR SELECT USING (
  account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage own property tiers" ON property_tiers FOR ALL USING (
  account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
);

-- Units: Landlords can manage their units
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own units" ON units FOR SELECT USING (
  account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage own units" ON units FOR ALL USING (
  account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
);

-- Sites: Commercial users can manage their sites
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sites" ON sites FOR SELECT USING (
  account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage own sites" ON sites FOR ALL USING (
  account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
);

-- Leads: Providers can see their leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Providers can view own leads" ON leads FOR SELECT USING (
  provider_user_id = auth.uid() OR customer_user_id = auth.uid()
);
CREATE POLICY "Providers can update own leads" ON leads FOR UPDATE USING (
  provider_user_id = auth.uid()
);

-- Transactions: Users can see their own transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (
  user_id = auth.uid()
);

-- Usage Limits: Users can see their own usage
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own usage limits" ON usage_limits FOR SELECT USING (
  account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
);

-- ===================================================================
-- FUNCTIONS AND TRIGGERS
-- ===================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate units under management (UUM) for landlords
CREATE OR REPLACE FUNCTION calculate_uum(account_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM units WHERE account_id = account_uuid AND status = 'active');
END;
$$ LANGUAGE plpgsql;

-- Function to calculate active sites for commercial accounts
CREATE OR REPLACE FUNCTION calculate_active_sites(account_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM sites WHERE account_id = account_uuid AND status = 'active');
END;
$$ LANGUAGE plpgsql;

-- Function to check if account is within plan limits
CREATE OR REPLACE FUNCTION check_plan_limit(
  account_uuid UUID,
  limit_type_param TEXT,
  new_usage INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  max_allowed INTEGER;
BEGIN
  SELECT max_limit INTO max_allowed
  FROM usage_limits
  WHERE account_id = account_uuid AND limit_type = limit_type_param;

  IF max_allowed IS NULL THEN
    RETURN TRUE; -- No limit set (unlimited)
  END IF;

  RETURN new_usage <= max_allowed;
END;
$$ LANGUAGE plpgsql;
