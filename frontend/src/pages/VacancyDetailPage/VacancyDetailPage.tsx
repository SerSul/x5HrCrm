import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Spin, Card, Button, Text } from '@gravity-ui/uikit';
import { fetchVacancyByIdRequest } from '../../api/vacancyApi';
import { useApplicationStore } from '../../storage/applicationStorage';
import type { Vacancy } from '../../api/vacancyApi';
import styles from './VacancyDetailPage.module.scss';

const VacancyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { applyToVacancy, applications } = useApplicationStore();

  useEffect(() => {
    if (id) {
      fetchVacancyByIdRequest(id)
        .then((res) => {
          setVacancy(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err?.response?.data?.message || 'Failed to fetch vacancy');
          setLoading(false);
        });
    }
  }, [id]);

  const hasApplied = applications.some((app) => app.vacancyId === id);

  const handleApply = async () => {
    if (id) {
      await applyToVacancy(id);
    }
  };

  if (loading) {
    return <Spin size="l" />;
  }

  if (error) {
    return <Text variant="body-1">Ошибка: {error}</Text>;
  }

  if (!vacancy) {
    return <Text variant="body-1">Вакансия не найдена</Text>;
  }

  return (
    <div>
      <Text variant="display-2">{vacancy.title}</Text>
      <Card className={styles.card}>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <Text variant="subheader-1" color="secondary">Компания</Text>
            <Text variant="body-2">{vacancy.company}</Text>
          </div>
          <div className={styles.detailItem}>
            <Text variant="subheader-1" color="secondary">Местоположение</Text>
            <Text variant="body-2">{vacancy.location}</Text>
          </div>
          <div className={styles.detailItem}>
            <Text variant="subheader-1" color="secondary">Тип занятости</Text>
            <Text variant="body-2">{vacancy.type}</Text>
          </div>
          <div className={styles.detailItem}>
            <Text variant="subheader-1" color="secondary">Зарплата</Text>
            <Text variant="body-2">{vacancy.salary}</Text>
          </div>
        </div>
        <div className={styles.description}>
          <Text variant="header-2">Описание вакансии</Text>
          <Text variant="body-1">{vacancy.description}</Text>
        </div>
        <div className={styles.applySection}>
          {hasApplied ? (
            <Text variant="body-1" className={styles.appliedMessage}>Вы уже откликнулись на эту вакансию</Text>
          ) : (
            <Button size="l" view="action" onClick={handleApply}>
              Откликнуться
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VacancyDetailPage;
