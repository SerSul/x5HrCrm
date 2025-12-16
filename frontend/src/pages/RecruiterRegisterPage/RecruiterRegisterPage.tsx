import { Button, Card, TextInput } from '@gravity-ui/uikit';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { registerRecruiterRequest } from '../../api/registerApi';
import { useAuthStore } from '../../storage/authStorage';
import Link from '../../components/Link/Link';
import styles from './RecruiterRegisterPage.module.scss';

const RecruiterRegisterPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Recruiter registration:', login, password, email, phone);

    try {
      const res = await registerRecruiterRequest({ login, password, email, phone });
      useAuthStore.setState({
        user: res.data.user,
        token: res.data.token,
      });
      navigate('/recruiter');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <h1 className={styles.title}>Recruiter Registration</h1>
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
                Register as Recruiter
              </Button>
            </div>
            {user && <p className={styles.successMessage}>Successfully registered!</p>}
          </form>
          <div className={styles.footer}>
            <p>
              Want to apply for jobs? <Link to="/register" variant="inline">Register as a candidate</Link>
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

export default RecruiterRegisterPage;
