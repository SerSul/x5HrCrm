import { Text, Icon } from '@gravity-ui/uikit';
import { Check, Xmark } from '@gravity-ui/icons';
import type { ApplicationStage, ApplicationStageHistory } from '../../api/applicationApi';
import styles from './ApplicationTimeline.module.scss';

interface ApplicationTimelineProps {
  currentStage: ApplicationStage;
  stageHistory: ApplicationStageHistory[];
  compact?: boolean;
}

const STAGES: Array<{
  key: ApplicationStage;
  label: string;
  description: string;
}> = [
  { key: 'applied', label: 'Подано', description: 'Заявка отправлена' },
  { key: 'screening', label: 'Скрининг', description: 'Проверка резюме' },
  { key: 'phone', label: 'Телефонное интервью', description: 'Первичное собеседование' },
  { key: 'technical', label: 'Техническое интервью', description: 'Техническая оценка' },
  { key: 'final', label: 'Финальное интервью', description: 'Финальное собеседование' },
  { key: 'offer', label: 'Оффер', description: 'Предложение получено' },
  { key: 'hired', label: 'Нанят', description: 'Успешно нанят' },
];

const ApplicationTimeline = ({ currentStage, stageHistory, compact = false }: ApplicationTimelineProps) => {
  const currentStageIndex = STAGES.findIndex(s => s.key === currentStage);
  const isRejected = currentStage === 'rejected';

  const getStageStatus = (stageKey: ApplicationStage, index: number): 'completed' | 'current' | 'future' | 'rejected' => {
    if (isRejected && stageKey === 'rejected') return 'rejected';
    if (isRejected) return 'future';
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'future';
  };

  const getStageDate = (stageKey: ApplicationStage): string | undefined => {
    const historyItem = stageHistory.find(h => h.stage === stageKey);
    if (!historyItem) return undefined;

    const date = new Date(historyItem.date);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStageNote = (stageKey: ApplicationStage): string | undefined => {
    const historyItem = stageHistory.find(h => h.stage === stageKey);
    return historyItem?.note;
  };

  const displayStages = isRejected
    ? STAGES.slice(0, currentStageIndex + 1)
    : STAGES.filter(s => s.key !== 'rejected');

  if (isRejected) {
    displayStages.push({ key: 'rejected', label: 'Отклонено', description: 'Заявка отклонена' });
  }

  return (
    <div className={`${styles.timeline} ${compact ? styles.compact : ''}`}>
      <Text variant="header-2" className={styles.title}>
        Статус заявки
      </Text>

      <div className={styles.stages}>
        {displayStages.map((stage, index) => {
          const status = getStageStatus(stage.key, index);
          const date = getStageDate(stage.key);
          const note = getStageNote(stage.key);
          const isLast = index === displayStages.length - 1;

          return (
            <div key={stage.key} className={styles.stage}>
              <div className={styles.stageIndicator}>
                <div className={`${styles.indicator} ${styles[status]}`}>
                  {status === 'completed' && <Icon data={Check} size={16} />}
                  {status === 'rejected' && <Icon data={Xmark} size={16} />}
                  {status === 'current' && <div className={styles.currentDot} />}
                </div>
                {!isLast && (
                  <div className={`${styles.connector} ${status === 'completed' ? styles.solid : styles.dotted}`} />
                )}
              </div>

              <div className={styles.stageContent}>
                <Text
                  variant={status === 'current' ? 'subheader-2' : 'body-2'}
                  className={`${styles.stageLabel} ${styles[status]}`}
                >
                  {stage.label}
                </Text>

                {!compact && (
                  <Text variant="caption-1" color="secondary" className={styles.stageDescription}>
                    {stage.description}
                  </Text>
                )}

                {date && (
                  <Text variant="caption-1" color="secondary" className={styles.stageDate}>
                    {date}
                  </Text>
                )}

                {note && !compact && (
                  <Text variant="caption-2" color="secondary" className={styles.stageNote}>
                    {note}
                  </Text>
                )}

                {status === 'current' && (
                  <Text variant="caption-1" className={styles.currentIndicator}>
                    ← Вы здесь
                  </Text>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTimeline;
