import { useNavigate } from 'react-router';
import WithToolbarLayout from '@shared/ui/layouts/WithToolbarLayout';
import Header from '@shared/ui/components/Header/Header';
import { useAuthStore } from '../storage/authStorage';

const CandidateLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const primaryNav = user?.role === 'candidate'
    ? [
        { label: 'Главная', to: '/candidate' },
        { label: 'Мои отклики', to: '/candidate/applications' },
      ]
    : [];

  const userNav = user
    ? [{ label: 'Профиль', to: '/candidate/profile' }]
    : [];

  const authNav = !user
    ? [
        { label: 'Вход', to: '/login' },
        { label: 'Регистрация', to: '/register' },
      ]
    : [];

  return (
    <WithToolbarLayout
      header={
        <Header
          user={user ? { name: user.name, role: user.role } : null}
          primaryNav={primaryNav}
          userNav={userNav}
          authNav={authNav}
          onLogout={handleLogout}
        />
      }
    />
  );
};

export default CandidateLayout;
