import { Label } from '@gravity-ui/uikit';
import type { ApplicationStage } from '../../api/applicationApi';

interface ApplicationStatusBadgeProps {
  status: ApplicationStage | 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

const ApplicationStatusBadge = ({ status }: ApplicationStatusBadgeProps) => {
  const themeMap: Record<string, 'warning' | 'info' | 'success' | 'danger' | 'utility'> = {
    // Old statuses (for backward compatibility)
    pending: 'warning',
    reviewed: 'info',
    accepted: 'success',
    rejected: 'danger',
    // New stages
    applied: 'warning',
    screening: 'info',
    phone: 'info',
    technical: 'info',
    final: 'info',
    offer: 'utility',
    hired: 'success',
  };

  const labelMap: Record<string, string> = {
    // Old statuses
    pending: 'На рассмотрении',
    reviewed: 'Просмотрено',
    accepted: 'Принято',
    rejected: 'Отклонено',
    // New stages
    applied: 'Подано',
    screening: 'Скрининг',
    phone: 'Телефон',
    technical: 'Техническое',
    final: 'Финальное',
    offer: 'Оффер',
    hired: 'Нанят',
  };

  return (
    <Label theme={themeMap[status] || 'info'} size="s">
      {labelMap[status] || status}
    </Label>
  );
};

export default ApplicationStatusBadge;
