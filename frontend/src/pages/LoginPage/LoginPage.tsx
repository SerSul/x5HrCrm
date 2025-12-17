import { Button, Card, TextInput, Text } from '@gravity-ui/uikit';
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
          <Text variant="display-2" className={styles.title}>Вход</Text>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <TextInput
                placeholder="Логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <TextInput
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.actions}>
              <Button type="submit" className={styles.submitButton}>
                Вход
              </Button>
            </div>
            {user && <Text variant="body-1" className={styles.successMessage}>Вы успешно вошли!</Text>}
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