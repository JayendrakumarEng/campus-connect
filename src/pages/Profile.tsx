import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RoleBadge from '@/components/RoleBadge';
import StatusBadge from '@/components/StatusBadge';
import SkillTag from '@/components/SkillTag';
import Navbar from '@/components/Navbar';
import { UserPlus, UserCheck, Github, Linkedin, Pencil, Calendar, ExternalLink, Building, CheckCircle, FileText, FolderOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const isOwn = user?.id === id;

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      const [profileRes, postsRes, followersRes, followingRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('posts').select('*').eq('author_id', id).eq('is_approved', true).order('created_at', { ascending: false }),
        supabase.from('follows').select('follower_id').eq('following_id', id),
        supabase.from('follows').select('following_id').eq('follower_id', id),
      ]);
      setProfile(profileRes.data);
      setPosts(postsRes.data || []);
      setFollowerCount(followersRes.data?.length || 0);
      setFollowingCount(followingRes.data?.length || 0);

      if (user) {
        const { data } = await supabase.from('follows').select('follower_id').eq('follower_id', user.id).eq('following_id', id);
        setIsFollowing((data?.length || 0) > 0);
      }
      setLoading(false);
    };
    fetchAll();
  }, [id, user]);

  const toggleFollow = async () => {
    if (!user || !id) return;
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', id);
      setIsFollowing(false);
      setFollowerCount(c => c - 1);
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: id });
      setIsFollowing(true);
      setFollowerCount(c => c + 1);
      toast.success('Following!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="py-20 text-center text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-2xl py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {profile.full_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-xl font-bold">{profile.full_name || 'Unnamed'}</h1>
                  <RoleBadge role={profile.role} />
                  {profile.role === 'alumni' && profile.is_verified && (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                </div>
                {profile.role === 'student' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.branch} {profile.year && `• ${profile.year} Year`}
                  </p>
                )}
                {profile.role === 'alumni' && profile.company && (
                  <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Building className="h-3 w-3" /> {profile.company}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 justify-center sm:justify-start">
                  <StatusBadge status={profile.status} />
                  <span className="text-xs text-muted-foreground">{followerCount} followers · {followingCount} following</span>
                </div>
                {profile.bio && <p className="mt-3 text-sm">{profile.bio}</p>}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {profile.skills.map((s: string) => <SkillTag key={s} skill={s} />)}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-3">
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
              <div>
                {isOwn ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/settings"><Pencil className="h-4 w-4 mr-1" /> Edit</Link>
                  </Button>
                ) : (
                  <Button size="sm" variant={isFollowing ? 'secondary' : 'default'} onClick={toggleFollow}>
                    {isFollowing ? <><UserCheck className="h-4 w-4 mr-1" /> Following</> : <><UserPlus className="h-4 w-4 mr-1" /> Follow</>}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume & Portfolio */}
        {(profile.resume_url || profile.portfolio_url || (profile.projects && JSON.parse(profile.projects || '[]').length > 0)) && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" /> Portfolio
              </h2>
              <div className="space-y-3">
                {profile.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">View Resume</span>
                    <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                  </a>
                )}
                {profile.portfolio_url && (
                  <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Portfolio Website</span>
                    <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                  </a>
                )}
                {(() => {
                  try {
                    const projs = JSON.parse(profile.projects || '[]');
                    if (projs.length > 0) {
                      return (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-2">Projects</h3>
                          <div className="space-y-2">
                            {projs.map((p: any, i: number) => (
                              <div key={i} className="rounded-lg border p-3">
                                <p className="text-sm font-semibold text-foreground">{p.title}</p>
                                {p.description && <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>}
                                <div className="flex items-center gap-3 mt-1">
                                  {p.tech && <span className="text-xs text-primary">{p.tech}</span>}
                                  {p.url && (
                                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                      View <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  } catch { return null; }
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        <h2 className="mt-8 mb-4 text-lg font-semibold">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  {post.type === 'opportunity' ? (
                    <div className="rounded-lg border bg-accent/50 p-3">
                      <div className="text-sm font-semibold text-primary">
                        {post.company_name} — {post.role_title}
                      </div>
                      <p className="mt-1 text-sm">{post.content}</p>
                      <div className="mt-2 flex items-center gap-3">
                        {post.deadline && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" /> {new Date(post.deadline).toLocaleDateString()}
                          </span>
                        )}
                        {post.apply_link && (
                          <a href={post.apply_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                            Apply <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">{post.content}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {post.created_at && formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
