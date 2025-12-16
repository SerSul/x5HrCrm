import api from './baseApi';

export interface LoginParams {
  login: string;
  password: string;
}

export const loginRequest = async (params: LoginParams) => {
  return await api.post('/login', params);
};
