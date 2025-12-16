import { Button, Card, TextInput } from '@gravity-ui/uikit';
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
          <h1 className={styles.title}>Register</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <TextInput
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Login"
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
              />
            </div>
            <div className={styles.field}>
              <TextInput
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="Phone"
              />
            </div>
            <div className={styles.actions}>
              <Button type="submit" className={styles.submitButton}>
                Register
              </Button>
            </div>
            {user && <p className={styles.successMessage}>Successfully registered!</p>}
          </form>
          <div className={styles.footer}>
            <p>
              Are you a recruiter? <Link to="/register/recruiter" variant="inline">Register here</Link>
            </p>
            <p>
              Already have an account? <Link to="/login" variant="inline">Login here</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
