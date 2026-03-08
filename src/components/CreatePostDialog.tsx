import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: () => void;
}

const CreatePostDialog = ({ open, onOpenChange, onPostCreated }: Props) => {
  const { user, profile } = useAuth();
  const canPostOpportunity = profile?.role === 'alumni' || profile?.role === 'staff' || profile?.role === 'admin';

  const [content, setContent] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [deadline, setDeadline] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const post: any = {
      author_id: user.id,
      content,
      type: isAlumni ? 'opportunity' : 'update',
      is_approved: !isAlumni,
    };

    if (isAlumni) {
      post.company_name = companyName;
      post.role_title = roleTitle;
      post.apply_link = applyLink || null;
      post.deadline = deadline || null;
    }

    const { error } = await supabase.from('posts').insert(post);
    if (error) {
      toast.error('Failed to create post');
    } else {
      toast.success(isAlumni ? 'Opportunity submitted for review!' : 'Post published!');
      setContent('');
      setCompanyName('');
      setRoleTitle('');
      setApplyLink('');
      setDeadline('');
      onOpenChange(false);
      onPostCreated();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isAlumni ? 'Post an Opportunity' : 'Create a Post'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isAlumni && (
            <>
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input value={companyName} onChange={e => setCompanyName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Role Title *</Label>
                <Input value={roleTitle} onChange={e => setRoleTitle(e.target.value)} required />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label>{isAlumni ? 'Description *' : 'What\'s on your mind? *'}</Label>
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value.slice(0, 500))}
              required
              rows={4}
              placeholder={isAlumni ? 'Describe the role, requirements...' : 'Share an update...'}
            />
            <p className="text-xs text-muted-foreground text-right">{content.length}/500</p>
          </div>
          {isAlumni && (
            <>
              <div className="space-y-2">
                <Label>Apply Link</Label>
                <Input value={applyLink} onChange={e => setApplyLink(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
            </>
          )}
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Posting...' : isAlumni ? 'Submit for Review' : 'Post'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
