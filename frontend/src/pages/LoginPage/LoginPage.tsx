import { Button, TextInput } from '@gravity-ui/uikit';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../storage/authStorage';

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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <TextInput
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <TextInput
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
        {user && <p>Success</p>}
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;