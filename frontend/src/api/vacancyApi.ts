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
