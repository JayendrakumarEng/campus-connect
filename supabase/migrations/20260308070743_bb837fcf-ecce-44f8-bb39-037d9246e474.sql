-- Enable realtime for posts table
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- Add 'staff' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';