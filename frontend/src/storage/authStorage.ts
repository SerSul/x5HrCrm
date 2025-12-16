import { create } from 'zustand';
import { registerRequest, type RegisterParams } from '../api/registerApi';
import { loginRequest, type LoginParams } from '../api/loginApi';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  register: (user: RegisterParams) => Promise<void>;
  login: (params: LoginParams) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  register: async (params: RegisterParams) => {
    const res = await registerRequest(params);
    console.log(res);
    set({
      user: res.data.user,
      token: res.data.token
    });
  },
  login: async (params: LoginParams) => {
    const res = await loginRequest(params);
    console.log(res);
    set({
      user: res.data.user,
      token: res.data.token
    });
  },
  logout: () => {
    set({
      user: null,
      token: null
    });
  },
}));
