import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SkillsInput from '@/components/SkillsInput';
import { toast } from 'sonner';

const CompleteProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const role = profile?.role || 'student';

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [branch, setBranch] = useState(profile?.branch || '');
  const [year, setYear] = useState(profile?.year || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [githubUrl, setGithubUrl] = useState(profile?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || '');
  const [status, setStatus] = useState(profile?.status || 'Not Looking');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const updates: any = {
      full_name: fullName,
      bio,
      skills,
      linkedin_url: linkedinUrl,
    };
    if (role === 'student') {
      updates.branch = branch;
      updates.year = year;
      updates.github_url = githubUrl;
      updates.status = status;
    } else {
      updates.company = company;
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) {
      toast.error('Failed to save profile');
    } else {
      await refreshProfile();
      toast.success('Profile completed!');
      navigate('/feed');
    }
    setSaving(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Tell us about yourself ({role})</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="John Doe" />
            </div>
            {role === 'student' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Input value={branch} onChange={e => setBranch(e.target.value)} placeholder="CSE, ECE..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent>
                        {['1st', '2nd', '3rd', '4th'].map(y => (
                          <SelectItem key={y} value={y}>{y} Year</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Open to Internship', 'Placed', 'Freelancing', 'Not Looking'].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/you" />
                </div>
              </>
            )}
            {role === 'alumni' && (
              <div className="space-y-2">
                <Label>Company</Label>
                <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Your current company" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="A short bio about yourself..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Skills</Label>
              <SkillsInput skills={skills} onChange={setSkills} />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/you" />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfile;
