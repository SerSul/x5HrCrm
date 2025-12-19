import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@gravity-ui/uikit';
import { ListUl } from '@gravity-ui/icons';
import VacancyList from '@shared/ui/components/VacancyList/VacancyList';
import ApplicationSidebar from '../../components/ApplicationSidebar/ApplicationSidebar';
import { useDirectionStore } from '../../storage/directionStorage';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showAppliedOnly, setShowAppliedOnly] = useState(false);
  const [selectedDirectionId, setSelectedDirectionId] = useState<number>();

  const navigate = useNavigate();
  const { directions, loading, error, fetchDirections } = useDirectionStore();

  useEffect(() => {
    fetchDirections(showAppliedOnly);
  }, [fetchDirections, showAppliedOnly]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleApplicationClick = (directionId: number) => {
    setSelectedDirectionId(directionId);
  };

  const handleFilterToggle = (checked: boolean) => {
    setShowAppliedOnly(checked);
  };

  const handleVacancyClick = (directionId: number) => {
    navigate(`/candidate/directions/${directionId}`);
  };

  // Get directions where user has applied
  const appliedDirections = directions.filter(d => d.applied);

  return (
    <div className={styles.homePage}>
      <ApplicationSidebar
        applications={appliedDirections}
        loading={loading}
        isCollapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        onApplicationClick={handleApplicationClick}
        selectedVacancyId={selectedDirectionId}
        onFilterToggle={handleFilterToggle}
        showAppliedOnly={showAppliedOnly}
      />

      <div className={styles.mainContent}>
        <VacancyList
          vacancies={directions}
          loading={loading}
          error={error}
          onVacancyClick={handleVacancyClick}
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