import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VerificationBadgeProps {
  verified: boolean;
  label: string;
}

export default function VerificationBadge({ verified, label }: VerificationBadgeProps) {
  return (
    <Badge variant={verified ? 'default' : 'secondary'} className="gap-1">
      {verified ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <Circle className="h-3 w-3" />
      )}
      {label}
    </Badge>
  );
}
