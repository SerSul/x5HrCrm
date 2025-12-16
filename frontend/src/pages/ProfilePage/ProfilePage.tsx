import { Card, Text } from '@gravity-ui/uikit';
import { useAuthStore } from '../../storage/authStorage';
import './ProfilePage.css';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
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
          <Text variant="subheader-1" color="secondary">User ID</Text>
          <Text variant="body-2">{user.id}</Text>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
