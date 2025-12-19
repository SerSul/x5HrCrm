import { create } from 'zustand';
import {
  fetchDirectionsRequest,
  fetchApplicationsListRequest,
  moveApplicationStatusRequest,
  rejectApplicationRequest,
  fetchApplyInfoRequest,
} from '../api/hrApi';
import type {
  DirectionResponse,
  ApplicationHrItem,
  ApplicationFilterDto,
  MoveApplicationStatusRequest,
  RejectApplicationRequest,
  ApplyInfoResponse,
} from '../api/types/openapi';

interface ApplicationState {
  // Directions (HR view)
  directions: DirectionResponse[];

  // Applications (paginated HR view)
  applications: ApplicationHrItem[];
  currentPage: number;
  pageSize: number;
  totalApplications: number;
  totalPages: number;

  // Application details (for detail view)
  selectedApplicationDetails: ApplyInfoResponse | null;

  // UI state
  loading: boolean;
  error: string | null;

  // Actions
  fetchDirections: () => Promise<void>;
  fetchApplications: (filters: ApplicationFilterDto) => Promise<void>;
  moveApplicationStatus: (data: MoveApplicationStatusRequest) => Promise<void>;
  rejectApplication: (data: RejectApplicationRequest) => Promise<void>;
  fetchApplicationDetails: (directionId: number, userId: number) => Promise<void>;

  // Helpers
  getApplicationsByDirection: (directionId: number) => ApplicationHrItem[];
  getDirectionById: (directionId: number) => DirectionResponse | undefined;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  clearError: () => void;
}

export const useApplicationStore = create<ApplicationState>()((set, get) => ({
  directions: [],
  applications: [],
  currentPage: 1,
  pageSize: 20,
  totalApplications: 0,
  totalPages: 0,
  selectedApplicationDetails: null,
  loading: false,
  error: null,

  fetchDirections: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchDirectionsRequest();
      set({ directions: res.data, loading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch directions',
        loading: false,
      });
    }
  },

  fetchApplications: async (filters: ApplicationFilterDto) => {
    set({ loading: true, error: null });
    try {
      const res = await fetchApplicationsListRequest(filters);
      set({
        applications: res.data.items,
        totalApplications: res.data.total,
        currentPage: res.data.page,
        pageSize: res.data.size,
        totalPages: res.data.total_pages,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch applications',
        loading: false,
      });
    }
  },

  moveApplicationStatus: async (data: MoveApplicationStatusRequest) => {
    set({ loading: true, error: null });
    try {
      await moveApplicationStatusRequest(data);
      // Refresh current applications list after status change
      const { currentPage, pageSize } = get();
      await get().fetchApplications({ page: currentPage, size: pageSize });
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to update application status',
        loading: false,
      });
    }
  },

  rejectApplication: async (data: RejectApplicationRequest) => {
    set({ loading: true, error: null });
    try {
      await rejectApplicationRequest(data);
      // Remove from applications list (or re-fetch)
      set((state) => ({
        applications: state.applications.filter(
          (app) => app.application_id !== data.application_id
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to reject application',
        loading: false,
      });
    }
  },

  fetchApplicationDetails: async (directionId: number, userId: number) => {
    set({ loading: true, error: null });
    try {
      const res = await fetchApplyInfoRequest(directionId, userId);
      set({
        selectedApplicationDetails: res.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch application details',
        loading: false,
      });
    }
  },

  getApplicationsByDirection: (directionId: number) => {
    const { applications } = get();
    return applications.filter((app) => app.direction_id === directionId);
  },

  getDirectionById: (directionId: number) => {
    const { directions } = get();
    return directions.find((d) => d.id === directionId);
  },

  setCurrentPage: (page: number) => set({ currentPage: page }),
  setPageSize: (size: number) => set({ pageSize: size }),
  clearError: () => set({ error: null }),
}));
