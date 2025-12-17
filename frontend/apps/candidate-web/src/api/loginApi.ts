import api from './baseApi';

export interface LoginParams {
  email: string;
  password: string;
}

export const loginRequest = async (params: LoginParams) => {
  return await api.post('/auth/login', params);
};
