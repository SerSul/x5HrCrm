import { create } from 'zustand';
import { fetchVacanciesRequest, type Vacancy } from '../api/vacancyApi';

interface VacancyState {
  vacancies: Vacancy[];
  loading: boolean;
  error: string | null;
  fetchVacancies: () => Promise<void>;
}

export const useVacancyStore = create<VacancyState>()((set) => ({
  vacancies: [],
  loading: false,
  error: null,
  fetchVacancies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchVacanciesRequest();
      set({
        vacancies: res.data,
        loading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch vacancies',
        loading: false
      });
    }
  },
}));
