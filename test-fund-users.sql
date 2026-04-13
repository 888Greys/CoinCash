-- Test funding for two users so P2P buy/sell can be exercised quickly.
-- Run in Supabase SQL Editor.

-- Target users from your recent p2p_orders rows:
-- dfcfb25-c08c-46b1-8132-7aa15a714417
-- c0a2cd7a-8d01-4e10-9ad8-b725f50fdfc4

with target_users as (
  select unnest(array[
    'dfcfb25-c08c-46b1-8132-7aa15a714417'::uuid,
    'c0a2cd7a-8d01-4e10-9ad8-b725f50fdfc4'::uuid
  ]) as user_id
), balances as (
  -- USD is useful for wallet UI testing.
  -- USDT/BTC are required for escrow when taking sell/buy ads on these assets.
  select user_id, 'USD'::text as currency, 10000::numeric as balance, 0::numeric as locked_balance from target_users
  union all
  select user_id, 'USDT'::text as currency, 10000::numeric as balance, 0::numeric as locked_balance from target_users
  union all
  select user_id, 'BTC'::text as currency, 1::numeric as balance, 0::numeric as locked_balance from target_users
)
insert into public.wallets (user_id, currency, balance, locked_balance)
select user_id, currency, balance, locked_balance
from balances
on conflict (user_id, currency)
do update set
  balance = excluded.balance,
  locked_balance = excluded.locked_balance;

-- Verify
select user_id, currency, balance, locked_balance
from public.wallets
where user_id in (
  'dfcfb25-c08c-46b1-8132-7aa15a714417'::uuid,
  'c0a2cd7a-8d01-4e10-9ad8-b725f50fdfc4'::uuid
)
order by user_id, currency;
