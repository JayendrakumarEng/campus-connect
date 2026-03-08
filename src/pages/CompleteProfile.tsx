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
import { GraduationCap, Briefcase, Users } from 'lucide-react';

const CompleteProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const role = profile?.role || 'student';

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [branch, setBranch] = useState(profile?.branch || '');
  const [year, setYear] = useState(profile?.year || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [department, setDepartment] = useState(profile?.department || '');
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
    } else if (role === 'alumni') {
      updates.company = company;
      updates.branch = branch;
      updates.year = year;
      updates.github_url = githubUrl;
      updates.status = 'Employed';
    } else if (role === 'staff') {
      updates.department = department;
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

  const roleConfig = {
    student: {
      icon: GraduationCap,
      title: 'Student Profile',
      description: 'Tell us about your academic journey and what you\'re looking for.',
      color: 'text-primary',
    },
    alumni: {
      icon: Briefcase,
      title: 'Alumni Profile',
      description: 'Share your professional journey to help current students.',
      color: 'text-emerald-600',
    },
    staff: {
      icon: Users,
      title: 'Staff Profile',
      description: 'Set up your faculty profile to connect with students.',
      color: 'text-amber-600',
    },
  };

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.student;
  const Icon = config.icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ${config.color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle>{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common: Full Name */}
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder={role === 'staff' ? 'Prof. John Doe' : 'John Doe'} />
            </div>

            {/* Student-specific fields */}
            {role === 'student' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                      <SelectContent>
                        {['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT', 'BBA', 'BCA'].map(b => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent>
                        {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => (
                          <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Current Status</Label>
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
                  <Input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/username" />
                </div>
              </>
            )}

            {/* Alumni-specific fields */}
            {role === 'alumni' && (
              <>
                <div className="space-y-2">
                  <Label>Current Company *</Label>
                  <Input value={company} onChange={e => setCompany(e.target.value)} required placeholder="e.g. Google, TCS, Infosys" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                      <SelectContent>
                        {['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT', 'BBA', 'BCA'].map(b => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Graduation Year</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent>
                        {['2020', '2021', '2022', '2023', '2024', '2025', '2026'].map(y => (
                          <SelectItem key={y} value={`Alumni ${y}`}>Batch {y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/username" />
                </div>
              </>
            )}

            {/* Staff-specific fields */}
            {role === 'staff' && (
              <>
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {[
                        'Computer Science',
                        'Electronics & Communication',
                        'Electrical Engineering',
                        'Mechanical Engineering',
                        'Civil Engineering',
                        'Information Technology',
                        'Business Administration',
                        'Mathematics',
                        'Physics',
                        'Chemistry',
                        'Training & Placement',
                        'Administration',
                      ].map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Common: Bio */}
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder={
                  role === 'student'
                    ? 'Tell us about your interests, projects, and what you\'re looking for...'
                    : role === 'alumni'
                    ? 'Share your professional journey, expertise, and how you can help current students...'
                    : 'Share your teaching experience, research areas, and how you guide students...'
                }
                rows={3}
              />
            </div>

            {/* Common: Skills / Expertise */}
            <div className="space-y-2">
              <Label>{role === 'staff' ? 'Areas of Expertise' : 'Skills'}</Label>
              <SkillsInput skills={skills} onChange={setSkills} />
            </div>

            {/* Common: LinkedIn */}
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/username" />
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
