import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Spin, Card, Button } from '@gravity-ui/uikit';
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
    return <div>Error: {error}</div>;
  }

  if (!vacancy) {
    return <div>Vacancy not found</div>;
  }

  return (
    <div>
      <h1>{vacancy.title}</h1>
      <Card className={styles.card}>
        <div className={styles.details}>
          <p><strong>Company:</strong> {vacancy.company}</p>
          <p><strong>Location:</strong> {vacancy.location}</p>
          <p><strong>Type:</strong> {vacancy.type}</p>
          <p><strong>Salary:</strong> {vacancy.salary}</p>
        </div>
        <div className={styles.description}>
          <h3>Job Description</h3>
          <p>{vacancy.description}</p>
        </div>
        <div className={styles.applySection}>
          {hasApplied ? (
            <p className={styles.appliedMessage}>You have already applied to this position</p>
          ) : (
            <Button size="l" view="action" onClick={handleApply}>
              Apply Now
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VacancyDetailPage;
