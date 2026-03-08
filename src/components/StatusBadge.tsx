import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  'Open to Internship': 'bg-success text-success-foreground',
  'Placed': 'bg-primary text-primary-foreground',
  'Freelancing': 'bg-warning text-warning-foreground',
  'Not Looking': 'bg-muted text-muted-foreground',
};

const StatusBadge = ({ status }: { status: string | null }) => {
  if (!status) return null;
  return (
    <Badge className={cn('border-0 text-xs', statusColors[status] || 'bg-muted text-muted-foreground')}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
