-- Apply this on an existing Supabase database.
-- Do not run the full schema bootstrap again if the base tables already exist.

CREATE OR REPLACE FUNCTION public.transfer_wallet_to_user(
  p_source_wallet_id UUID,
  p_recipient_user_id UUID,
  p_amount NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sender_id UUID := auth.uid();
  v_source_wallet_id UUID;
  v_source_wallet_currency TEXT;
  v_source_wallet_balance NUMERIC;
  v_recipient_wallet_id UUID;
  v_amount NUMERIC := round(p_amount::NUMERIC, 8);
  v_reference TEXT := 'TRF-' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS') || '-' || replace(gen_random_uuid()::text, '-', '');
  v_row RECORD;
BEGIN
  IF v_sender_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  IF v_amount IS NULL OR v_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Enter a valid transfer amount');
  END IF;

  FOR v_row IN
    SELECT id, currency, balance
    FROM public.wallets
    WHERE id = p_source_wallet_id
      AND user_id = v_sender_id
    FOR UPDATE
  LOOP
    v_source_wallet_id := v_row.id;
    v_source_wallet_currency := v_row.currency;
    v_source_wallet_balance := v_row.balance;
    EXIT;
  END LOOP;

  IF v_source_wallet_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Source wallet not found');
  END IF;

  IF p_recipient_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Recipient not found');
  END IF;

  IF p_recipient_user_id = v_sender_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'You cannot transfer to your own account');
  END IF;

  FOR v_row IN
    SELECT id, balance
    FROM public.wallets
    WHERE user_id = p_recipient_user_id
      AND currency = v_source_wallet_currency
    FOR UPDATE
  LOOP
    v_recipient_wallet_id := v_row.id;
    EXIT;
  END LOOP;

  IF v_recipient_wallet_id IS NULL THEN
    INSERT INTO public.wallets (user_id, currency, balance, locked_balance)
    VALUES (p_recipient_user_id, v_source_wallet_currency, 0, 0)
    ON CONFLICT (user_id, currency) DO NOTHING
    ;

    FOR v_row IN
      SELECT id, balance
      FROM public.wallets
      WHERE user_id = p_recipient_user_id
        AND currency = v_source_wallet_currency
      FOR UPDATE
    LOOP
      v_recipient_wallet_id := v_row.id;
      EXIT;
    END LOOP;
  END IF;

  IF v_recipient_wallet_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Recipient wallet not available');
  END IF;

  IF v_source_wallet_balance < v_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient available balance');
  END IF;

  UPDATE public.wallets
  SET balance = balance - v_amount
  WHERE id = v_source_wallet_id;

  UPDATE public.wallets
  SET balance = balance + v_amount
  WHERE id = v_recipient_wallet_id;

  INSERT INTO public.transactions (wallet_id, type, amount, status, reference)
  VALUES
    (v_source_wallet_id, 'transfer_out', v_amount, 'completed', v_reference || '-OUT'),
    (v_recipient_wallet_id, 'transfer_in', v_amount, 'completed', v_reference || '-IN');

  RETURN jsonb_build_object(
    'success', true,
    'reference', v_reference,
    'currency', v_source_wallet_currency,
    'amount', v_amount,
    'sender_wallet_id', v_source_wallet_id,
    'recipient_wallet_id', v_recipient_wallet_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
