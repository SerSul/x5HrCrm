import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Spin, Text } from '@gravity-ui/uikit';
import { useApplicationStore } from '../../storage/applicationStorage';
import ApplicationCard from '../../components/ApplicationCard/ApplicationCard';
import RejectModal from '../../components/RejectModal/RejectModal';
import type { ApplicationHrItem, CloseReason } from '../../api/types/openapi';
import styles from './DirectionApplicationsPage.module.scss';

const DirectionApplicationsPage = () => {
  const { directionId } = useParams<{ directionId: string }>();
  const directionIdNum = directionId ? parseInt(directionId, 10) : undefined;

  const {
    loading,
    error,
    fetchDirections,
    fetchApplications,
    getApplicationsByDirection,
    getDirectionById,
    moveApplicationStatus,
    rejectApplication,
  } = useApplicationStore();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationHrItem | null>(null);

  useEffect(() => {
    // Fetch directions and applications on mount
    fetchDirections();
    fetchApplications({ page: 1, size: 100 }); // Fetch all applications
  }, [fetchDirections, fetchApplications]);

  const direction = directionIdNum ? getDirectionById(directionIdNum) : undefined;
  const applications = directionIdNum ? getApplicationsByDirection(directionIdNum) : [];

  const handleMoveStatus = async (directionId: number, userId: number, sequenceOrder: number) => {
    await moveApplicationStatus({
      direction_id: directionId,
      user_id: userId,
      sequence_order: sequenceOrder,
    });
  };

  const handleOpenRejectModal = (applicationId: number) => {
    const app = applications.find(a => a.application_id === applicationId);
    if (app) {
      setSelectedApplication(app);
      setRejectModalOpen(true);
    }
  };

  const handleRejectConfirm = async (applicationId: number, closeReason?: CloseReason, comment?: string) => {
    await rejectApplication({
      application_id: applicationId,
      close_reason: closeReason,
      comment,
    });
    setRejectModalOpen(false);
    setSelectedApplication(null);
  };

  const handleRejectCancel = () => {
    setRejectModalOpen(false);
    setSelectedApplication(null);
  };

  // Calculate next status for each application
  const getNextStatusInfo = (app: ApplicationHrItem) => {
    if (!direction || !direction.statuses) {
      return { nextSequenceOrder: undefined, nextStatusTitle: undefined };
    }

    // For now, assume the application is at sequence_order 1
    // In a real implementation, we would fetch the current status from ApplyInfoResponse
    const currentSequence = 1; // Simplified - would fetch from application details
    const nextStatus = direction.statuses.find(s => s.sequence_order === currentSequence + 1);

    return {
      nextSequenceOrder: nextStatus?.sequence_order,
      nextStatusTitle: nextStatus?.title,
    };
  };

  if (!directionIdNum) {
    return <Text variant="body-1">Неверный ID направления</Text>;
  }

  if (loading && !direction) {
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

  if (!direction) {
    return <Text variant="body-1">Направление не найдено</Text>;
  }

  return (
    <div className={styles.container}>
      <Text variant="display-2" className={styles.title}>
        Отклики на направление: {direction.title}
      </Text>

      {applications.length === 0 ? (
        <Text variant="body-1" className={styles.emptyText}>
          Пока нет откликов на это направление.
        </Text>
      ) : (
        <div className={styles.applicationsList}>
          {applications.map((application: ApplicationHrItem) => {
            const { nextSequenceOrder, nextStatusTitle } = getNextStatusInfo(application);

            return (
              <ApplicationCard
                key={application.application_id}
                application={application}
                showActions={true}
                onMoveStatus={handleMoveStatus}
                onReject={handleOpenRejectModal}
                currentSequenceOrder={1} // Simplified
                nextSequenceOrder={nextSequenceOrder}
                nextStatusTitle={nextStatusTitle}
              />
            );
          })}
        </div>
      )}

      {selectedApplication && (
        <RejectModal
          open={rejectModalOpen}
          applicationId={selectedApplication.application_id}
          candidateName={selectedApplication.full_name}
          onConfirm={handleRejectConfirm}
          onCancel={handleRejectCancel}
        />
      )}
    </div>
  );
};

export default DirectionApplicationsPage;
