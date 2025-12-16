import { Label } from '@gravity-ui/uikit';

interface ApplicationStatusBadgeProps {
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

const ApplicationStatusBadge = ({ status }: ApplicationStatusBadgeProps) => {
  const themeMap = {
    pending: 'warning' as const,
    reviewed: 'info' as const,
    accepted: 'success' as const,
    rejected: 'danger' as const,
  };

  const labelMap = {
    pending: 'Pending',
    reviewed: 'Reviewed',
    accepted: 'Accepted',
    rejected: 'Rejected',
  };

  return <Label theme={themeMap[status]}>{labelMap[status]}</Label>;
};

export default ApplicationStatusBadge;
