-- Events table for staff/admin to post college events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date timestamp with time zone NOT NULL,
  venue text,
  event_type text DEFAULT 'workshop',
  department text,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff and admins can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (
  has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff and admins can update events" ON public.events FOR UPDATE TO authenticated USING (
  created_by = auth.uid() OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff and admins can delete events" ON public.events FOR DELETE TO authenticated USING (
  created_by = auth.uid() OR has_role(auth.uid(), 'admin')
);

-- Polls table
CREATE TABLE public.polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]',
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true
);

ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Polls are viewable by everyone" ON public.polls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff and admins can create polls" ON public.polls FOR INSERT TO authenticated WITH CHECK (
  has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Creators can update polls" ON public.polls FOR UPDATE TO authenticated USING (
  created_by = auth.uid() OR has_role(auth.uid(), 'admin')
);

-- Poll votes
CREATE TABLE public.poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  option_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view votes" ON public.poll_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can vote" ON public.poll_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can change vote" ON public.poll_votes FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Endorsements table
CREATE TABLE public.endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill text NOT NULL,
  message text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(from_user_id, to_user_id, skill)
);

ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Endorsements are viewable by everyone" ON public.endorsements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff and admins can endorse" ON public.endorsements FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = from_user_id AND (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'))
);
CREATE POLICY "Endorsers can delete" ON public.endorsements FOR DELETE TO authenticated USING (auth.uid() = from_user_id);

-- Add department column to profiles for staff
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department text;

-- Enable realtime for events and polls
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;