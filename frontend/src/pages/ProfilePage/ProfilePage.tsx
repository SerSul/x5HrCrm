import { useState } from 'react';
import { Card, Text, Button, TextInput, TextArea } from '@gravity-ui/uikit';
import { useAuthStore } from '../../storage/authStorage';
import './ProfilePage.css';

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
    <div className="profile-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Profile</h1>
        {user.role === 'candidate' && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>
      <Card className="profile-card">
        <div className="profile-field">
          <Text variant="subheader-1" color="secondary">Name</Text>
          <Text variant="body-2">{user.name}</Text>
        </div>
        <div className="profile-field">
          <Text variant="subheader-1" color="secondary">Email</Text>
          <Text variant="body-2">{user.email}</Text>
        </div>
        <div className="profile-field">
          <Text variant="subheader-1" color="secondary">Phone</Text>
          <Text variant="body-2">{user.phone}</Text>
        </div>
        <div className="profile-field">
          <Text variant="subheader-1" color="secondary">Role</Text>
          <Text variant="body-2">{user.role === 'candidate' ? 'Candidate' : 'Recruiter'}</Text>
        </div>
        {user.role === 'candidate' && (
          <>
            <div className="profile-field">
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
            <div className="profile-field">
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
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <Button view="action" onClick={handleSave}>Save</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
