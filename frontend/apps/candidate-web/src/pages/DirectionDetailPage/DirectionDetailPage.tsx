import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Spin,
  Card,
  Button,
  Text,
  TextInput,
  TextArea,
} from '@gravity-ui/uikit';
import { useDirectionStore } from '../../storage/directionStorage';
import { useApplicationStore } from '../../storage/applicationStorage';
import ApplicationTimeline from '@shared/ui/components/ApplicationTimeline/ApplicationTimeline';
import styles from './DirectionDetailPage.module.scss';

const DirectionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const directionId = id ? parseInt(id, 10) : undefined;
  const navigate = useNavigate();

  const [resumePath, setResumePath] = useState('');
  const [comment, setComment] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const { directions, fetchDirections } = useDirectionStore();
  const { applyToDirection, fetchApplyInfo, getApplyInfo, loading, error } =
    useApplicationStore();

  const direction = directionId
    ? directions.find((d) => d.id === directionId)
    : undefined;
  const applyInfo = directionId ? getApplyInfo(directionId) : undefined;

  useEffect(() => {
    if (directions.length === 0) {
      fetchDirections();
    }
  }, [fetchDirections, directions.length]);

  useEffect(() => {
    if (directionId) {
      fetchApplyInfo(directionId);
    }
  }, [directionId, fetchApplyInfo]);

  const hasApplied = !!applyInfo && applyInfo.status_history.length > 0;

  const handleApply = async () => {
    if (!directionId || !resumePath.trim()) {
      return;
    }

    setIsApplying(true);
    try {
      await applyToDirection(directionId, {
        resume_path: resumePath.trim(),
        comment: comment.trim() || undefined,
      });
      // Clear form after successful apply
      setResumePath('');
      setComment('');
    } catch (err) {
      // Error is handled by store
      console.error('Failed to apply:', err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleStartTest = () => {
    if (applyInfo?.test?.attempt_id) {
      navigate(`/candidate/test/${applyInfo.test.attempt_id}`);
    }
  };

  if (!directionId) {
    return <Text variant="body-1">Неверный ID направления</Text>;
  }

  if (!direction && directions.length > 0) {
    return <Text variant="body-1">Направление не найдено</Text>;
  }

  if (!direction) {
    return <Spin size="l" />;
  }

  // Format employment type for display
  const employmentTypeMap: Record<string, string> = {
    FULL_TIME: 'Полная занятость',
    PART_TIME: 'Частичная занятость',
    CONTRACT: 'Контракт',
    INTERNSHIP: 'Стажировка',
    REMOTE: 'Удаленная работа',
    FREELANCE: 'Фриланс',
  };

  const employmentTypeDisplay =
    employmentTypeMap[direction.employment_type] || direction.employment_type;
  const salaryDisplay =
    direction.salary_min && direction.salary_max
      ? `${direction.salary_min.toLocaleString()} - ${direction.salary_max.toLocaleString()} ₽`
      : 'Не указана';

  // Determine if test can be started
  const canStartTest = direction.test_id && hasApplied && applyInfo?.test;
  const testStatus = applyInfo?.test?.status;
  const testScore = applyInfo?.test?.score;

  return (
    <div className={styles.page}>
      <div className={styles.pageTitle}>
        <Text variant="display-2">{direction.title}</Text>
      </div>

      <div
        className={
          hasApplied ? styles.detailPageWithTimeline : styles.detailPage
        }
      >
        <div className={styles.mainContent}>
          <Card className={styles.card}>
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <Text variant="subheader-1" color="secondary">
                  Тип занятости
                </Text>
                <Text variant="body-2">{employmentTypeDisplay}</Text>
              </div>
              <div className={styles.detailItem}>
                <Text variant="subheader-1" color="secondary">
                  Зарплата
                </Text>
                <Text variant="body-2">{salaryDisplay}</Text>
              </div>
              <div className={styles.detailItem}>
                <Text variant="subheader-1" color="secondary">
                  Статус
                </Text>
                <Text variant="body-2">
                  {direction.active ? 'Активна' : 'Закрыта'}
                </Text>
              </div>
            </div>

            <div className={styles.description}>
              <Text variant="header-2">Описание направления</Text>
              <Text variant="body-1">{direction.description}</Text>
            </div>

            {/* Test Section */}
            {direction.test_id && hasApplied && (
              <div className={styles.testSection}>
                <Text variant="header-2">Тестирование</Text>
                {testStatus === 'FINISHED' && testScore !== undefined ? (
                  <Text variant="body-1" className={styles.testComplete}>
                    Тест пройден. Результат: {testScore} баллов
                  </Text>
                ) : testStatus === 'IN_PROGRESS' || testStatus === 'STARTED' ? (
                  <Button size="l" view="action" onClick={handleStartTest}>
                    Продолжить тест
                  </Button>
                ) : testStatus === 'NOT_STARTED' ? (
                  <div className={styles.testRequired}>
                    <Text variant="body-1" className={styles.testDescription}>
                      Пройдите тест для этого направления
                    </Text>
                    <Button
                      size="l"
                      view="action"
                      onClick={() => {
                        // Start test by calling test/start API
                        import('../../api/testApi').then(
                          ({ startTestRequest }) => {
                            startTestRequest({ application_id: directionId })
                              .then((response) => {
                                navigate(
                                  `/candidate/test/${response.data.attempt_id}`
                                );
                              })
                              .catch((err) =>
                                console.error('Failed to start test:', err)
                              );
                          }
                        );
                      }}
                    >
                      Начать тест
                    </Button>
                  </div>
                ) : (
                  <Text variant="body-1">Статус теста: {testStatus}</Text>
                )}
              </div>
            )}

            {/* Apply Section */}
            <div className={styles.applySection}>
              {hasApplied ? (
                <div>
                  <Text variant="body-1" className={styles.appliedMessage}>
                    Вы уже откликнулись на это направление
                  </Text>
                  {applyInfo?.close_reason && (
                    <Text variant="body-1" color="danger">
                      Причина закрытия: {applyInfo.close_reason}
                    </Text>
                  )}
                </div>
              ) : (
                <div className={styles.applyForm}>
                  <Text variant="header-2">Отклик на направление</Text>
                  <TextInput
                    size="l"
                    placeholder="Ссылка на резюме (обязательно)"
                    value={resumePath}
                    onChange={(e) => setResumePath(e.target.value)}
                    className={styles.input}
                  />
                  <TextArea
                    size="l"
                    placeholder="Комментарий (опционально)"
                    value={comment}
                    onUpdate={setComment}
                    rows={4}
                    className={styles.input}
                  />
                  {error && (
                    <Text variant="body-1" color="danger">
                      {error}
                    </Text>
                  )}
                  <Button
                    size="l"
                    view="action"
                    onClick={handleApply}
                    disabled={!resumePath.trim() || isApplying || loading}
                    loading={isApplying || loading}
                  >
                    {isApplying ? 'Отправка...' : 'Откликнуться'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Timeline Section */}
        {hasApplied && applyInfo && applyInfo.status_history.length > 0 && (
          <div className={styles.timelineSection}>
            <Card>
              <ApplicationTimeline
                statuses={direction.statuses}
                currentStatus={applyInfo.current_status}
                statusHistory={applyInfo.status_history}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectionDetailPage;
