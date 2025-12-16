import api from './baseApi';

export interface RegisterParams {
  login: string;
  password: string;
  email: string;
  phone: string;
}

export const registerRequest = async (params: RegisterParams) => {
  return await api.post('/register', params);
};
