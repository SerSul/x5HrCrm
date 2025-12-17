import { useEffect } from 'react';
import { Card, Spin, Button, Text } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router';
import { useVacancyStore } from '../../storage/vacancyStorage';
import styles from './VacancyList.module.scss';

const VacancyList = () => {
  const { vacancies, loading, error, fetchVacancies } = useVacancyStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="l" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Text color="danger">Ошибка: {error}</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Text variant="display-1" className={styles.title}>Доступные вакансии</Text>
      {vacancies.length === 0 ? (
        <Text variant="body-1" className={styles.emptyState}>Нет доступных вакансий</Text>
      ) : (
        <div className={styles.grid}>
          {vacancies.map((vacancy) => (
            <div key={vacancy.id} className={styles.cardWrapper}>
              <Card view="outlined" className={styles.card}>
                <div className={styles.cardContent}>
                  <Text variant="header-2" className={styles.vacancyTitle}>{vacancy.title}</Text>
                  <div className={styles.vacancyMeta}>
                    <div className={styles.metaItem}>
                      <Text variant="subheader-1" color="secondary" as="span">Компания:</Text>{' '}
                      <Text variant="body-2" as="span">{vacancy.company}</Text>
                    </div>
                    <div className={styles.metaItem}>
                      <Text variant="subheader-1" color="secondary" as="span">Местоположение:</Text>{' '}
                      <Text variant="body-2" as="span">{vacancy.location}</Text>
                    </div>
                    <div className={styles.metaItem}>
                      <Text variant="subheader-1" color="secondary" as="span">Тип занятости:</Text>{' '}
                      <Text variant="body-2" as="span">{vacancy.type}</Text>
                    </div>
                    <div className={styles.metaItem}>
                      <Text variant="subheader-1" color="secondary" as="span">Зарплата:</Text>{' '}
                      <Text variant="body-2" as="span">{vacancy.salary}</Text>
                    </div>
                  </div>
                  <Text variant="body-1" className={styles.description}>{vacancy.description}</Text>
                  <div className={styles.cardActions}>
                    <Button
                      view="action"
                      width="max"
                      onClick={() => navigate(`/candidate/vacancies/${vacancy.id}`)}
                    >
                      Подробнее и откликнуться
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VacancyList;