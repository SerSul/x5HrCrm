import { Text, Icon } from '@gravity-ui/uikit';
import { Check } from '@gravity-ui/icons';
import styles from './ApplicationTimeline.module.scss';

// OpenAPI types
export interface DirectionStatusResponse {
  id: number;
  title: string;
  description: string;
  sequence_order: number;
  is_mandatory: boolean;
}

export interface ApplicationStatusHistoryResponse {
  id: number;
  status_id: number;
  status_title: string;
  changed_by_user_id: number;
  changed_at: string;
  comment?: string;
}

interface ApplicationTimelineProps {
  statuses: DirectionStatusResponse[];
  currentStatus?: DirectionStatusResponse;
  statusHistory: ApplicationStatusHistoryResponse[];
  compact?: boolean;
}

const ApplicationTimeline = ({
  statuses,
  currentStatus,
  statusHistory,
  compact = false
}: ApplicationTimelineProps) => {
  // Sort statuses by sequence_order
  const sortedStatuses = [...statuses].sort((a, b) => a.sequence_order - b.sequence_order);

  const getStatusState = (status: DirectionStatusResponse): 'completed' | 'current' | 'future' => {
    if (!currentStatus) return 'future';

    const hasReached = statusHistory.some(h => h.status_id === status.id);
    if (hasReached) return 'completed';

    if (currentStatus.id === status.id) return 'current';

    return 'future';
  };

  const getStatusDate = (statusId: number): string | undefined => {
    const historyItem = statusHistory.find(h => h.status_id === statusId);
    if (!historyItem) return undefined;

    const date = new Date(historyItem.changed_at);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusComment = (statusId: number): string | undefined => {
    const historyItem = statusHistory.find(h => h.status_id === statusId);
    return historyItem?.comment;
  };

  return (
    <div className={`${styles.timeline} ${compact ? styles.compact : ''}`}>
      <Text variant="header-2" className={styles.title}>
        Статус заявки
      </Text>

      {statusHistory.length === 0 ? (
        <Text variant="body-1" color="secondary">
          История статусов пуста
        </Text>
      ) : (
        <div className={styles.stages}>
          {sortedStatuses.map((status, index) => {
            const state = getStatusState(status);
            const date = getStatusDate(status.id);
            const comment = getStatusComment(status.id);
            const isLast = index === sortedStatuses.length - 1;

            return (
              <div key={status.id} className={styles.stage}>
                <div className={styles.stageIndicator}>
                  <div className={`${styles.indicator} ${styles[state]}`}>
                    {state === 'completed' && <Icon data={Check} size={16} />}
                    {state === 'current' && <div className={styles.currentDot} />}
                  </div>
                  {!isLast && (
                    <div className={`${styles.connector} ${state === 'completed' ? styles.solid : styles.dotted}`} />
                  )}
                </div>

                <div className={styles.stageContent}>
                  <Text
                    variant={state === 'current' ? 'subheader-2' : 'body-2'}
                    className={`${styles.stageLabel} ${styles[state]}`}
                  >
                    {status.title}
                    {status.is_mandatory && ' *'}
                  </Text>

                  {!compact && (
                    <Text variant="caption-1" color="secondary" className={styles.stageDescription}>
                      {status.description}
                    </Text>
                  )}

                  {date && (
                    <Text variant="caption-1" color="secondary" className={styles.stageDate}>
                      {date}
                    </Text>
                  )}

                  {comment && !compact && (
                    <Text variant="caption-2" color="secondary" className={styles.stageNote}>
                      💬 {comment}
                    </Text>
                  )}

                  {state === 'current' && (
                    <Text variant="caption-1" className={styles.currentIndicator}>
                      ← Вы здесь
                    </Text>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationTimeline;
