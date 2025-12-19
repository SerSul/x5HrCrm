import { Label } from '@gravity-ui/uikit';

interface ApplicationStatusBadgeProps {
  status: string; // Now accepts any status title string
  closeReason?: string; // Optional close reason for rejected applications
}

const ApplicationStatusBadge = ({ status, closeReason }: ApplicationStatusBadgeProps) => {
  // Determine theme based on status title keywords
  const getTheme = (statusTitle: string): 'warning' | 'info' | 'success' | 'danger' | 'utility' => {
    const lower = statusTitle.toLowerCase();

    // Success states
    if (lower.includes('нанят') || lower.includes('hired') || lower.includes('оффер') || lower.includes('offer')) {
      return 'success';
    }

    // Danger/rejected states
    if (lower.includes('отклон') || lower.includes('reject') || lower.includes('закрыт') || lower.includes('отказ')) {
      return 'danger';
    }

    // Warning states (initial/waiting)
    if (lower.includes('нова') || lower.includes('new') || lower.includes('ожидан') || lower.includes('waiting')) {
      return 'warning';
    }

    // Default to info for intermediate statuses
    return 'info';
  };

  const theme = getTheme(status);
  const displayText = closeReason ? `${status} (${closeReason})` : status;

  return (
    <Label theme={theme} size="s">
      {displayText}
    </Label>
  );
};

export default ApplicationStatusBadge;
