-- Create Trading Bots Table
CREATE TABLE IF NOT EXISTS trading_bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('grid', 'dca', 'arbitrage')),
  pair TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paused' CHECK (status IN ('running', 'paused', 'stopped', 'error')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_profit NUMERIC NOT NULL DEFAULT 0.00,
  profit_percentage NUMERIC NOT NULL DEFAULT 0.00,
  runtime_start TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE trading_bots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bots"
  ON trading_bots
  FOR ALL
  USING (auth.uid() = user_id);

-- Setup RLS trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_trading_bots_updated_at
BEFORE UPDATE ON trading_bots
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
