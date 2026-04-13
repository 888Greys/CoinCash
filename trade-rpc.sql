-- Database Functions for Secure ACID Transactions

-- 1. Take an Order & Lock Escrow atomically
CREATE OR REPLACE FUNCTION take_p2p_order(
  p_order_id UUID,
  p_taker_id UUID,
  p_asset_amount NUMERIC
) RETURNS JSON AS $$
DECLARE
  v_order RECORD;
  v_seller_wallet RECORD;
  v_trade_id UUID;
  v_fiat_amount NUMERIC;
BEGIN
  -- Lock the order row
  SELECT * INTO v_order FROM p2p_orders WHERE id = p_order_id FOR UPDATE;
  
  IF NOT FOUND OR v_order.status != 'active' THEN
    RETURN json_build_object('success', false, 'error', 'Order not available');
  END IF;

  -- Calculate fiat amount
  v_fiat_amount := p_asset_amount * v_order.price;

  -- Determine who is buyer and seller
  IF v_order.type = 'sell' THEN
    -- The ad poster is selling. The taker is buying.
    -- We must lock the ad poster's (seller's) crypto.
    SELECT * INTO v_seller_wallet FROM wallets 
      WHERE user_id = v_order.user_id AND currency = v_order.asset FOR UPDATE;
      
    IF v_seller_wallet.balance < p_asset_amount THEN
      RETURN json_build_object('success', false, 'error', 'Seller has insufficient balance');
    END IF;

    -- Move from balance to locked_balance
    UPDATE wallets SET 
      balance = balance - p_asset_amount,
      locked_balance = locked_balance + p_asset_amount
    WHERE id = v_seller_wallet.id;

    -- Create trade
    INSERT INTO p2p_trades (order_id, buyer_id, seller_id, asset_amount, fiat_amount)
    VALUES (p_order_id, p_taker_id, v_order.user_id, p_asset_amount, v_fiat_amount)
    RETURNING id INTO v_trade_id;

  ELSE
    -- The ad poster is buying. The taker is selling.
    -- We must lock the taker's (seller's) crypto.
    SELECT * INTO v_seller_wallet FROM wallets 
      WHERE user_id = p_taker_id AND currency = v_order.asset FOR UPDATE;

    IF v_seller_wallet.balance < p_asset_amount THEN
      RETURN json_build_object('success', false, 'error', 'You have insufficient balance to sell');
    END IF;

    UPDATE wallets SET 
      balance = balance - p_asset_amount,
      locked_balance = locked_balance + p_asset_amount
    WHERE id = v_seller_wallet.id;

    INSERT INTO p2p_trades (order_id, buyer_id, seller_id, asset_amount, fiat_amount)
    VALUES (p_order_id, v_order.user_id, p_taker_id, p_asset_amount, v_fiat_amount)
    RETURNING id INTO v_trade_id;
  END IF;

  RETURN json_build_object('success', true, 'trade_id', v_trade_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Release Escrow to Buyer atomically
CREATE OR REPLACE FUNCTION release_p2p_trade(
  p_trade_id UUID,
  p_user_id UUID
) RETURNS JSON AS $$
DECLARE
  v_trade RECORD;
  v_order RECORD;
BEGIN
  -- Lock trade row
  SELECT * INTO v_trade FROM p2p_trades WHERE id = p_trade_id FOR UPDATE;
  
  IF NOT FOUND OR (v_trade.status != 'pending' AND v_trade.status != 'paid') THEN
    RETURN json_build_object('success', false, 'error', 'Trade not pending or paid, or not found');
  END IF;

  -- Only seller can release
  IF v_trade.seller_id != p_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Only the seller can release funds');
  END IF;

  SELECT * INTO v_order FROM p2p_orders WHERE id = v_trade.order_id;

  -- Unlock from seller and credit to buyer
  UPDATE wallets SET locked_balance = locked_balance - v_trade.asset_amount
    WHERE user_id = v_trade.seller_id AND currency = v_order.asset;
    
  UPDATE wallets SET balance = balance + v_trade.asset_amount
    WHERE user_id = v_trade.buyer_id AND currency = v_order.asset;

  -- Record translation logic omitted here for brevity, usually you insert into `transactions` table

  -- Mark Trade as released
  UPDATE p2p_trades SET status = 'released' WHERE id = p_trade_id;

  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
