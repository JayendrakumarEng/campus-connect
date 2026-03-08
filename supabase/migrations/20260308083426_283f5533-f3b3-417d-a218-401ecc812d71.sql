
-- Create story_likes table
CREATE TABLE public.story_likes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES public.success_stories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, story_id)
);

-- Enable RLS
ALTER TABLE public.story_likes ENABLE ROW LEVEL SECURITY;

-- Everyone can see likes
CREATE POLICY "Likes are viewable by everyone"
  ON public.story_likes FOR SELECT
  USING (true);

-- Authenticated users can like
CREATE POLICY "Users can like stories"
  ON public.story_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unlike
CREATE POLICY "Users can unlike stories"
  ON public.story_likes FOR DELETE
  USING (auth.uid() = user_id);
