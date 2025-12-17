import { Button, Card, TextInput, Text } from '@gravity-ui/uikit';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../storage/authStorage';
import Link from '@shared/ui/components/Link/Link';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login: loginAction, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginAction({ email, password });
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <Text variant="display-2" className={styles.title}>Вход</Text>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <TextInput
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className={styles.field}>
              <TextInput
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            {error && (
              <Text variant="body-1" color="danger" className={styles.errorMessage}>
                {error}
              </Text>
            )}
            <div className={styles.actions}>
              <Button
                type="submit"
                className={styles.submitButton}
                loading={loading}
                disabled={loading}
              >
                Вход
              </Button>
            </div>
          </form>
          <div className={styles.footer}>
            <Text variant="body-2">
              Нет аккаунта? <Link to="/register" variant="inline">Зарегистрируйтесь здесь</Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;