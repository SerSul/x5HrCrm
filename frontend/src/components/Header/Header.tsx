import { Button } from '@gravity-ui/uikit';
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
                Home
              </Link>
              <Link to="/candidate/applications" variant="nav">
                My Applications
              </Link>
            </>
          )}
          {user?.role === 'recruiter' && (
            <Link to="/recruiter" variant="nav">
              Candidates
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
                Profile
              </Link>
              <span className={styles.userGreeting}>Welcome, {user.name}</span>
              <Button view="flat" onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" variant="nav">
                Login
              </Link>
              <Link to="/register" variant="nav">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
