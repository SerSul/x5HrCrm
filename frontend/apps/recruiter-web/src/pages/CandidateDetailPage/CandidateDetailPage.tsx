import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Spin, Card, Text } from '@gravity-ui/uikit';
import { useCandidateStore } from '../../storage/candidateStorage';
import styles from './CandidateDetailPage.module.scss';

const CandidateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedCandidate, loading, error, fetchCandidateById } = useCandidateStore();

  useEffect(() => {
    if (id) {
      fetchCandidateById(id);
    }
  }, [id, fetchCandidateById]);

  if (loading) {
    return <Spin size="l" />;
  }

  if (error) {
    return <Text variant="body-1">Ошибка: {error}</Text>;
  }

  if (!selectedCandidate) {
    return <Text variant="body-1">Кандидат не найден</Text>;
  }

  return (
    <div>
      <Text variant="display-2">Информация о кандидате</Text>
      <Card className={styles.card}>
        <Text variant="display-1">{selectedCandidate.name}</Text>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <Text variant="subheader-1" color="secondary">Электронная почта</Text>
            <Text variant="body-2">{selectedCandidate.email}</Text>
          </div>
          <div className={styles.contactItem}>
            <Text variant="subheader-1" color="secondary">Телефон</Text>
            <Text variant="body-2">{selectedCandidate.phone}</Text>
          </div>
          <div className={styles.contactItem}>
            <Text variant="subheader-1" color="secondary">ID</Text>
            <Text variant="body-2">{selectedCandidate.id}</Text>
          </div>
        </div>
        <div className={styles.experienceSection}>
          <Text variant="header-2">Опыт работы</Text>
          <Text variant="body-1">{selectedCandidate.experience}</Text>
        </div>
        <div className={styles.skillsSection}>
          <Text variant="header-2">Навыки</Text>
          <Text variant="body-1">{selectedCandidate.skills}</Text>
        </div>
      </Card>
    </div>
  );
};

export default CandidateDetailPage;
