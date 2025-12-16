import { useEffect } from 'react';
import { Spin } from '@gravity-ui/uikit';
import { useApplicationStore } from '../../storage/applicationStorage';
import ApplicationCard from '../../components/ApplicationCard';

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
