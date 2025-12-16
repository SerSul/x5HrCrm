import { Card, Button } from '@gravity-ui/uikit';
import ApplicationStatusBadge from '../ApplicationStatusBadge/ApplicationStatusBadge';
import type { Application } from '../../api/applicationApi';
import styles from './ApplicationCard.module.scss';

interface ApplicationCardProps {
  application: Application;
  showActions?: boolean;
  onStatusChange?: (id: string, status: string) => void;
}

const ApplicationCard = ({ application, showActions = false, onStatusChange }: ApplicationCardProps) => {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3>{application.vacancyTitle}</h3>
          <p><strong>Candidate:</strong> {application.candidateName}</p>
          <p><strong>Email:</strong> {application.candidateEmail}</p>
          <p><strong>Applied:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>
      {showActions && onStatusChange && application.status !== 'accepted' && application.status !== 'rejected' && (
        <div className={styles.actions}>
          {application.status === 'pending' && (
            <Button onClick={() => onStatusChange(application.id, 'reviewed')}>
              Mark as Reviewed
            </Button>
          )}
          <Button view="action" onClick={() => onStatusChange(application.id, 'accepted')}>
            Accept
          </Button>
          <Button view="flat-danger" onClick={() => onStatusChange(application.id, 'rejected')}>
            Reject
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ApplicationCard;
