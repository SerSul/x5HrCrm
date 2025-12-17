import { create } from 'zustand';
import { registerRequest, type RegisterParams } from '../api/registerApi';
import { loginRequest, type LoginParams } from '../api/loginApi';
import { getCurrentUserRequest, logoutRequest, type UserInfo } from '../api/authApi';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'candidate' | 'recruiter';
  experience?: string;
  skills?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (user: RegisterParams) => Promise<void>;
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  restoreSession: () => Promise<void>;
  clearAuth: () => void;
  clearError: () => void;
}

function mapAuthoritiesToRole(authorities: { authority: string }[]): 'candidate' | 'recruiter' {
  const hasRecruiterAuth = authorities.some(
    auth => auth.authority === 'ROLE_RECRUITER' || auth.authority === 'RECRUITER'
  );
  return hasRecruiterAuth ? 'recruiter' : 'candidate';
}

function mapUserInfoToUser(userInfo: UserInfo): User {
  return {
    id: userInfo.username,
    name: userInfo.username,
    email: userInfo.username,
    phone: '',
    role: mapAuthoritiesToRole(userInfo.authorities),
    experience: undefined,
    skills: undefined,
  };
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: false,
  error: null,

  register: async (params: RegisterParams) => {
    set({ loading: true, error: null });
    try {
      await registerRequest(params);
      const userInfoRes = await getCurrentUserRequest();
      const user = mapUserInfoToUser(userInfoRes.data);

      set({ user, loading: false });
      localStorage.setItem('hasSession', 'true');
    } catch (error: any) {
      let errorMessage = 'Registration failed';

      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid input';
      } else if (error.response?.status === 409) {
        errorMessage = 'Email already exists';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  login: async (params: LoginParams) => {
    set({ loading: true, error: null });
    try {
      await loginRequest(params);
      const userInfoRes = await getCurrentUserRequest();
      const user = mapUserInfoToUser(userInfoRes.data);

      set({ user, loading: false });
      localStorage.setItem('hasSession', 'true');
    } catch (error: any) {
      let errorMessage = 'Login failed';

      if (error.response?.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid input';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await logoutRequest();
      set({ user: null, loading: false });
      localStorage.removeItem('hasSession');
    } catch (error) {
      set({ user: null, loading: false });
      localStorage.removeItem('hasSession');
    }
  },

  restoreSession: async () => {
    if (!localStorage.getItem('hasSession')) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const userInfoRes = await getCurrentUserRequest();
      const user = mapUserInfoToUser(userInfoRes.data);
      set({ user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
      localStorage.removeItem('hasSession');
    }
  },

  clearAuth: () => {
    set({ user: null, error: null });
    localStorage.removeItem('hasSession');
  },

  updateProfile: (data: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));
