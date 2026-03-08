import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { Shield, Check, X, Building, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { profile } = useAuth();
  const [unverifiedAlumni, setUnverifiedAlumni] = useState<any[]>([]);
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [alumniRes, postsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'alumni').eq('is_verified', false),
      supabase.from('posts').select('*, profiles!posts_author_id_fkey(full_name, role)').eq('is_approved', false),
    ]);
    setUnverifiedAlumni(alumniRes.data || []);
    setPendingPosts((postsRes.data as any) || []);
    setLoading(false);
  };

  const verifyAlumni = async (id: string) => {
    await supabase.from('profiles').update({ is_verified: true }).eq('id', id);
    toast.success('Alumni verified!');
    fetchData();
  };

  const rejectAlumni = async (id: string) => {
    await supabase.from('profiles').update({ role: 'student' }).eq('id', id);
    toast.success('Alumni rejected.');
    fetchData();
  };

  const approvePost = async (id: string) => {
    await supabase.from('posts').update({ is_approved: true }).eq('id', id);
    toast.success('Post approved!');
    fetchData();
  };

  const rejectPost = async (id: string) => {
    await supabase.from('posts').delete().eq('id', id);
    toast.success('Post rejected.');
    fetchData();
  };

  if (profile?.role !== 'admin') {
    return <Navigate to="/feed" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-3xl py-6">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <Shield className="h-6 w-6" /> Admin Panel
        </h1>

        <Tabs defaultValue="alumni">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="alumni" className="flex-1">
              <Building className="h-4 w-4 mr-1" /> Alumni Verification ({unverifiedAlumni.length})
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex-1">
              <FileText className="h-4 w-4 mr-1" /> Pending Posts ({pendingPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alumni" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : unverifiedAlumni.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No pending verifications.</p>
            ) : (
              unverifiedAlumni.map(a => (
                <Card key={a.id}>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div>
                      <p className="font-semibold">{a.full_name || a.email}</p>
                      <p className="text-sm text-muted-foreground">{a.company} · {a.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => verifyAlumni(a.id)}>
                        <Check className="h-4 w-4 mr-1" /> Verify
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => rejectAlumni(a.id)}>
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : pendingPosts.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No pending posts.</p>
            ) : (
              pendingPosts.map((p: any) => (
                <Card key={p.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{p.profiles?.full_name || 'Unknown'}</p>
                        {p.company_name && <p className="text-sm text-primary font-medium">{p.company_name} — {p.role_title}</p>}
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{p.content}</p>
                      </div>
                      <div className="flex gap-2 ml-4 shrink-0">
                        <Button size="sm" onClick={() => approvePost(p.id)}>
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => rejectPost(p.id)}>
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
