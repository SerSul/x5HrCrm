import { create } from 'zustand';
import {
  applyToVacancyRequest,
  fetchMyApplicationsRequest,
  fetchVacancyApplicationsRequest,
  updateApplicationStatusRequest,
  updateApplicationStageRequest,
  type Application,
  type ApplicationStage,
} from '../api/applicationApi';

interface ApplicationState {
  applications: Application[];
  loading: boolean;
  error: string | null;
  applyToVacancy: (vacancyId: string) => Promise<void>;
  fetchMyApplications: () => Promise<void>;
  fetchVacancyApplications: (vacancyId: string) => Promise<void>;
  updateApplicationStatus: (id: string, status: string) => Promise<void>;
  updateApplicationStage: (id: string, stage: ApplicationStage, note?: string) => Promise<void>;
  getApplicationByVacancyId: (vacancyId: string) => Application | undefined;
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

  updateApplicationStage: async (id: string, stage: ApplicationStage, note?: string) => {
    set({ loading: true, error: null });
    try {
      const res = await updateApplicationStageRequest(id, stage, note);
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === id ? res.data : app
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to update application stage',
        loading: false,
      });
    }
  },

  getApplicationByVacancyId: (vacancyId: string): Application | undefined => {
    const state: ApplicationState = useApplicationStore.getState();
    return state.applications.find((app: Application) => app.vacancyId === vacancyId);
  },
}));
