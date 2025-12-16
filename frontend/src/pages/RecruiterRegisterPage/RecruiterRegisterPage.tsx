import { Button, TextInput } from '@gravity-ui/uikit';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { registerRecruiterRequest } from '../../api/registerApi';
import { useAuthStore } from '../../storage/authStorage';

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
    <div>
      <h1>Recruiter Registration</h1>
      <form onSubmit={handleSubmit}>
        <TextInput value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" />
        <TextInput value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
        <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Phone" />
        <Button type="submit">Register as Recruiter</Button>
        {user && <p>Success</p>}
      </form>
      <p>
        Want to apply for jobs? <Link to="/register">Register as a candidate</Link>
      </p>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RecruiterRegisterPage;
