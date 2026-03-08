import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import SkillTag from '@/components/SkillTag';
import Navbar from '@/components/Navbar';
import { UserPlus, UserCheck, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name: string | null;
  role: string | null;
  branch: string | null;
  year: string | null;
  skills: string[] | null;
  status: string | null;
  avatar_url: string | null;
}

const Explore = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProfiles();
    fetchFollowing();
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role, branch, year, skills, status, avatar_url')
      .eq('role', 'student')
      .not('full_name', 'is', null)
      .order('created_at', { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  };

  const fetchFollowing = async () => {
    if (!user) return;
    const { data } = await supabase.from('follows').select('following_id').eq('follower_id', user.id);
    setFollowing(new Set(data?.map(f => f.following_id) || []));
  };

  const toggleFollow = async (profileId: string) => {
    if (!user) return;
    if (following.has(profileId)) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', profileId);
      setFollowing(prev => { const n = new Set(prev); n.delete(profileId); return n; });
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: profileId });
      setFollowing(prev => new Set(prev).add(profileId));
      toast.success('Following!');
    }
  };

  const filtered = profiles.filter(p => {
    if (search && !p.full_name?.toLowerCase().includes(search.toLowerCase()) &&
        !p.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    if (branchFilter !== 'all' && p.branch !== branchFilter) return false;
    if (yearFilter !== 'all' && p.year !== yearFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const branches = [...new Set(profiles.map(p => p.branch).filter(Boolean))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-4xl py-6">
        <h1 className="mb-6 text-2xl font-bold">Explore Students</h1>

        <div className="mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or skill..." className="pl-9" />
          </div>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Branch" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map(b => <SelectItem key={b} value={b!}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {['1st', '2nd', '3rd', '4th'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {['Open to Internship', 'Placed', 'Freelancing', 'Not Looking'].map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No students found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map(p => (
              <Card key={p.id} className="animate-fade-in hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Link to={`/profile/${p.id}`}>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={p.avatar_url || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary">{p.full_name?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/profile/${p.id}`} className="font-semibold hover:text-primary transition-colors">
                        {p.full_name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <RoleBadge role={p.role} />
                        <StatusBadge status={p.status} />
                      </div>
                      {(p.branch || p.year) && (
                        <p className="text-xs text-muted-foreground mt-1">{p.branch} {p.year && `• ${p.year} Year`}</p>
                      )}
                      {p.skills && p.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.skills.slice(0, 4).map(s => <SkillTag key={s} skill={s} />)}
                          {p.skills.length > 4 && <span className="text-xs text-muted-foreground">+{p.skills.length - 4}</span>}
                        </div>
                      )}
                    </div>
                    {user?.id !== p.id && (
                      <Button
                        size="sm"
                        variant={following.has(p.id) ? 'secondary' : 'default'}
                        onClick={() => toggleFollow(p.id)}
                      >
                        {following.has(p.id) ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                      </Button>
                    )}
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

export default Explore;
