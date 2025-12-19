import { Card, Button, Text, Label } from '@gravity-ui/uikit';
import type { ApplicationHrItem } from '../../api/types/openapi';
import styles from './ApplicationCard.module.scss';
import { ApplicationStatusBadge } from '@shared/ui/index';

interface ApplicationCardProps {
  application: ApplicationHrItem;
  showActions?: boolean;
  onMoveStatus?: (directionId: number, userId: number, sequenceOrder: number) => void;
  onReject?: (applicationId: number) => void;
  currentSequenceOrder?: number; // Current status sequence order
  nextSequenceOrder?: number; // Next available sequence order
  nextStatusTitle?: string; // Title of next status
}

const ApplicationCard = ({
  application,
  showActions = false,
  onMoveStatus,
  onReject,
  currentSequenceOrder,
  nextSequenceOrder,
  nextStatusTitle,
}: ApplicationCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const testScoreDisplay = application.test_score !== undefined && application.max_score
    ? `${application.test_score} / ${application.max_score}`
    : application.test_status === 'NOT_STARTED'
    ? 'Тест не начат'
    : application.test_status === 'IN_PROGRESS'
    ? 'В процессе'
    : 'Нет данных';

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <Text variant="header-2">{application.direction_name}</Text>
          <div className={styles.metaItem}>
            <Text variant="subheader-1" color="secondary" as="span">Кандидат:</Text>{' '}
            <Text variant="body-2" as="span">{application.full_name}</Text>
          </div>
          <div className={styles.metaItem}>
            <Text variant="subheader-1" color="secondary" as="span">Дата отклика:</Text>{' '}
            <Text variant="body-2" as="span">{formatDate(application.applied_at)}</Text>
          </div>
          <div className={styles.metaItem}>
            <Text variant="subheader-1" color="secondary" as="span">Результат теста:</Text>{' '}
            <Text variant="body-2" as="span">{testScoreDisplay}</Text>
          </div>
          {application.resume_path && (
            <div className={styles.metaItem}>
              <Text variant="subheader-1" color="secondary" as="span">Резюме:</Text>{' '}
              <a href={application.resume_path} target="_blank" rel="noopener noreferrer" className={styles.link}>
                Открыть резюме
              </a>
            </div>
          )}
        </div>
        <div className={styles.badges}>
          {application.is_active ? (
            <Label theme="success">Активна</Label>
          ) : (
            <Label theme="danger">Закрыта</Label>
          )}
        </div>
      </div>
      {showActions && application.is_active && onMoveStatus && onReject && (
        <div className={styles.actions}>
          {nextSequenceOrder && nextStatusTitle && (
            <Button
              view="action"
              onClick={() => onMoveStatus(application.direction_id, application.user_id, nextSequenceOrder)}
            >
              Перевести в "{nextStatusTitle}"
            </Button>
          )}
          <Button view="flat-danger" onClick={() => onReject(application.application_id)}>
            Отклонить
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ApplicationCard;
