import api from './baseApi';

export interface UserInfo {
  username: string;
  authorities: {
    authority: string;
  }[];
}

export const getCurrentUserRequest = async () => {
  return await api.get<UserInfo>('/auth/me');
};

export const logoutRequest = async () => {
  return await api.post('/auth/logout');
};
