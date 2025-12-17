import { Card, Button, Text } from '@gravity-ui/uikit';
import type { Application } from '../../api/applicationApi';
import styles from './ApplicationCard.module.scss';
import { ApplicationStatusBadge } from '@shared/ui/index';

interface ApplicationCardProps {
  application: Application;
  showActions?: boolean;
  onStatusChange?: (id: string, status: string) => void;
}

const ApplicationCard = ({ application, showActions = false, onStatusChange }: ApplicationCardProps) => {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <Text variant="header-2">{application.vacancyTitle}</Text>
          <div className={styles.metaItem}>
            <Text variant="subheader-1" color="secondary" as="span">Кандидат:</Text>{' '}
            <Text variant="body-2" as="span">{application.candidateName}</Text>
          </div>
          <div className={styles.metaItem}>
            <Text variant="subheader-1" color="secondary" as="span">Электронная почта:</Text>{' '}
            <Text variant="body-2" as="span">{application.candidateEmail}</Text>
          </div>
          <div className={styles.metaItem}>
            <Text variant="subheader-1" color="secondary" as="span">Дата отклика:</Text>{' '}
            <Text variant="body-2" as="span">{new Date(application.appliedAt).toLocaleDateString('ru-RU')}</Text>
          </div>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>
      {showActions && onStatusChange && application.status !== 'accepted' && application.status !== 'rejected' && (
        <div className={styles.actions}>
          {application.status === 'pending' && (
            <Button onClick={() => onStatusChange(application.id, 'reviewed')}>
              Отметить как просмотренное
            </Button>
          )}
          <Button view="action" onClick={() => onStatusChange(application.id, 'accepted')}>
            Принять
          </Button>
          <Button view="flat-danger" onClick={() => onStatusChange(application.id, 'rejected')}>
            Отклонить
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ApplicationCard;
