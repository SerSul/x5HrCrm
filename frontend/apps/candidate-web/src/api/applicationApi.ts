import api from './baseApi';

export type ApplicationStage =
  | 'applied'
  | 'screening'
  | 'phone'
  | 'technical'
  | 'final'
  | 'offer'
  | 'hired'
  | 'rejected';

export interface ApplicationStageHistory {
  stage: ApplicationStage;
  date: string;
  note?: string;
}

export interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  vacancyId: string;
  vacancyTitle: string;
  company: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  currentStage: ApplicationStage;
  stageHistory: ApplicationStageHistory[];
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

export const updateApplicationStageRequest = async (
  id: string,
  stage: ApplicationStage,
  note?: string
) => {
  return await api.patch(`/applications/${id}/stage`, { stage, note });
};
