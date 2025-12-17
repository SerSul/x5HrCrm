import { useEffect } from 'react';
import { Spin, Text } from '@gravity-ui/uikit';
import { useApplicationStore } from '../../storage/applicationStorage';
import ApplicationCard from '../../components/ApplicationCard/ApplicationCard';
import type { Application } from '../../api/applicationApi';
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
    return <Text variant="body-1">Ошибка: {error}</Text>;
  }

  return (
    <div>
      <Text variant="display-2">Мои отклики</Text>
      {applications.length === 0 ? (
        <Text variant="body-1">Вы еще не откликались на вакансии.</Text>
      ) : (
        <div className={styles.applicationsList}>
          {applications.map((application: Application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
