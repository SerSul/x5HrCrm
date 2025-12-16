import { useEffect } from 'react';
import { Card, Spin } from '@gravity-ui/uikit';
import { useVacancyStore } from '../storage/vacancyStorage';

const VacancyList = () => {
  const { vacancies, loading, error, fetchVacancies } = useVacancyStore();

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  if (loading) {
    return <Spin size="l" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Available Vacancies</h2>
      {vacancies.length === 0 ? (
        <p>No vacancies available</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {vacancies.map((vacancy) => (
            <Card key={vacancy.id} style={{ padding: '16px' }}>
              <h3>{vacancy.title}</h3>
              <p><strong>Company:</strong> {vacancy.company}</p>
              <p><strong>Location:</strong> {vacancy.location}</p>
              <p><strong>Type:</strong> {vacancy.type}</p>
              <p><strong>Salary:</strong> {vacancy.salary}</p>
              <p>{vacancy.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VacancyList;