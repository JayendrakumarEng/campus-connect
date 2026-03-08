import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload, Trash2, Plus, ExternalLink, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  title: string;
  description: string;
  url: string;
  tech: string;
}

const ResumePortfolioSection = () => {
  const { user, profile, refreshProfile } = useAuth();
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [resumeUrl, setResumeUrl] = useState(profile?.resume_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolio_url || '');
  const [projects, setProjects] = useState<Project[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState<Project>({ title: '', description: '', url: '', tech: '' });

  useEffect(() => {
    if (profile) {
      setResumeUrl((profile as any).resume_url || '');
      setPortfolioUrl((profile as any).portfolio_url || '');
      try {
        const p = (profile as any).projects;
        setProjects(Array.isArray(p) ? p : typeof p === 'string' ? JSON.parse(p) : []);
      } catch { setProjects([]); }
    }
  }, [profile]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Resume must be under 5MB'); return; }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/resume.${ext}`;
    const { error } = await supabase.storage.from('resumes').upload(path, file, { upsert: true });
    if (error) {
      toast.error('Upload failed');
    } else {
      const { data } = supabase.storage.from('resumes').getPublicUrl(path);
      setResumeUrl(data.publicUrl);
      await supabase.from('profiles').update({ resume_url: data.publicUrl } as any).eq('id', user.id);
      await refreshProfile();
      toast.success('Resume uploaded!');
    }
    setUploading(false);
  };

  const removeResume = async () => {
    if (!user) return;
    await supabase.from('profiles').update({ resume_url: null } as any).eq('id', user.id);
    setResumeUrl('');
    await refreshProfile();
    toast.success('Resume removed');
  };

  const addProject = () => {
    if (!newProject.title.trim()) { toast.error('Project title is required'); return; }
    setProjects(prev => [...prev, newProject]);
    setNewProject({ title: '', description: '', url: '', tech: '' });
    setShowAddProject(false);
  };

  const removeProject = (index: number) => {
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  const savePortfolio = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      portfolio_url: portfolioUrl || null,
      projects: JSON.stringify(projects),
    } as any).eq('id', user.id);
    if (error) {
      toast.error('Failed to save');
    } else {
      await refreshProfile();
      toast.success('Portfolio saved!');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      {/* Resume Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Resume
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {resumeUrl ? (
            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30">
              <FileText className="h-8 w-8 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Resume uploaded</p>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View Resume <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => resumeInputRef.current?.click()}>Replace</Button>
                <Button size="sm" variant="ghost" onClick={removeResume} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => resumeInputRef.current?.click()} disabled={uploading} className="w-full">
              <Upload className="h-4 w-4 mr-2" /> {uploading ? 'Uploading...' : 'Upload Resume (PDF, max 5MB)'}
            </Button>
          )}
          <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
        </CardContent>
      </Card>

      {/* Portfolio & Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Portfolio & Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Portfolio URL</Label>
            <Input value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} placeholder="https://yourportfolio.com" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Projects</Label>
              <Button size="sm" variant="outline" onClick={() => setShowAddProject(!showAddProject)}>
                <Plus className="h-4 w-4 mr-1" /> Add Project
              </Button>
            </div>

            {showAddProject && (
              <div className="rounded-lg border p-3 mb-3 space-y-2 bg-muted/30">
                <Input value={newProject.title} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} placeholder="Project Title *" />
                <Textarea value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" rows={2} />
                <div className="grid grid-cols-2 gap-2">
                  <Input value={newProject.url} onChange={e => setNewProject(p => ({ ...p, url: e.target.value }))} placeholder="Project URL" />
                  <Input value={newProject.tech} onChange={e => setNewProject(p => ({ ...p, tech: e.target.value }))} placeholder="Tech stack (e.g. React, Python)" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addProject}>Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddProject(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects added yet.</p>
            ) : (
              <div className="space-y-2">
                {projects.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="flex-1 min-w-0">
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
                    <Button variant="ghost" size="icon" onClick={() => removeProject(i)} className="text-destructive shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button onClick={savePortfolio} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Portfolio'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePortfolioSection;
