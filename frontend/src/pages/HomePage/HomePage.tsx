import { useState, useEffect } from 'react';
import { Button } from '@gravity-ui/uikit';
import { ListUl } from '@gravity-ui/icons';
import VacancyList from '../../components/VacancyList/VacancyList';
import ApplicationSidebar from '../../components/ApplicationSidebar/ApplicationSidebar';
import { useApplicationStore } from '../../storage/applicationStorage';
import type { Application } from '../../api/applicationApi';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showAppliedOnly, setShowAppliedOnly] = useState(false);
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>();

  const { applications, loading, fetchMyApplications } = useApplicationStore();

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleApplicationClick = (vacancyId: string) => {
    setSelectedVacancyId(vacancyId);
  };

  const handleFilterToggle = (checked: boolean) => {
    setShowAppliedOnly(checked);
  };

  const appliedVacancyIds = applications.map((app: Application) => app.vacancyId);

  return (
    <div className={styles.homePage}>
      <ApplicationSidebar
        applications={applications}
        loading={loading}
        isCollapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        onApplicationClick={handleApplicationClick}
        selectedVacancyId={selectedVacancyId}
        onFilterToggle={handleFilterToggle}
        showAppliedOnly={showAppliedOnly}
      />

      <div className={styles.mainContent}>
        <VacancyList
          appliedVacancyIds={appliedVacancyIds}
          showAppliedOnly={showAppliedOnly}
        />
      </div>

      {/* Mobile toggle button */}
      <Button
        view="action"
        size="l"
        className={styles.toggleButton}
        onClick={handleToggleSidebar}
      >
        <ListUl />
      </Button>

      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className={`${styles.overlay} ${!sidebarCollapsed ? styles.visible : ''}`}
          onClick={handleToggleSidebar}
        />
      )}
    </div>
  );
};

export default HomePage;