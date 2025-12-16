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
        <h1 className={styles.title}>My Profile</h1>
        {user.role === 'candidate' && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>
      <Card className={styles.card}>
        <div className={styles.field}>
          <Text variant="subheader-1" color="secondary">Name</Text>
          <Text variant="body-2">{user.name}</Text>
        </div>
        <div className={styles.field}>
          <Text variant="subheader-1" color="secondary">Email</Text>
          <Text variant="body-2">{user.email}</Text>
        </div>
        <div className={styles.field}>
          <Text variant="subheader-1" color="secondary">Phone</Text>
          <Text variant="body-2">{user.phone}</Text>
        </div>
        <div className={styles.field}>
          <Text variant="subheader-1" color="secondary">Role</Text>
          <Text variant="body-2">{user.role === 'candidate' ? 'Candidate' : 'Recruiter'}</Text>
        </div>
        {user.role === 'candidate' && (
          <>
            <div className={styles.field}>
              <Text variant="subheader-1" color="secondary">Experience</Text>
              {isEditing ? (
                <TextArea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Describe your work experience"
                  rows={4}
                />
              ) : (
                <Text variant="body-2">{user.experience || 'Not provided'}</Text>
              )}
            </div>
            <div className={styles.field}>
              <Text variant="subheader-1" color="secondary">Skills</Text>
              {isEditing ? (
                <TextInput
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, TypeScript, Node.js"
                />
              ) : (
                <Text variant="body-2">{user.skills || 'Not provided'}</Text>
              )}
            </div>
          </>
        )}
        {isEditing && (
          <div className={styles.actions}>
            <Button view="action" onClick={handleSave}>Save</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
