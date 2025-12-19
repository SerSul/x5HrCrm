import { Card, Spin, Button, Text, Label } from '@gravity-ui/uikit';
import styles from './VacancyList.module.scss';

// Direction type matching OpenAPI DirectionResponse
export interface Direction {
  id: number;
  title: string;
  description: string;
  employment_type: string;
  salary_min: number;
  salary_max: number;
  active: boolean;
  created_at: string;
  closed_at?: string;
  test_id?: number;
  statuses: any[];
  applied?: boolean;
}

interface VacancyListProps {
  // Data props - now uses Direction (previously Vacancy)
  vacancies: Direction[];
  loading?: boolean;
  error?: string | null;

  // Callback for navigation - now accepts number ID
  onVacancyClick: (directionId: number) => void;

  // Optional customization
  title?: string;
  emptyStateMessage?: string;
  buttonText?: string;
  className?: string;
}

const VacancyList = ({
  vacancies,
  loading = false,
  error = null,
  onVacancyClick,
  title,
  emptyStateMessage,
  buttonText = 'Подробнее',
  className = '',
}: VacancyListProps) => {

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="l" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Text color="danger">Ошибка: {error}</Text>
      </div>
    );
  }

  const displayTitle = title || 'Доступные направления';
  const displayEmptyMessage = emptyStateMessage || 'Нет доступных направлений';

  // Employment type translation
  const employmentTypeMap: Record<string, string> = {
    FULL_TIME: 'Полная занятость',
    PART_TIME: 'Частичная занятость',
    CONTRACT: 'Контракт',
    INTERNSHIP: 'Стажировка',
    REMOTE: 'Удаленная работа',
    FREELANCE: 'Фриланс',
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <Text variant="display-1" className={styles.title}>
        {displayTitle}
      </Text>
      {vacancies.length === 0 ? (
        <Text variant="body-1" className={styles.emptyState}>{displayEmptyMessage}</Text>
      ) : (
        <div className={styles.grid}>
          {vacancies.map((direction) => {
            const employmentType = employmentTypeMap[direction.employment_type] || direction.employment_type;
            const salaryRange = direction.salary_min && direction.salary_max
              ? `${direction.salary_min.toLocaleString()} - ${direction.salary_max.toLocaleString()} ₽`
              : 'Не указана';

            return (
              <div key={direction.id} className={styles.cardWrapper}>
                <Card view="outlined" className={styles.card}>
                  {direction.applied && (
                    <div className={styles.appliedBadge}>
                      <Label theme="info" size="s">
                        Откликнулись
                      </Label>
                    </div>
                  )}
                  {!direction.active && (
                    <div className={styles.appliedBadge}>
                      <Label theme="danger" size="s">
                        Закрыта
                      </Label>
                    </div>
                  )}
                  {direction.test_id && (
                    <div className={styles.testBadge}>
                      <Label theme="warning" size="s">
                        📝 Тест
                      </Label>
                    </div>
                  )}
                  <div className={styles.cardContent}>
                    <Text variant="header-2" className={styles.vacancyTitle}>{direction.title}</Text>
                    <div className={styles.vacancyMeta}>
                      <div className={styles.metaItem}>
                        <Text variant="subheader-1" color="secondary" as="span">Тип занятости:</Text>{' '}
                        <Text variant="body-2" as="span">{employmentType}</Text>
                      </div>
                      <div className={styles.metaItem}>
                        <Text variant="subheader-1" color="secondary" as="span">Зарплата:</Text>{' '}
                        <Text variant="body-2" as="span">{salaryRange}</Text>
                      </div>
                    </div>
                    <Text variant="body-1" className={styles.description}>{direction.description}</Text>
                    <div className={styles.cardActions}>
                      <Button
                        view="action"
                        width="max"
                        onClick={() => onVacancyClick(direction.id)}
                      >
                        {buttonText}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VacancyList;
export type { VacancyListProps };