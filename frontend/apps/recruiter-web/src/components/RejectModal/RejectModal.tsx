import { useState } from 'react';
import { Modal, Button, Select, TextArea, Text, type SelectOption } from '@gravity-ui/uikit';
import type { CloseReason } from '../../api/types/openapi';

import styles from './RejectModal.module.scss';

interface RejectModalProps {
  open: boolean;
  applicationId: number;
  candidateName: string;
  onConfirm: (applicationId: number, closeReason?: CloseReason, comment?: string) => Promise<void>;
  onCancel: () => void;
}

const closeReasonOptions: SelectOption[] = [
  { value: '', content: 'Без указания причины' },
  { value: 'REJECTED', content: 'Отклонен рекрутером' },
  { value: 'TEST_FAILED', content: 'Тест не пройден' },
  { value: 'NO_RESPONSE', content: 'Кандидат не отвечает' },
  { value: 'DUPLICATE', content: 'Дубликат заявки' },
  { value: 'POSITION_CLOSED', content: 'Позиция закрыта' },
  { value: 'CANDIDATE_WITHDREW', content: 'Кандидат отозвал заявку' },
];

const RejectModal = ({
  open,
  applicationId,
  candidateName,
  onConfirm,
  onCancel,
}: RejectModalProps) => {
  const [closeReason, setCloseReason] = useState<CloseReason | ''>('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm(
        applicationId,
        closeReason || undefined,
        comment.trim() || undefined
      );
      // Reset form
      setCloseReason('');
      setComment('');
    } catch (err: any) {
      setError(err?.message || 'Не удалось отклонить заявку');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setCloseReason('');
    setComment('');
    setError(null);
    onCancel();
  };

  return (
    <Modal open={open} onClose={handleCancel}>
      <div className={styles.modal}>
        <Text variant="header-2" className={styles.title}>
          Отклонить кандидата
        </Text>
        <Text variant="body-1" className={styles.description}>
          Вы уверены, что хотите отклонить заявку кандидата <strong>{candidateName}</strong>?
        </Text>

        <div className={styles.field}>
          <Text variant="subheader-1">Причина отклонения</Text>
          <Select
            size="l"
            placeholder="Выберите причину"
            value={[closeReason]}
            onUpdate={(values) => setCloseReason(values[0] as CloseReason | '')}
            options={closeReasonOptions}
            className={styles.select}
          />
        </div>

        <div className={styles.field}>
          <Text variant="subheader-1">Комментарий (опционально)</Text>
          <TextArea
            size="l"
            placeholder="Введите комментарий..."
            value={comment}
            onUpdate={setComment}
            rows={4}
            className={styles.textarea}
          />
        </div>

        {error && (
          <Text variant="body-1" color="danger" className={styles.error}>
            {error}
          </Text>
        )}

        <div className={styles.actions}>
          <Button size="l" view="normal" onClick={handleCancel} disabled={loading}>
            Отмена
          </Button>
          <Button size="l" view="action" onClick={handleConfirm} loading={loading}>
            Отклонить заявку
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectModal;
