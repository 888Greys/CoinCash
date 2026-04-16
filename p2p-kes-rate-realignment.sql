-- Rebalance active USDT/KES P2P order prices into 95.00 - 98.00 KES range.
-- Run this once in Supabase SQL Editor.

WITH target_orders AS (
  SELECT
    id,
    row_number() OVER (ORDER BY created_at, id) AS rn
  FROM public.p2p_orders
  WHERE status = 'active'
    AND upper(asset) = 'USDT'
    AND upper(fiat) = 'KES'
),
priced AS (
  SELECT
    id,
    -- 31 evenly spaced buckets from 95.000 to 98.000
    round((95 + ((rn - 1) % 31) * (3.0 / 30.0))::numeric, 3) AS next_price
  FROM target_orders
)
UPDATE public.p2p_orders o
SET price = p.next_price
FROM priced p
WHERE o.id = p.id;

-- Optional verification query:
-- SELECT min(price), max(price), count(*)
-- FROM public.p2p_orders
-- WHERE status = 'active' AND upper(asset) = 'USDT' AND upper(fiat) = 'KES';
