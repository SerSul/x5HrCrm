import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Spin, Card } from '@gravity-ui/uikit';
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
    return <div>Error: {error}</div>;
  }

  if (!selectedCandidate) {
    return <div>Candidate not found</div>;
  }

  return (
    <div>
      <h1>Candidate Details</h1>
      <Card className={styles.card}>
        <h2>{selectedCandidate.name}</h2>
        <div className={styles.contactInfo}>
          <p><strong>Email:</strong> {selectedCandidate.email}</p>
          <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
          <p><strong>ID:</strong> {selectedCandidate.id}</p>
        </div>
        <div className={styles.experienceSection}>
          <h3>Experience</h3>
          <p>{selectedCandidate.experience}</p>
        </div>
        <div className={styles.skillsSection}>
          <h3>Skills</h3>
          <p>{selectedCandidate.skills}</p>
        </div>
      </Card>
    </div>
  );
};

export default CandidateDetailPage;
