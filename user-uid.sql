-- Add Binance-style numeric UID to profiles for existing databases
-- Safe to run once in Supabase SQL editor.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS user_uid BIGINT;

-- Create sequence for UID assignment if missing
CREATE SEQUENCE IF NOT EXISTS public.profiles_user_uid_seq START WITH 8746484;

-- Ensure next generated value stays in requested 7-digit style (e.g. 8746484)
SELECT setval(
	'public.profiles_user_uid_seq',
	GREATEST(
		COALESCE((SELECT MAX(user_uid) FROM public.profiles WHERE user_uid BETWEEN 8746484 AND 9999999), 8746483),
		8746483
	) + 1,
	false
);

-- Backfill existing users missing UID or outside this 7-digit range
UPDATE public.profiles
SET user_uid = nextval('public.profiles_user_uid_seq')
WHERE user_uid IS NULL OR user_uid < 8746484 OR user_uid > 9999999;

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
