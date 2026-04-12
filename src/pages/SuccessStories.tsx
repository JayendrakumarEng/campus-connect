import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Plus, Building, Briefcase, Lightbulb, Quote, Star, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface Story {
  id: string;
  title: string;
  company_name: string;
  role_title: string;
  package: string | null;
  story: string;
  tips: string | null;
  year_of_placement: string | null;
  created_at: string | null;
  user_id: string;
  is_approved: boolean;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    branch: string | null;
  } | null;
}

const SuccessStories = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [pkg, setPkg] = useState('');
  const [story, setStory] = useState('');
  const [tips, setTips] = useState('');
  const [yearOfPlacement, setYearOfPlacement] = useState('');
  const [saving, setSaving] = useState(false);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [likingStory, setLikingStory] = useState<string | null>(null);

  const fetchStories = async () => {
    const { data } = await supabase
      .from('success_stories')
      .select('*, profiles!success_stories_user_id_fkey(full_name, avatar_url, branch)')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    setStories((data as any) || []);
    setLoading(false);
  };

  const fetchLikes = async (storyIds: string[]) => {
    if (storyIds.length === 0) return;
    const { data: allLikes } = await supabase
      .from('story_likes')
      .select('story_id')
      .in('story_id', storyIds);

    const countsMap: Record<string, number> = {};
    (allLikes || []).forEach((l: any) => {
      countsMap[l.story_id] = (countsMap[l.story_id] || 0) + 1;
    });
    setLikes(countsMap);

    if (user) {
      const { data: myLikes } = await supabase
        .from('story_likes')
        .select('story_id')
        .eq('user_id', user.id)
        .in('story_id', storyIds);
      setUserLikes(new Set((myLikes || []).map((l: any) => l.story_id)));
    }
  };

  useEffect(() => { fetchStories(); }, []);

  useEffect(() => {
    if (stories.length > 0) {
      fetchLikes(stories.map(s => s.id));
    }
  }, [stories, user]);

  const toggleLike = async (storyId: string) => {
    if (!user) {
      toast.error('Please sign in to like stories');
      return;
    }
    setLikingStory(storyId);
    if (userLikes.has(storyId)) {
      await supabase.from('story_likes').delete().eq('user_id', user.id).eq('story_id', storyId);
      setUserLikes(prev => { const s = new Set(prev); s.delete(storyId); return s; });
      setLikes(prev => ({ ...prev, [storyId]: (prev[storyId] || 1) - 1 }));
    } else {
      await supabase.from('story_likes').insert({ user_id: user.id, story_id: storyId });
      setUserLikes(prev => new Set(prev).add(storyId));
      setLikes(prev => ({ ...prev, [storyId]: (prev[storyId] || 0) + 1 }));
    }
    setLikingStory(null);
  };

  const askQuery = async (authorId: string, authorName: string) => {
    if (!user) {
      toast.error('Please sign in to send a query');
      return;
    }
    if (authorId === user.id) {
      toast.info("That's your own story!");
      return;
    }

    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1.eq.${user.id},participant_2.eq.${authorId}),and(participant_1.eq.${authorId},participant_2.eq.${user.id})`);

    if (existing && existing.length > 0) {
      toast.success(`Opening chat with ${authorName}`);
      navigate('/messages');
      return;
    }

    const { error } = await supabase
      .from('conversations')
      .insert({ participant_1: user.id, participant_2: authorId });

    if (error) {
      toast.error('Could not start conversation');
      return;
    }

    toast.success(`Chat started with ${authorName}! Redirecting...`);
    navigate('/messages');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('success_stories').insert({
      user_id: user.id,
      title,
      company_name: companyName,
      role_title: roleTitle,
      package: pkg || null,
      story,
      tips: tips || null,
      year_of_placement: yearOfPlacement || null,
    });
    if (error) {
      toast.error('Failed to submit story');
    } else {
      toast.success('Story submitted for review! It will appear once approved.');
      setTitle(''); setCompanyName(''); setRoleTitle(''); setPkg(''); setStory(''); setTips(''); setYearOfPlacement('');
      setShowForm(false);
      fetchStories();
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-16 md:pb-0">
      <Navbar />
      <main className="container max-w-3xl py-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl glass-card">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Success Stories</h1>
          <p className="mt-2 text-muted-foreground">Real journeys from TINT students who made it big. Get inspired!</p>
          <Button onClick={() => setShowForm(true)} className="mt-4 rounded-xl">
            <Plus className="h-4 w-4 mr-1" /> Share Your Story
          </Button>
        </motion.div>

        {/* Stories List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : stories.length === 0 ? (
          <div className="glass-card rounded-2xl py-12 text-center">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No success stories yet. Be the first to share yours!</p>
          </div>
        ) : (
          <div className="space-y-6 stagger-fade-in">
            {stories.map(s => (
              <Card key={s.id} className="glass-card-hover rounded-2xl overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 shrink-0 ring-2 ring-border/30">
                      <AvatarImage src={s.profiles?.avatar_url || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary">{s.profiles?.full_name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-foreground">{s.profiles?.full_name}</span>
                        {s.profiles?.branch && <Badge variant="secondary" className="text-xs rounded-lg">{s.profiles.branch}</Badge>}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-primary font-semibold">
                          <Building className="h-4 w-4" /> {s.company_name}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Briefcase className="h-4 w-4" /> {s.role_title}
                        </span>
                        {s.package && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 rounded-lg">
                            <Star className="h-3 w-3 mr-1" /> {s.package}
                          </Badge>
                        )}
                        {s.year_of_placement && (
                          <span className="text-xs text-muted-foreground">Batch {s.year_of_placement}</span>
                        )}
                      </div>

                      <div className="mt-4 rounded-xl glass-card p-4">
                        <Quote className="h-5 w-5 text-primary/40 mb-2" />
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{s.story}</p>
                      </div>

                      {s.tips && (
                        <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1">
                            <Lightbulb className="h-4 w-4" /> Tips for Juniors
                          </div>
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{s.tips}</p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-4 border-t border-border/30 pt-3">
                        <button
                          onClick={() => toggleLike(s.id)}
                          disabled={likingStory === s.id}
                          className="flex items-center gap-1.5 text-sm transition-all hover:text-red-500 hover:scale-110 group"
                        >
                          <Heart
                            className={`h-5 w-5 transition-all ${
                              userLikes.has(s.id)
                                ? 'fill-red-500 text-red-500 scale-110'
                                : 'text-muted-foreground group-hover:text-red-500'
                            }`}
                          />
                          <span className={userLikes.has(s.id) ? 'text-red-500 font-medium' : 'text-muted-foreground'}>
                            {likes[s.id] || 0}
                          </span>
                        </button>

                        {user && s.user_id !== user.id && (
                          <button
                            onClick={() => askQuery(s.user_id, s.profiles?.full_name || 'Author')}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-all hover:scale-105 group"
                          >
                            <MessageCircle className="h-5 w-5 group-hover:text-primary transition-colors" />
                            <span>Ask a Query</span>
                          </button>
                        )}

                        <span className="ml-auto text-xs text-muted-foreground">
                          {s.created_at && formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Submit Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle>Share Your Placement Story</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label>Story Title *</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. My Journey to Google — From TINT to Mountain View" className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Company *</Label>
                  <Input value={companyName} onChange={e => setCompanyName(e.target.value)} required placeholder="e.g. Amazon" className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label>Role *</Label>
                  <Input value={roleTitle} onChange={e => setRoleTitle(e.target.value)} required placeholder="e.g. SDE-1" className="rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Package (optional)</Label>
                  <Input value={pkg} onChange={e => setPkg(e.target.value)} placeholder="e.g. ₹12 LPA" className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label>Year of Placement</Label>
                  <Input value={yearOfPlacement} onChange={e => setYearOfPlacement(e.target.value)} placeholder="e.g. 2025" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Your Journey *</Label>
                <Textarea value={story} onChange={e => setStory(e.target.value)} required rows={5} placeholder="Share your preparation strategy, interview experience, how TINT helped..." className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label>Tips for Juniors (optional)</Label>
                <Textarea value={tips} onChange={e => setTips(e.target.value)} rows={3} placeholder="What advice would you give students preparing now?" className="rounded-xl" />
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={saving}>
                {saving ? 'Submitting...' : 'Submit Story for Review'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default SuccessStories;
