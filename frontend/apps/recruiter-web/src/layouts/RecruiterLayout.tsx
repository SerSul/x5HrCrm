import { useNavigate } from 'react-router';
import WithToolbarLayout from '@shared/ui/layouts/WithToolbarLayout';
import Header from '@shared/ui/components/Header/Header';
import { useAuthStore } from '../storage/authStorage';

const RecruiterLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const primaryNav = user?.role === 'recruiter'
    ? [{ label: 'Кандидаты', to: '/recruiter' }]
    : [];

  const userNav = user
    ? [{ label: 'Профиль', to: '/recruiter/profile' }]
    : [];

  const authNav = !user
    ? [
        { label: 'Вход', to: '/login' },
        { label: 'Регистрация', to: '/register/recruiter' },
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

export default RecruiterLayout;
