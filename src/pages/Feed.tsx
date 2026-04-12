import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RoleBadge from '@/components/RoleBadge';
import Navbar from '@/components/Navbar';
import CreatePostDialog from '@/components/CreatePostDialog';
import { Plus, Heart, Bookmark, BookmarkCheck, ExternalLink, Calendar, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface PostWithAuthor {
  id: string;
  content: string;
  type: string;
  company_name: string | null;
  role_title: string | null;
  apply_link: string | null;
  deadline: string | null;
  created_at: string | null;
  author_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
  } | null;
}

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles!posts_author_id_fkey(full_name, avatar_url, role)')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    setPosts((data as any) || []);
    setLoading(false);
  };

  const fetchBookmarks = async () => {
    if (!user) return;
    const { data } = await supabase.from('bookmarks').select('post_id').eq('user_id', user.id);
    setBookmarkedIds(new Set(data?.map(b => b.post_id) || []));
  };

  useEffect(() => {
    fetchPosts();
    fetchBookmarks();

    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => { fetchPosts(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const toggleBookmark = async (postId: string) => {
    if (!user) return;
    if (bookmarkedIds.has(postId)) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', postId);
      setBookmarkedIds(prev => { const n = new Set(prev); n.delete(postId); return n; });
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, post_id: postId });
      setBookmarkedIds(prev => new Set(prev).add(postId));
      toast.success('Bookmarked!');
    }
  };

  const toggleLike = (postId: string) => {
    setLikedIds(prev => {
      const n = new Set(prev);
      if (n.has(postId)) n.delete(postId); else n.add(postId);
      return n;
    });
  };

  const filtered = posts.filter(p => {
    if (tab === 'opportunities' && p.type !== 'opportunity') return false;
    if (search) {
      const q = search.toLowerCase();
      const matchesContent = p.content?.toLowerCase().includes(q);
      const matchesAuthor = p.profiles?.full_name?.toLowerCase().includes(q);
      const matchesCompany = p.company_name?.toLowerCase().includes(q);
      const matchesRole = p.role_title?.toLowerCase().includes(q);
      if (!matchesContent && !matchesAuthor && !matchesCompany && !matchesRole) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-20 md:pb-0">
      <Navbar />
      <main className="container max-w-2xl py-6">
        {/* Glass search bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative mb-4"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts by content or author..."
            className="pl-9 glass-input rounded-xl"
          />
        </motion.div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 w-full glass-card rounded-xl">
            <TabsTrigger value="all" className="flex-1">All Posts</TabsTrigger>
            <TabsTrigger value="opportunities" className="flex-1">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value={tab}>
            <div className="space-y-4 stagger-fade-in">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                  {search ? 'No posts match your search.' : 'No posts yet. Be the first!'}
                </p>
              ) : (
                filtered.map(post => (
                  <Card key={post.id} className="glass-card-hover rounded-2xl overflow-hidden">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-border/30">
                          <AvatarImage src={post.profiles?.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {post.profiles?.full_name?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{post.profiles?.full_name || 'Unknown'}</span>
                            <RoleBadge role={post.profiles?.role || null} />
                            <span className="text-xs text-muted-foreground">
                              {post.created_at && formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            </span>
                          </div>

                          {post.type === 'opportunity' && (
                            <div className="mt-2 rounded-xl border border-primary/10 bg-primary/5 p-3">
                              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                {post.company_name && <span>{post.company_name}</span>}
                                {post.role_title && <span>— {post.role_title}</span>}
                              </div>
                              <p className="mt-1 text-sm text-foreground">{post.content}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-3">
                                {post.deadline && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" /> Deadline: {new Date(post.deadline).toLocaleDateString()}
                                  </span>
                                )}
                                {post.apply_link && (
                                  <Button size="sm" className="rounded-lg" asChild>
                                    <a href={post.apply_link} target="_blank" rel="noopener noreferrer">
                                      Apply <ExternalLink className="ml-1 h-3 w-3" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {post.type === 'update' && (
                            <p className="mt-2 text-sm text-foreground">{post.content}</p>
                          )}

                          <div className="mt-3 flex items-center gap-4">
                            <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-all duration-200 hover:scale-110">
                              <Heart className={`h-4 w-4 transition-all ${likedIds.has(post.id) ? 'fill-destructive text-destructive scale-110' : ''}`} />
                            </button>
                            <button onClick={() => toggleBookmark(post.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110">
                              {bookmarkedIds.has(post.id) ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Floating Action Button — raised above mobile nav */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed bottom-24 md:bottom-8 right-6 z-40"
        >
          <Button
            onClick={() => setShowCreate(true)}
            className="h-14 w-14 rounded-2xl glass-fab"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>

        <CreatePostDialog open={showCreate} onOpenChange={setShowCreate} onPostCreated={fetchPosts} />
      </main>
    </div>
  );
};

export default Feed;
