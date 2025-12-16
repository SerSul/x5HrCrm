import { useEffect } from 'react';
import { Card, Spin } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router';
import { useCandidateStore } from '../storage/candidateStorage';

const CandidateList = () => {
  const { candidates, loading, error, fetchCandidates } = useCandidateStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  if (loading) {
    return <Spin size="l" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>All Candidates</h2>
      {candidates.length === 0 ? (
        <p>No candidates available</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              style={{ padding: '16px', cursor: 'pointer' }}
              onClick={() => navigate(`/recruiter/candidates/${candidate.id}`)}
            >
              <h3>{candidate.name}</h3>
              <p><strong>Email:</strong> {candidate.email}</p>
              <p><strong>Phone:</strong> {candidate.phone}</p>
              <p><strong>Experience:</strong> {candidate.experience}</p>
              <p><strong>Skills:</strong> {candidate.skills}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
