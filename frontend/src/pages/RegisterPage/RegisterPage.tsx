import { Button, TextInput } from '@gravity-ui/uikit';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../storage/authStorage';

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
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <TextInput value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" />
        <TextInput value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
        <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Phone" />
        <Button type="submit">Register</Button>
        {user && <p>Success</p>}
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
