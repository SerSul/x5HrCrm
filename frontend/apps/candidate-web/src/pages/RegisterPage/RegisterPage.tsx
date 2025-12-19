import { Button, Card, TextInput, Text } from '@gravity-ui/uikit';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../storage/authStorage';
import Link from '@shared/ui/components/Link/Link';
import styles from './RegisterPage.module.scss';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      await register({
        firstName,
        lastName,
        middleName: middleName || undefined,
        email,
        password,
        phone: phone || undefined,
      });
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <Text variant="display-2" className={styles.title}>Регистрация</Text>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <TextInput
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Имя"
                disabled={loading}
                required
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Фамилия"
                disabled={loading}
                required
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Отчество (необязательно)"
                disabled={loading}
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                disabled={loading}
                required
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Пароль"
                disabled={loading}
                required
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Подтвердите пароль"
                disabled={loading}
                required
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="Телефон (необязательно)"
                disabled={loading}
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
                Регистрация
              </Button>
            </div>
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
