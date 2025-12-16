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
          {user?.role === 'candidate' && (
            <>
              <Link to="/candidate" className="header-link">
                Home
              </Link>
              <Link to="/candidate/applications" className="header-link">
                My Applications
              </Link>
            </>
          )}
          {user?.role === 'recruiter' && (
            <Link to="/recruiter" className="header-link">
              Candidates
            </Link>
          )}
        </div>
        <div className="header-right">
          {user ? (
            <>
              <Link
                to={user.role === 'candidate' ? '/candidate/profile' : '/recruiter/profile'}
                className="header-link"
              >
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
