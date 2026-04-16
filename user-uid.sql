-- Add Binance-style numeric UID to profiles for existing databases
-- Safe to run once in Supabase SQL editor.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS user_uid BIGINT;

-- Create sequence for UID assignment if missing
CREATE SEQUENCE IF NOT EXISTS public.profiles_user_uid_seq START WITH 10000000;

-- Ensure next generated value starts in Binance-like 8-digit range and stays ahead of existing IDs
SELECT setval(
	'public.profiles_user_uid_seq',
	GREATEST(COALESCE((SELECT MAX(user_uid) FROM public.profiles), 9999999), 9999999) + 1,
	false
);

-- Backfill existing users that do not have a UID yet
UPDATE public.profiles
SET user_uid = nextval('public.profiles_user_uid_seq')
WHERE user_uid IS NULL;

-- Ensure future inserts automatically get a UID
ALTER TABLE public.profiles
ALTER COLUMN user_uid SET DEFAULT nextval('public.profiles_user_uid_seq');

-- Enforce constraints once data is populated
ALTER TABLE public.profiles
ALTER COLUMN user_uid SET NOT NULL;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'profiles_user_uid_key'
			AND conrelid = 'public.profiles'::regclass
	) THEN
		ALTER TABLE public.profiles
		ADD CONSTRAINT profiles_user_uid_key UNIQUE (user_uid);
	END IF;
END $$;
