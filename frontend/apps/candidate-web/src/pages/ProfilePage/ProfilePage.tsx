import { useState } from 'react';
import { Card, Text, Button, TextInput, TextArea } from '@gravity-ui/uikit';
import { useAuthStore } from '../../storage/authStorage';
import styles from './ProfilePage.module.scss';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [experience, setExperience] = useState(user?.experience || '');
  const [skills, setSkills] = useState(user?.skills || '');

  if (!user) {
    return null;
  }

  const handleSave = () => {
    if (user.role === 'candidate') {
      updateProfile({ experience, skills });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setExperience(user.experience || '');
    setSkills(user.skills || '');
    setIsEditing(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Text variant="display-2" className={styles.title}>Мой профиль</Text>
        {user.role === 'candidate' && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>Редактировать профиль</Button>
        )}
      </div>
      <Card className={styles.card}>
        <div className={styles.field}>
          <Text variant="subheader-1" color="secondary">Имя</Text>
          <Text variant="body-2">{user.name}</Text>
        </div>
        <div className={styles.field}>
          <Text variant="subheader-1" color="secondary">Электронная почта</Text>
          <Text variant="body-2">{user.email}</Text>
        </div>
        <div className={styles.field}>
          <Text variant="subheader-1" color="secondary">Телефон</Text>
          <Text variant="body-2">{user.phone}</Text>
        </div>
        <div className={styles.field}>
          <Text variant="subheader-1" color="secondary">Роль</Text>
          <Text variant="body-2">{user.role === 'candidate' ? 'Кандидат' : 'Рекрутер'}</Text>
        </div>
        {user.role === 'candidate' && (
          <>
            <div className={styles.field}>
              <Text variant="subheader-1" color="secondary">Опыт работы</Text>
              {isEditing ? (
                <TextArea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Опишите ваш опыт работы"
                  rows={4}
                />
              ) : (
                <Text variant="body-2">{user.experience || 'Не указано'}</Text>
              )}
            </div>
            <div className={styles.field}>
              <Text variant="subheader-1" color="secondary">Навыки</Text>
              {isEditing ? (
                <TextInput
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="напр. React, TypeScript, Node.js"
                />
              ) : (
                <Text variant="body-2">{user.skills || 'Не указано'}</Text>
              )}
            </div>
          </>
        )}
        {isEditing && (
          <div className={styles.actions}>
            <Button view="action" onClick={handleSave}>Сохранить</Button>
            <Button onClick={handleCancel}>Отмена</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
