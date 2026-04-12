import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SkillsInput from '@/components/SkillsInput';
import ResumePortfolioSection from '@/components/ResumePortfolioSection';
import Navbar from '@/components/Navbar';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user, profile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [branch, setBranch] = useState(profile?.branch || '');
  const [year, setYear] = useState(profile?.year || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [githubUrl, setGithubUrl] = useState(profile?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || '');
  const [status, setStatus] = useState(profile?.status || 'Not Looking');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) {
      toast.error('Upload failed');
    } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
      await refreshProfile();
      toast.success('Avatar updated!');
    }
    setUploading(false);
  };

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
    if (profile?.role === 'student') {
      updates.branch = branch;
      updates.year = year;
      updates.github_url = githubUrl;
      updates.status = status;
    } else if (profile?.role === 'alumni') {
      updates.company = company;
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) {
      toast.error('Failed to save');
    } else {
      await refreshProfile();
      toast.success('Profile updated!');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-16 md:pb-0">
      <Navbar />
      <main className="container max-w-lg py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="glass-card rounded-2xl">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex justify-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-4 ring-border/30">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {fullName?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground shadow-md hover:bg-primary/90 transition-transform hover:scale-110"
                    disabled={uploading}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} className="rounded-xl" />
                </div>
                {profile?.role === 'student' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Branch</Label>
                        <Input value={branch} onChange={e => setBranch(e.target.value)} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Select value={year} onValueChange={setYear}>
                          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
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
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['Open to Internship', 'Placed', 'Freelancing', 'Not Looking'].map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>GitHub URL</Label>
                      <Input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className="rounded-xl" />
                    </div>
                  </>
                )}
                {profile?.role === 'alumni' && (
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input value={company} onChange={e => setCompany(e.target.value)} className="rounded-xl" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <SkillsInput skills={skills} onChange={setSkills} />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} className="rounded-xl" />
                </div>
                <Button type="submit" className="w-full rounded-xl" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6"
        >
          <ResumePortfolioSection />
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
