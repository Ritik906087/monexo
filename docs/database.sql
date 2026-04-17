-- Complete Database Schema for MONEXO UPI App

-- 1. USERS TABLE
-- This table stores user profile, balance, profit, and linked UPI (KYC) data.
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  numeric_id BIGINT UNIQUE NOT NULL,
  itoken_balance NUMERIC(15,2) DEFAULT 0.00,
  today_profit NUMERIC(15,2) DEFAULT 0.00,
  reward_percent NUMERIC(5,2) DEFAULT 7.00,
  kyc_data JSONB, -- Stores { partner, name, upi_no, linked_mobile, linked_at }
  last_ip TEXT,
  device_type TEXT, -- 'mobile' or 'desktop'
  total_logins INTEGER DEFAULT 0,
  unique_ips INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow public insert during registration" ON public.users
  FOR INSERT WITH CHECK (true);

-- 2. ORDERS TABLE
-- This table stores all Buy and Sell (Withdrawal) requests.
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  order_id TEXT UNIQUE NOT NULL, -- e.g., LGPAY123456
  amount NUMERIC(15,2) NOT NULL,
  status TEXT DEFAULT 'pending_payment', -- pending_payment, pending_confirmation, completed, cancelled
  type TEXT CHECK (type IN ('buy', 'sell')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders table
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin Policy (Simplified for development)
-- In a production app, you would check for a specific 'admin' role in auth.users
CREATE POLICY "Admin can view all users" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Admin can update all users" ON public.users
  FOR UPDATE USING (true);

CREATE POLICY "Admin can view all orders" ON public.orders
  FOR SELECT USING (true);
