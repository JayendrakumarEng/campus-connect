import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import RoleBadge from '@/components/RoleBadge';
import Navbar from '@/components/Navbar';
import { Bookmark, Calendar, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const Bookmarks = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('post_id')
        .eq('user_id', user.id);

      if (bookmarks && bookmarks.length > 0) {
        const ids = bookmarks.map(b => b.post_id);
        const { data } = await supabase
          .from('posts')
          .select('*, profiles!posts_author_id_fkey(full_name, avatar_url, role)')
          .in('id', ids)
          .order('created_at', { ascending: false });
        setPosts((data as any) || []);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-16 md:pb-0">
      <Navbar />
      <main className="container max-w-2xl py-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 text-2xl font-bold"
        >
          <Bookmark className="h-6 w-6" /> Bookmarks
        </motion.h1>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-12 text-center">
            <Bookmark className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No bookmarks yet.</p>
          </motion.div>
        ) : (
          <div className="space-y-4 stagger-fade-in">
            {posts.map((post: any) => (
              <Card key={post.id} className="glass-card-hover rounded-2xl">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-border/30">
                      <AvatarImage src={post.profiles?.avatar_url || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {post.profiles?.full_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{post.profiles?.full_name}</span>
                        <RoleBadge role={post.profiles?.role} />
                        <span className="text-xs text-muted-foreground">
                          {post.created_at && formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      {post.type === 'opportunity' ? (
                        <div className="mt-2 rounded-xl border border-primary/10 bg-primary/5 p-3">
                          <div className="text-sm font-semibold text-primary">{post.company_name} — {post.role_title}</div>
                          <p className="mt-1 text-sm">{post.content}</p>
                          <div className="mt-2 flex items-center gap-3">
                            {post.deadline && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" /> {new Date(post.deadline).toLocaleDateString()}
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
                      ) : (
                        <p className="mt-2 text-sm">{post.content}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
