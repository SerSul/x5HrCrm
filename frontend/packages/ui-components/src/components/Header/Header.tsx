import { Button, Text } from '@gravity-ui/uikit';
import Link from '../Link/Link';
import styles from './Header.module.scss';

interface NavigationItem {
  label: string;
  to: string;
}

interface User {
  name: string;
  role: 'candidate' | 'recruiter';
}

interface HeaderProps {
  user: User | null;
  primaryNav?: NavigationItem[];
  userNav?: NavigationItem[];
  authNav?: NavigationItem[];
  onLogout?: () => void;
  className?: string;
}

const Header = ({
  user,
  primaryNav = [],
  userNav = [],
  authNav = [],
  onLogout,
  className = '',
}: HeaderProps) => {
  const handleLogout = () => {
    onLogout?.();
  };

  return (
    <header className={`${styles.header} ${className}`}>
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          {primaryNav.map((item) => (
            <Link key={item.to} to={item.to} variant="nav">
              {item.label}
            </Link>
          ))}
        </div>
        <div className={styles.navSection}>
          {user ? (
            <>
              {userNav.map((item) => (
                <Link key={item.to} to={item.to} variant="nav">
                  {item.label}
                </Link>
              ))}
              <Text variant="body-2" className={styles.userGreeting}>
                Добро пожаловать, {user.name}
              </Text>
              {onLogout && (
                <Button view="flat" onClick={handleLogout} className={styles.logoutButton}>
                  Выход
                </Button>
              )}
            </>
          ) : (
            <>
              {authNav.map((item) => (
                <Link key={item.to} to={item.to} variant="nav">
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
export type { HeaderProps, NavigationItem, User };
