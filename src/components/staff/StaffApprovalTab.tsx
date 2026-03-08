import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, FileText, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const StaffApprovalTab = () => {
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [pendingStories, setPendingStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    const [postsRes, storiesRes] = await Promise.all([
      supabase.from('posts').select('*, profiles!posts_author_id_fkey(full_name, role)').eq('is_approved', false).order('created_at', { ascending: false }),
      supabase.from('success_stories').select('*, profiles!success_stories_user_id_fkey(full_name)').eq('is_approved', false).order('created_at', { ascending: false }),
    ]);
    setPendingPosts((postsRes.data as any) || []);
    setPendingStories((storiesRes.data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPending(); }, []);

  const approvePost = async (id: string) => {
    await supabase.from('posts').update({ is_approved: true }).eq('id', id);
    toast.success('Post approved!');
    fetchPending();
  };
  const rejectPost = async (id: string) => {
    await supabase.from('posts').delete().eq('id', id);
    toast.success('Post rejected');
    fetchPending();
  };
  const approveStory = async (id: string) => {
    await supabase.from('success_stories').update({ is_approved: true }).eq('id', id);
    toast.success('Story approved!');
    fetchPending();
  };
  const rejectStory = async (id: string) => {
    await supabase.from('success_stories').delete().eq('id', id);
    toast.success('Story rejected');
    fetchPending();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Pending Approvals</h2>

      <Tabs defaultValue="posts">
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="flex-1 gap-1">
            <FileText className="h-4 w-4" /> Posts ({pendingPosts.length})
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex-1 gap-1">
            <Trophy className="h-4 w-4" /> Stories ({pendingStories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-3 mt-4">
          {pendingPosts.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No pending posts.</p>
          ) : (
            pendingPosts.map((p: any) => (
              <Card key={p.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{p.profiles?.full_name || 'Unknown'} <span className="text-xs text-muted-foreground capitalize">({p.profiles?.role})</span></p>
                      {p.company_name && <p className="text-sm text-primary font-medium">{p.company_name} — {p.role_title}</p>}
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{p.content}</p>
                    </div>
                    <div className="flex gap-2 ml-4 shrink-0">
                      <Button size="sm" onClick={() => approvePost(p.id)}><Check className="h-4 w-4 mr-1" /> Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => rejectPost(p.id)}><X className="h-4 w-4 mr-1" /> Reject</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="stories" className="space-y-3 mt-4">
          {pendingStories.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No pending stories.</p>
          ) : (
            pendingStories.map((s: any) => (
              <Card key={s.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{s.profiles?.full_name || 'Unknown'}</p>
                      <p className="text-sm font-bold text-foreground mt-1">{s.title}</p>
                      <p className="text-sm text-primary">{s.company_name} — {s.role_title} {s.package && `(${s.package})`}</p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-4">{s.story}</p>
                    </div>
                    <div className="flex gap-2 ml-4 shrink-0">
                      <Button size="sm" onClick={() => approveStory(s.id)}><Check className="h-4 w-4 mr-1" /> Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => rejectStory(s.id)}><X className="h-4 w-4 mr-1" /> Reject</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffApprovalTab;
