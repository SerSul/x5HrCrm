import api from './baseApi';

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  company: string;
  salary: string;
  location: string;
  type: string;
}

export const fetchVacanciesRequest = async () => {
  return await api.get<Vacancy[]>('/vacancies');
};

export const fetchVacancyByIdRequest = async (id: string) => {
  return await api.get<Vacancy>(`/vacancies/${id}`);
};
