import { create } from 'zustand';
import { fetchDirectionsRequest } from '../api/directionApi';
import type { DirectionResponse } from '../api/types/openapi';

interface DirectionState {
  directions: DirectionResponse[];
  loading: boolean;
  error: string | null;
  fetchDirections: (only_applied?: boolean) => Promise<void>;
  getDirectionById: (id: number) => DirectionResponse | undefined;
}

export const useDirectionStore = create<DirectionState>()((set, get) => ({
  directions: [],
  loading: false,
  error: null,

  fetchDirections: async (only_applied?: boolean) => {
    set({ loading: true, error: null });
    try {
      const res = await fetchDirectionsRequest(only_applied);
      set({ directions: res.data, loading: false });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch directions',
        loading: false,
      });
    }
  },

  getDirectionById: (id: number) => {
    return get().directions.find((d) => d.id === id);
  },
}));
