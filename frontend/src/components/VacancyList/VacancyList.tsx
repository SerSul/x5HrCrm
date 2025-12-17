import { useEffect } from 'react';
import { Card, Spin, Button, Text, Label } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router';
import { useVacancyStore } from '../../storage/vacancyStorage';
import styles from './VacancyList.module.scss';

interface VacancyListProps {
  appliedVacancyIds?: string[];
  showAppliedOnly?: boolean;
}

const VacancyList = ({ appliedVacancyIds = [], showAppliedOnly = false }: VacancyListProps) => {
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

  const filteredVacancies = showAppliedOnly
    ? vacancies.filter((vacancy) => appliedVacancyIds.includes(vacancy.id))
    : vacancies;

  const getEmptyStateMessage = () => {
    if (showAppliedOnly) {
      return appliedVacancyIds.length === 0
        ? 'У вас нет откликов'
        : 'Не найдено вакансий с откликами';
    }
    return 'Нет доступных вакансий';
  };

  return (
    <div className={styles.container}>
      <Text variant="display-1" className={styles.title}>
        {showAppliedOnly ? 'Вакансии с моими откликами' : 'Доступные вакансии'}
      </Text>
      {filteredVacancies.length === 0 ? (
        <Text variant="body-1" className={styles.emptyState}>{getEmptyStateMessage()}</Text>
      ) : (
        <div className={styles.grid}>
          {filteredVacancies.map((vacancy) => {
            const isApplied = appliedVacancyIds.includes(vacancy.id);

            return (
              <div key={vacancy.id} className={styles.cardWrapper}>
                <Card view="outlined" className={styles.card}>
                  {isApplied && (
                    <div className={styles.appliedBadge}>
                      <Label theme="info" size="s">
                        Откликнулись
                      </Label>
                    </div>
                  )}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VacancyList;