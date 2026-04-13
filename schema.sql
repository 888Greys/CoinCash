-- 1. PROFILES TABLE (Extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Handle creating profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (new.id, new.email, split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. WALLETS (Internal Ledger)
-- Everyone has specific asset wallets e.g., 'USDT', 'BTC', 'UGX', 'KES'
CREATE TABLE wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  currency TEXT NOT NULL, -- e.g., 'USDT', 'BTC'
  balance NUMERIC DEFAULT 0.0 CHECK (balance >= 0.0),
  locked_balance NUMERIC DEFAULT 0.0 CHECK (locked_balance >= 0.0), -- Funds in escrow
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, currency)
);

-- Create default USDT wallets on signup
CREATE OR REPLACE FUNCTION public.handle_new_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id, currency, balance) VALUES (new.id, 'USDT', 0);
  INSERT INTO public.wallets (user_id, currency, balance) VALUES (new.id, 'BTC', 0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_wallet();


-- 3. TRANSACTIONS (Ledger History)
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID REFERENCES wallets(id),
  type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'trade_buy', 'trade_sell'
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  reference TEXT UNIQUE, -- tx hash or internal reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 4. P2P ORDERS (The Market Ads)
CREATE TABLE p2p_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  asset TEXT NOT NULL, -- 'USDT', 'BTC'
  fiat TEXT NOT NULL,  -- 'UGX', 'KES', 'USD'
  price NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  min_limit NUMERIC NOT NULL,
  max_limit NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  terms TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 5. P2P TRADES (When an order is taken)
CREATE TABLE p2p_trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES p2p_orders(id),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  asset_amount NUMERIC NOT NULL,
  fiat_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'released', 'disputed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 6. MESSAGES (Real-time P2P Chat)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_id UUID REFERENCES p2p_trades(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) and Realtime for chat
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert messages in their trades" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can read trade messages" ON messages FOR SELECT USING (
  trade_id IN (
    SELECT id FROM p2p_trades WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
  )
);

-- Add realtime extension publication
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table messages;
