import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const StaffPostsTab = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchMyPosts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => { fetchMyPosts(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('posts').insert({
      author_id: user.id,
      content,
      type: 'update',
      is_approved: true,
    });
    if (error) {
      toast.error('Failed to post');
    } else {
      toast.success('Post published!');
      setContent('');
      setShowForm(false);
      fetchMyPosts();
    }
    setSaving(false);
  };

  const deletePost = async (id: string) => {
    await supabase.from('posts').delete().eq('id', id);
    toast.success('Post deleted');
    fetchMyPosts();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Posts</h2>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> New Post
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label>What's on your mind? *</Label>
                <Textarea value={content} onChange={e => setContent(e.target.value)} required rows={3} placeholder="Share an update, announcement, or thought..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? 'Posting...' : 'Publish'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {posts.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No posts yet.</p>
      ) : (
        posts.map(post => (
          <Card key={post.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {post.type === 'opportunity' && post.company_name && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-primary">{post.company_name}</span>
                      {post.role_title && (
                        <>
                          <span className="text-muted-foreground">—</span>
                          <span className="font-medium text-foreground">{post.role_title}</span>
                        </>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-foreground">{post.content}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    {post.deadline && (
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Deadline: {new Date(post.deadline).toLocaleDateString()}</span>
                    )}
                    <span>{post.created_at && formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    <span className={post.is_approved ? 'text-green-600' : 'text-yellow-600'}>{post.is_approved ? '✓ Live' : '⏳ Pending'}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default StaffPostsTab;
