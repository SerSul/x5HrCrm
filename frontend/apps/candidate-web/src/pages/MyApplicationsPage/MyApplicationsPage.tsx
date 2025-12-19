import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Spin, Text, Card, Button } from '@gravity-ui/uikit';
import { useDirectionStore } from '../../storage/directionStorage';
import { useApplicationStore } from '../../storage/applicationStorage';
import ApplicationStatusBadge from '@shared/ui/components/ApplicationStatusBadge/ApplicationStatusBadge';
import styles from './MyApplicationsPage.module.scss';

const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const { directions, loading: directionsLoading, fetchDirections } = useDirectionStore();
  const { applyInfoByDirection, fetchApplyInfo } = useApplicationStore();

  useEffect(() => {
    // Fetch only directions where user has applied
    fetchDirections(true);
  }, [fetchDirections]);

  // Fetch apply info for each applied direction
  useEffect(() => {
    directions.filter(d => d.applied).forEach(direction => {
      if (!applyInfoByDirection[direction.id]) {
        fetchApplyInfo(direction.id);
      }
    });
  }, [directions, applyInfoByDirection, fetchApplyInfo]);

  const appliedDirections = directions.filter(d => d.applied);

  if (directionsLoading && appliedDirections.length === 0) {
    return <Spin size="l" />;
  }

  return (
    <div className={styles.page}>
      <Text variant="display-2" className={styles.pageTitle}>Мои отклики</Text>

      {appliedDirections.length === 0 ? (
        <Text variant="body-1">Вы еще не откликались на направления.</Text>
      ) : (
        <div className={styles.applicationsList}>
          {appliedDirections.map((direction) => {
            const applyInfo = applyInfoByDirection[direction.id];
            const testScore = applyInfo?.test?.score;
            const maxScore = applyInfo?.test ? 100 : undefined; // Assuming max is 100 or get from somewhere

            return (
              <Card key={direction.id} className={styles.applicationCard}>
                <div className={styles.cardHeader}>
                  <Text variant="header-2">{direction.title}</Text>
                  {applyInfo?.current_status && (
                    <ApplicationStatusBadge status={applyInfo.current_status.title} />
                  )}
                </div>

                <div className={styles.cardDetails}>
                  <Text variant="body-1" color="secondary">
                    Тип занятости: {direction.employment_type}
                  </Text>
                  {direction.salary_min && direction.salary_max && (
                    <Text variant="body-1" color="secondary">
                      Зарплата: {direction.salary_min.toLocaleString()} - {direction.salary_max.toLocaleString()} ₽
                    </Text>
                  )}
                </div>

                {applyInfo?.test && (
                  <div className={styles.testInfo}>
                    <Text variant="subheader-1">Тест</Text>
                    <Text variant="body-1">
                      Статус: {applyInfo.test.status}
                      {testScore !== undefined && ` | Результат: ${testScore} баллов`}
                    </Text>
                  </div>
                )}

                {applyInfo?.close_reason && (
                  <div className={styles.closeReason}>
                    <Text variant="body-1" color="danger">
                      Причина закрытия: {applyInfo.close_reason}
                    </Text>
                  </div>
                )}

                <div className={styles.cardActions}>
                  <Button
                    size="l"
                    view="outlined"
                    onClick={() => navigate(`/candidate/directions/${direction.id}`)}
                  >
                    Подробнее
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
