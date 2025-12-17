import { Button, Text } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../storage/authStorage';
import Link from '../Link/Link';
import styles from './Header.module.scss';

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          {user?.role === 'candidate' && (
            <>
              <Link to="/candidate" variant="nav">
                Главная
              </Link>
              <Link to="/candidate/applications" variant="nav">
                Мои отклики
              </Link>
            </>
          )}
          {user?.role === 'recruiter' && (
            <Link to="/recruiter" variant="nav">
              Кандидаты
            </Link>
          )}
        </div>
        <div className={styles.navSection}>
          {user ? (
            <>
              <Link
                to={user.role === 'candidate' ? '/candidate/profile' : '/recruiter/profile'}
                variant="nav"
              >
                Профиль
              </Link>
              <Text variant="body-2" className={styles.userGreeting}>
                Добро пожаловать, {user.name}
              </Text>
              <Button view="flat" onClick={handleLogout} className={styles.logoutButton}>
                Выход
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" variant="nav">
                Вход
              </Link>
              <Link to="/register" variant="nav">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
