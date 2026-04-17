
-- MONEXO FULL DATABASE SCHEMA --

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    numeric_id BIGINT UNIQUE NOT NULL,
    itoken_balance DECIMAL(15, 2) DEFAULT 0.00,
    today_profit DECIMAL(15, 2) DEFAULT 0.00,
    reward_percent DECIMAL(5, 2) DEFAULT 7.00,
    last_ip TEXT,
    device_type TEXT,
    total_logins INTEGER DEFAULT 1,
    unique_ips INTEGER DEFAULT 1,
    kyc_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Orders Table (Buy/Sell)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    order_id TEXT UNIQUE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status TEXT DEFAULT 'pending_payment', -- 'pending_payment', 'pending_confirmation', 'completed', 'cancelled'
    type TEXT NOT NULL, -- 'buy' or 'sell'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Security Tracking (Optional but recommended)
-- This ensures the admin panel can track suspicious activity correctly.
-- All logic is handled via the app code, but these columns are essential.

-- 4. Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users 
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (for login stats)
CREATE POLICY "Users can update own profile" ON public.users 
    FOR UPDATE USING (auth.uid() = id);

-- Admin (Service Role) bypasses RLS - handled by Supabase Dashboard
-- In a real app, you'd add more granular policies for orders.
CREATE POLICY "Users can view own orders" ON public.orders 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
