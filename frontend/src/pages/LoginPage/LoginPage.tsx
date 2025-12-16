import { Button, Card, TextInput } from '@gravity-ui/uikit';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../storage/authStorage';
import Link from '../../components/Link/Link';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const loginAction = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginAction({ login, password });
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <h1 className={styles.title}>Login</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <TextInput
                placeholder="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <TextInput
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.actions}>
              <Button type="submit" className={styles.submitButton}>
                Login
              </Button>
            </div>
            {user && <p className={styles.successMessage}>Successfully logged in!</p>}
          </form>
          <div className={styles.footer}>
            <p>
              Don't have an account? <Link to="/register" variant="inline">Register here</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;