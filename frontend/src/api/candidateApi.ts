import api from './baseApi';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  skills: string;
}

export const fetchCandidatesRequest = async () => {
  return await api.get('/candidates');
};

export const fetchCandidateByIdRequest = async (id: string) => {
  return await api.get(`/candidates/${id}`);
};
