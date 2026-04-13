-- Payment proof storage bucket + strict policies
-- Run this in Supabase SQL Editor.

-- 1) Create bucket if missing (public so proof URLs can be rendered in chat)
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do update set public = true;

-- 2) Remove broad policies if they exist
DROP POLICY IF EXISTS "auth users can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "auth users can read payment proofs" ON storage.objects;

-- 3) Restrictive policy: only trade participants can upload into <tradeId>/... path
create policy "trade participants upload own trade proofs"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'payment-proofs'
  and split_part(name, '/', 1) ~ '^[0-9a-fA-F-]{36}$'
  and exists (
    select 1
    from public.p2p_trades t
    where t.id = split_part(name, '/', 1)::uuid
      and (t.buyer_id = auth.uid() or t.seller_id = auth.uid())
  )
);

-- 4) Restrictive policy: only trade participants can read proofs for that trade
create policy "trade participants read own trade proofs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and split_part(name, '/', 1) ~ '^[0-9a-fA-F-]{36}$'
  and exists (
    select 1
    from public.p2p_trades t
    where t.id = split_part(name, '/', 1)::uuid
      and (t.buyer_id = auth.uid() or t.seller_id = auth.uid())
  )
);
