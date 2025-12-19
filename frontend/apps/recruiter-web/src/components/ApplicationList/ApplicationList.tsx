import { useEffect, useState } from 'react';
import {
  Table,
  Text,
  Spin,
  TextInput,
  Select,
  Checkbox,
  Pagination,
  type SelectOption,
  type TableColumnConfig,
} from '@gravity-ui/uikit';
import { useNavigate } from 'react-router';
import { useApplicationStore } from '../../storage/applicationStorage';
import type { ApplicationHrItem } from '../../api/types/openapi';

import styles from './ApplicationList.module.scss';

const ApplicationList = () => {
  const navigate = useNavigate();
  const {
    applications,
    loading,
    error,
    fetchApplications,
    currentPage,
    pageSize,
    totalPages,
    setCurrentPage,
  } = useApplicationStore();

  const [directionNameFilter, setDirectionNameFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState(true);
  const [sortByScore, setSortByScore] = useState<'desc' | 'asc' | undefined>(undefined);

  useEffect(() => {
    // Fetch applications with current filters
    fetchApplications({
      direction_name: directionNameFilter || undefined,
      active: activeFilter,
      sort_by_score: sortByScore,
      page: currentPage,
      size: pageSize,
    });
  }, [currentPage, pageSize, directionNameFilter, activeFilter, sortByScore, fetchApplications]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const sortOptions: SelectOption[] = [
    { value: '', content: 'Без сортировки' },
    { value: 'desc', content: 'По убыванию баллов' },
    { value: 'asc', content: 'По возрастанию баллов' },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns: TableColumnConfig<ApplicationHrItem>[] = [
    {
      id: 'full_name',
      name: 'Кандидат',
      template: (item) => <Text variant="body-2">{item.full_name}</Text>,
    },
    {
      id: 'direction_name',
      name: 'Направление',
      template: (item) => <Text variant="body-2">{item.direction_name}</Text>,
    },
    {
      id: 'test_score',
      name: 'Результат теста',
      template: (item) => {
        if (item.test_score !== undefined && item.max_score) {
          return (
            <Text variant="body-2">
              {item.test_score} / {item.max_score}
            </Text>
          );
        }
        if (item.test_status === 'NOT_STARTED') {
          return <Text variant="body-2" color="secondary">Не начат</Text>;
        }
        if (item.test_status === 'IN_PROGRESS') {
          return <Text variant="body-2" color="warning">В процессе</Text>;
        }
        return <Text variant="body-2" color="secondary">-</Text>;
      },
    },
    {
      id: 'applied_at',
      name: 'Дата отклика',
      template: (item) => <Text variant="body-2">{formatDate(item.applied_at)}</Text>,
    },
    {
      id: 'is_active',
      name: 'Статус',
      template: (item) => (
        <Text variant="body-2" color={item.is_active ? 'positive' : 'secondary'}>
          {item.is_active ? 'Активна' : 'Закрыта'}
        </Text>
      ),
    },
  ];

  const handleRowClick = (item: ApplicationHrItem) => {
    // Navigate to application detail (can be implemented later)
    // For now, just log the click
    console.log('Application clicked:', item);
  };

  if (loading && applications.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="l" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Text variant="body-1" color="danger">Ошибка: {error}</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Text variant="display-1" className={styles.title}>
        Все заявки кандидатов
      </Text>

      <div className={styles.filters}>
        <TextInput
          size="l"
          placeholder="Поиск по названию направления"
          value={directionNameFilter}
          onUpdate={setDirectionNameFilter}
          className={styles.filterInput}
        />
        <Select
          size="l"
          placeholder="Сортировка по баллам"
          value={[sortByScore || '']}
          onUpdate={(values) => setSortByScore(values[0] as 'desc' | 'asc' | undefined || undefined)}
          options={sortOptions}
          className={styles.filterSelect}
        />
        <Checkbox
          size="l"
          checked={activeFilter}
          onUpdate={setActiveFilter}
          content="Только активные"
        />
      </div>

      {applications.length === 0 ? (
        <Text variant="body-1" className={styles.emptyText}>
          Нет заявок
        </Text>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <Table
              data={applications}
              columns={columns}
              onRowClick={handleRowClick}
            />
          </div>
          {totalPages > 1 && (
            <div className={styles.paginationWrapper}>
              <Pagination
                page={currentPage}
                pageSize={pageSize}
                total={totalPages * pageSize}
                onUpdate={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationList;
