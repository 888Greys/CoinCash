-- Test funding for two users so P2P buy/sell can be exercised quickly.
-- Run in Supabase SQL Editor.

with target_users as (
  -- Picks the two most recent ad posters automatically.
  select distinct on (o.user_id) o.user_id
  from public.p2p_orders o
  order by o.user_id, o.created_at desc
  limit 2
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
with target_users as (
  select distinct on (o.user_id) o.user_id
  from public.p2p_orders o
  order by o.user_id, o.created_at desc
  limit 2
)
select user_id, currency, balance, locked_balance
from public.wallets
where user_id in (select user_id from target_users)
order by user_id, currency;
