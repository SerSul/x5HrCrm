import { useEffect } from 'react';
import { Spin } from '@gravity-ui/uikit';
import { useApplicationStore } from '../../storage/applicationStorage';
import ApplicationCard from '../../components/ApplicationCard/ApplicationCard';
import styles from './MyApplicationsPage.module.scss';

const MyApplicationsPage = () => {
  const { applications, loading, error, fetchMyApplications } = useApplicationStore();

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  if (loading) {
    return <Spin size="l" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>My Applications</h1>
      {applications.length === 0 ? (
        <p>You haven't applied to any positions yet.</p>
      ) : (
        <div className={styles.applicationsList}>
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
