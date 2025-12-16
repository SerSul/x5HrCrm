import api from './baseApi';

export interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  vacancyId: string;
  vacancyTitle: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: string;
}

export const applyToVacancyRequest = async (vacancyId: string) => {
  return await api.post('/applications', { vacancyId });
};

export const fetchMyApplicationsRequest = async () => {
  return await api.get('/applications/me');
};

export const fetchVacancyApplicationsRequest = async (vacancyId: string) => {
  return await api.get(`/applications/vacancy/${vacancyId}`);
};

export const updateApplicationStatusRequest = async (id: string, status: string) => {
  return await api.patch(`/applications/${id}/status`, { status });
};
