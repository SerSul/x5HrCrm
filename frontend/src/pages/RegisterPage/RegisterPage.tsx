import { Button, Card, TextInput, Text } from '@gravity-ui/uikit';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../storage/authStorage';
import Link from '../../components/Link/Link';
import styles from './RegisterPage.module.scss';

const RegisterPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const register = useAuthStore((state) => state.register);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(login, password, email, phone);

    await register({ login, password, email, phone });
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <Text variant="display-2" className={styles.title}>Регистрация</Text>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <TextInput
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Логин"
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Пароль"
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Электронная почта"
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="Телефон"
              />
            </div>
            <div className={styles.actions}>
              <Button type="submit" className={styles.submitButton}>
                Регистрация
              </Button>
            </div>
            {user && <Text variant="body-1" className={styles.successMessage}>Регистрация прошла успешно!</Text>}
          </form>
          <div className={styles.footer}>
            <Text variant="body-2">
              Вы рекрутер? <Link to="/register/recruiter" variant="inline">Зарегистрируйтесь здесь</Link>
            </Text>
            <Text variant="body-2">
              Уже есть аккаунт? <Link to="/login" variant="inline">Войдите здесь</Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
