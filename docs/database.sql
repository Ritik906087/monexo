
-- 1. USERS TABLE: Stores profile, balance, and security tracking data
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  numeric_id BIGINT UNIQUE NOT NULL,
  itoken_balance NUMERIC DEFAULT 0,
  today_profit NUMERIC DEFAULT 0,
  reward_percent NUMERIC DEFAULT 7,
  
  -- Security Tracking Fields
  last_ip TEXT,
  device_type TEXT,
  total_logins INTEGER DEFAULT 0,
  unique_ips INTEGER DEFAULT 1,
  
  -- KYC / Settlement Data
  kyc_data JSONB, -- Stores { partner, name, upi_no, linked_mobile }
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. ORDERS TABLE: Stores Buy/Sell transactions
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  order_id TEXT UNIQUE NOT NULL, -- Format like LGPAY123456
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'pending_confirmation', 'completed', 'failed')),
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES: User access
CREATE POLICY "Users can view their own data" ON public.users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own orders" ON public.orders 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. POLICIES: Admin access (Admin can see everything)
-- Note: In a production app, you would use a specific 'admin' role or custom claim.
CREATE POLICY "Admin full access to users" ON public.users 
  FOR ALL USING (true);

CREATE POLICY "Admin full access to orders" ON public.orders 
  FOR ALL USING (true);

-- 6. INDEXES for performance
CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_numeric_id ON public.users(numeric_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_order_id ON public.orders(order_id);
