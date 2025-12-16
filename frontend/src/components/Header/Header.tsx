import { Button } from '@gravity-ui/uikit';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../storage/authStorage';
import './Header.css';

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-left">
          <Link to="/" className="header-link">
            Home
          </Link>
        </div>
        <div className="header-right">
          {user ? (
            <>
              <Link to="/profile" className="header-link">
                Profile
              </Link>
              <span className="header-user">Welcome, {user.name}</span>
              <Button view="flat" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-link">
                Login
              </Link>
              <Link to="/register" className="header-link">
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
