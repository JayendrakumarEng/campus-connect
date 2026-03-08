import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const StaffPollsTab = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState<any[]>([]);
  const [voteCounts, setVoteCounts] = useState<Record<string, any[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiresAt, setExpiresAt] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchPolls = async () => {
    const { data } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false });
    setPolls(data || []);

    // Fetch vote counts for each poll
    if (data) {
      const counts: Record<string, any[]> = {};
      for (const poll of data) {
        const { data: votes } = await supabase
          .from('poll_votes')
          .select('option_index')
          .eq('poll_id', poll.id);
        counts[poll.id] = votes || [];
      }
      setVoteCounts(counts);
    }
  };

  useEffect(() => { fetchPolls(); }, []);

  const addOption = () => { if (options.length < 6) setOptions([...options, '']); };
  const removeOption = (i: number) => { if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const filtered = options.filter(o => o.trim());
    if (filtered.length < 2) { toast.error('Need at least 2 options'); return; }
    setSaving(true);
    const { error } = await supabase.from('polls').insert({
      question,
      options: JSON.stringify(filtered),
      created_by: user.id,
      expires_at: expiresAt || null,
    });
    if (error) {
      toast.error('Failed to create poll');
    } else {
      toast.success('Poll created!');
      setQuestion(''); setOptions(['', '']); setExpiresAt('');
      setShowForm(false);
      fetchPolls();
    }
    setSaving(false);
  };

  const deletePoll = async (id: string) => {
    await supabase.from('polls').delete().eq('id', id);
    toast.success('Poll deleted');
    fetchPolls();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Polls</h2>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Create Poll
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label>Question *</Label>
                <Input value={question} onChange={e => setQuestion(e.target.value)} required placeholder="e.g. Which elective should we offer next semester?" />
              </div>
              <div className="space-y-2">
                <Label>Options (min 2, max 6)</Label>
                {options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={opt}
                      onChange={e => { const n = [...options]; n[i] = e.target.value; setOptions(n); }}
                      placeholder={`Option ${i + 1}`}
                    />
                    {options.length > 2 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(i)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {options.length < 6 && (
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>+ Add Option</Button>
                )}
              </div>
              <div className="space-y-1">
                <Label>Expires At (optional)</Label>
                <Input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create Poll'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {polls.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No polls yet.</p>
      ) : (
        polls.map(poll => {
          const pollOptions: string[] = typeof poll.options === 'string' ? JSON.parse(poll.options) : (poll.options || []);
          const votes = voteCounts[poll.id] || [];
          const totalVotes = votes.length;

          return (
            <Card key={poll.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{poll.question}</h3>
                    <div className="mt-3 space-y-2">
                      {pollOptions.map((opt: string, i: number) => {
                        const count = votes.filter((v: any) => v.option_index === i).length;
                        const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-foreground">{opt}</span>
                              <span className="text-muted-foreground">{count} votes ({pct}%)</span>
                            </div>
                            <Progress value={pct} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {totalVotes} total votes · Created {poll.created_at && formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deletePoll(poll.id)} className="text-destructive hover:text-destructive ml-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default StaffPollsTab;
