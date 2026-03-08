import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

const StaffApprovalTab = () => {
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles!posts_author_id_fkey(full_name, role)')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });
    setPendingPosts((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPending(); }, []);

  const approve = async (id: string) => {
    await supabase.from('posts').update({ is_approved: true }).eq('id', id);
    toast.success('Post approved!');
    fetchPending();
  };

  const reject = async (id: string) => {
    await supabase.from('posts').delete().eq('id', id);
    toast.success('Post rejected');
    fetchPending();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Pending Approvals ({pendingPosts.length})</h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : pendingPosts.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No pending posts to approve.</p>
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
                  <Button size="sm" onClick={() => approve(p.id)}>
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => reject(p.id)}>
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default StaffApprovalTab;
