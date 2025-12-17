import { Text, Card, Checkbox, Button, Spin } from '@gravity-ui/uikit';
import { Xmark } from '@gravity-ui/icons';
import { useNavigate } from 'react-router';
import type { Application } from '../../api/applicationApi';
import ApplicationStatusBadge from '@shared/ui/components/ApplicationStatusBadge/ApplicationStatusBadge';
import styles from './ApplicationSidebar.module.scss';

interface ApplicationSidebarProps {
  applications: Application[];
  loading?: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onApplicationClick: (vacancyId: string) => void;
  selectedVacancyId?: string;
  onFilterToggle: (showAppliedOnly: boolean) => void;
  showAppliedOnly: boolean;
}

const ApplicationSidebar = ({
  applications,
  loading = false,
  isCollapsed,
  onToggle,
  onApplicationClick,
  selectedVacancyId,
  onFilterToggle,
  showAppliedOnly,
}: ApplicationSidebarProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const handleApplicationClick = (application: Application) => {
    onApplicationClick(application.vacancyId);
    navigate(`/candidate/vacancies/${application.vacancyId}`);

    // Close sidebar on mobile after clicking
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <div className={`${styles.sidebar} ${!isCollapsed ? styles.visible : ''}`}>
      <div className={styles.header}>
        <Text variant="header-2">Мои отклики</Text>
        <Button
          view="flat"
          size="m"
          className={styles.closeButton}
          onClick={onToggle}
        >
          <Xmark />
        </Button>
      </div>

      <div className={styles.filterSection}>
        <Checkbox
          checked={showAppliedOnly}
          onUpdate={onFilterToggle}
          size="m"
        >
          <Text variant="body-2">Показать только мои отклики</Text>
        </Checkbox>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingState}>
            <Spin size="m" />
          </div>
        ) : applications.length === 0 ? (
          <div className={styles.emptyState}>
            <Text variant="body-1" color="secondary">
              У вас пока нет откликов
            </Text>
            <Text variant="caption-2" color="secondary">
              Откликнитесь на вакансии, чтобы увидеть их здесь
            </Text>
          </div>
        ) : (
          <div className={styles.applicationsList}>
            {applications.map((application) => (
              <Card
                key={application.id}
                className={`${styles.applicationCard} ${
                  selectedVacancyId === application.vacancyId ? styles.selected : ''
                }`}
                onClick={() => handleApplicationClick(application)}
              >
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <Text variant="subheader-1" className={styles.vacancyTitle}>
                      {application.vacancyTitle}
                    </Text>
                    <ApplicationStatusBadge status={application.currentStage} />
                  </div>

                  <Text variant="body-2" color="secondary" className={styles.company}>
                    {application.company}
                  </Text>

                  <div className={styles.cardFooter}>
                    <Text variant="caption-1" color="secondary">
                      Отклик: {formatDate(application.appliedAt)}
                    </Text>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {applications.length > 0 && (
        <div className={styles.footer}>
          <Text variant="caption-1" color="secondary">
            Всего откликов: {applications.length}
          </Text>
        </div>
      )}
    </div>
  );
};

export default ApplicationSidebar;
