-- 7. PAYMENT METHODS (User payout destinations for P2P)
CREATE TABLE payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,           -- e.g., 'M-Pesa Kenya', 'Equity Bank'
  type TEXT NOT NULL,            -- 'mobile_money', 'bank_transfer', 'cash', 'other'
  account_holder TEXT NOT NULL,  -- e.g., 'JAMES OMINO'
  account_number TEXT NOT NULL,  -- e.g., '0720****40' (masked by app)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment methods"
  ON payment_methods FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods"
  ON payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON payment_methods FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON payment_methods FOR DELETE USING (auth.uid() = user_id);
