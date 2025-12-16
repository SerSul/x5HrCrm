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
        <Text color="danger">Error: {error}</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Vacancies</h2>
      {vacancies.length === 0 ? (
        <p className={styles.emptyState}>No vacancies available</p>
      ) : (
        <div className={styles.grid}>
          {vacancies.map((vacancy) => (
            <div key={vacancy.id} className={styles.cardWrapper}>
              <Card view="outlined" className={styles.card}>
                <div className={styles.cardContent}>
                  <h3 className={styles.vacancyTitle}>{vacancy.title}</h3>
                  <div className={styles.vacancyMeta}>
                    <div className={styles.metaItem}>
                      <strong>Company:</strong> {vacancy.company}
                    </div>
                    <div className={styles.metaItem}>
                      <strong>Location:</strong> {vacancy.location}
                    </div>
                    <div className={styles.metaItem}>
                      <strong>Type:</strong> {vacancy.type}
                    </div>
                    <div className={styles.metaItem}>
                      <strong>Salary:</strong> {vacancy.salary}
                    </div>
                  </div>
                  <p className={styles.description}>{vacancy.description}</p>
                  <div className={styles.cardActions}>
                    <Button
                      view="action"
                      width="max"
                      onClick={() => navigate(`/candidate/vacancies/${vacancy.id}`)}
                    >
                      View Details & Apply
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