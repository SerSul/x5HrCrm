import api from './baseApi';

export interface RegisterParams {
  email: string;
  password: string;
  phone?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
}

export const registerRequest = async (params: RegisterParams) => {
  return await api.post('/auth/register', params);
};
