import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Award, Search, Star } from 'lucide-react';
import { toast } from 'sonner';

const StaffEndorseTab = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [skill, setSkill] = useState('');
  const [message, setMessage] = useState('');
  const [myEndorsements, setMyEndorsements] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['student', 'alumni'])
      .order('full_name');
    setStudents(data || []);
  };

  const fetchMyEndorsements = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('endorsements')
      .select('*, profiles!endorsements_to_user_id_fkey(full_name, avatar_url)')
      .eq('from_user_id', user.id)
      .order('created_at', { ascending: false });
    setMyEndorsements((data as any) || []);
  };

  useEffect(() => { fetchStudents(); fetchMyEndorsements(); }, [user]);

  const filtered = students.filter(s => {
    if (!search) return false;
    const q = search.toLowerCase();
    return s.full_name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
  });

  const handleEndorse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedStudent) return;
    setSaving(true);
    const { error } = await supabase.from('endorsements').insert({
      from_user_id: user.id,
      to_user_id: selectedStudent.id,
      skill,
      message: message || null,
    });
    if (error) {
      if (error.code === '23505') toast.error('You already endorsed this skill for this student');
      else toast.error('Failed to endorse');
    } else {
      toast.success(`Endorsed ${selectedStudent.full_name} for ${skill}!`);
      setSelectedStudent(null); setSkill(''); setMessage(''); setSearch('');
      fetchMyEndorsements();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Award className="h-5 w-5 text-primary" /> Endorse Students
      </h2>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Search Student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Type a student name or email..." className="pl-9" />
              </div>
            </div>

            {search && filtered.length > 0 && !selectedStudent && (
              <div className="rounded-lg border max-h-48 overflow-y-auto">
                {filtered.slice(0, 10).map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedStudent(s); setSearch(s.full_name || ''); }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={s.avatar_url || ''} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">{s.full_name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{s.branch} · {s.year}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedStudent && (
              <form onSubmit={handleEndorse} className="space-y-3 mt-2 p-3 rounded-lg bg-accent/50">
                <p className="text-sm text-foreground">
                  Endorsing <strong>{selectedStudent.full_name}</strong>
                  <button type="button" onClick={() => { setSelectedStudent(null); setSearch(''); }} className="ml-2 text-xs text-destructive hover:underline">Change</button>
                </p>
                <div className="space-y-1">
                  <Label>Skill *</Label>
                  <Input value={skill} onChange={e => setSkill(e.target.value)} required placeholder="e.g. Python, Leadership, Machine Learning" />
                </div>
                <div className="space-y-1">
                  <Label>Message (optional)</Label>
                  <Textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="A short note about this student's ability..." />
                </div>
                <Button type="submit" disabled={saving} size="sm">{saving ? 'Endorsing...' : 'Endorse'}</Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      {myEndorsements.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Your Recent Endorsements</h3>
          <div className="space-y-2">
            {myEndorsements.map((e: any) => (
              <Card key={e.id}>
                <CardContent className="py-3 px-4 flex items-center gap-3">
                  <Star className="h-4 w-4 text-yellow-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">{e.profiles?.full_name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">{e.skill}</Badge>
                    {e.message && <p className="text-xs text-muted-foreground mt-0.5">{e.message}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffEndorseTab;
