import { create } from 'zustand';
import {
  applyToVacancyRequest,
  fetchMyApplicationsRequest,
  fetchVacancyApplicationsRequest,
  updateApplicationStatusRequest,
  type Application,
} from '../api/applicationApi';

interface ApplicationState {
  applications: Application[];
  loading: boolean;
  error: string | null;
  applyToVacancy: (vacancyId: string) => Promise<void>;
  fetchMyApplications: () => Promise<void>;
  fetchVacancyApplications: (vacancyId: string) => Promise<void>;
  updateApplicationStatus: (id: string, status: string) => Promise<void>;
}

export const useApplicationStore = create<ApplicationState>()((set) => ({
  applications: [],
  loading: false,
  error: null,

  applyToVacancy: async (vacancyId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await applyToVacancyRequest(vacancyId);
      set((state) => ({
        applications: [...state.applications, res.data],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to apply to vacancy',
        loading: false,
      });
    }
  },

  fetchMyApplications: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchMyApplicationsRequest();
      set({ applications: res.data, loading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch applications',
        loading: false,
      });
    }
  },

  fetchVacancyApplications: async (vacancyId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetchVacancyApplicationsRequest(vacancyId);
      set({ applications: res.data, loading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch vacancy applications',
        loading: false,
      });
    }
  },

  updateApplicationStatus: async (id: string, status: string) => {
    set({ loading: true, error: null });
    try {
      const res = await updateApplicationStatusRequest(id, status);
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === id ? res.data : app
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to update application status',
        loading: false,
      });
    }
  },
}));
