import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Spin } from '@gravity-ui/uikit';
import { useApplicationStore } from '../../storage/applicationStorage';
import ApplicationCard from '../../components/ApplicationCard/ApplicationCard';
import styles from './VacancyApplicationsPage.module.scss';

const VacancyApplicationsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { applications, loading, error, fetchVacancyApplications, updateApplicationStatus } = useApplicationStore();

  useEffect(() => {
    if (id) {
      fetchVacancyApplications(id);
    }
  }, [id, fetchVacancyApplications]);

  const handleStatusChange = async (applicationId: string, status: string) => {
    await updateApplicationStatus(applicationId, status);
  };

  if (loading) {
    return <Spin size="l" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Applications for this Vacancy</h1>
      {applications.length === 0 ? (
        <p>No applications yet for this vacancy.</p>
      ) : (
        <div className={styles.applicationsList}>
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              showActions={true}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VacancyApplicationsPage;
