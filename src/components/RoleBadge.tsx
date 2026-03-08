import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const roleStyles: Record<string, string> = {
  student: 'bg-secondary text-secondary-foreground',
  alumni: 'bg-primary/10 text-primary border border-primary/20',
  admin: 'bg-destructive/10 text-destructive border border-destructive/20',
};

const RoleBadge = ({ role }: { role: string | null }) => {
  if (!role) return null;
  return (
    <Badge className={cn('text-xs capitalize border-0', roleStyles[role] || '')}>
      {role}
    </Badge>
  );
};

export default RoleBadge;
