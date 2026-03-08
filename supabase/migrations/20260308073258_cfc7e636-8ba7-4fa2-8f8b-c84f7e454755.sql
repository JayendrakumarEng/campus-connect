-- Success stories table
CREATE TABLE public.success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  company_name text NOT NULL,
  role_title text NOT NULL,
  package text,
  story text NOT NULL,
  tips text,
  year_of_placement text,
  created_at timestamp with time zone DEFAULT now(),
  is_approved boolean DEFAULT false
);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved stories are viewable by everyone" ON public.success_stories FOR SELECT TO authenticated USING (is_approved = true OR user_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));
CREATE POLICY "Users can create their own stories" ON public.success_stories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stories" ON public.success_stories FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stories" ON public.success_stories FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Staff and admins can update stories" ON public.success_stories FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- Add resume and portfolio fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS projects jsonb DEFAULT '[]';

-- Create resumes storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false) ON CONFLICT DO NOTHING;

-- RLS for resumes bucket
CREATE POLICY "Users can upload their own resume" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view their own resume" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update their own resume" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete their own resume" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.success_stories;