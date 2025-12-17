import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Spin, Text } from '@gravity-ui/uikit';
import { useApplicationStore } from '../../storage/applicationStorage';
import ApplicationCard from '../../components/ApplicationCard/ApplicationCard';
import type { Application } from '../../api/applicationApi';
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
    return <Text variant="body-1">Ошибка: {error}</Text>;
  }

  return (
    <div>
      <Text variant="display-2">Отклики на вакансию</Text>
      {applications.length === 0 ? (
        <Text variant="body-1">Пока нет откликов на эту вакансию.</Text>
      ) : (
        <div className={styles.applicationsList}>
          {applications.map((application: Application) => (
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
