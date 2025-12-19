import { create } from 'zustand';
import {
  applyToDirectionRequest,
  withdrawApplicationRequest,
  fetchApplyInfoRequest,
} from '../api/directionApi';
import type { ApplyRequest, ApplyInfoResponse } from '../api/types/openapi';

interface ApplicationState {
  // Map directionId -> ApplyInfoResponse
  applyInfoByDirection: Record<number, ApplyInfoResponse>;
  loading: boolean;
  error: string | null;

  applyToDirection: (directionId: number, data: ApplyRequest) => Promise<void>;
  withdrawApplication: (directionId: number) => Promise<void>;
  fetchApplyInfo: (directionId: number) => Promise<void>;
  getApplyInfo: (directionId: number) => ApplyInfoResponse | undefined;
}

export const useApplicationStore = create<ApplicationState>()((set, get) => ({
  applyInfoByDirection: {},
  loading: false,
  error: null,

  applyToDirection: async (directionId: number, data: ApplyRequest) => {
    set({ loading: true, error: null });
    try {
      await applyToDirectionRequest(directionId, data);
      // Refresh apply info after applying
      const res = await fetchApplyInfoRequest(directionId);
      set((state) => ({
        applyInfoByDirection: {
          ...state.applyInfoByDirection,
          [directionId]: res.data,
        },
        loading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to apply',
        loading: false,
      });
      throw error;
    }
  },

  withdrawApplication: async (directionId: number) => {
    set({ loading: true, error: null });
    try {
      await withdrawApplicationRequest(directionId);
      set((state) => {
        const updated = { ...state.applyInfoByDirection };
        delete updated[directionId];
        return { applyInfoByDirection: updated, loading: false };
      });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to withdraw',
        loading: false,
      });
      throw error;
    }
  },

  fetchApplyInfo: async (directionId: number) => {
    set({ loading: true, error: null });
    try {
      const res = await fetchApplyInfoRequest(directionId);
      set((state) => ({
        applyInfoByDirection: {
          ...state.applyInfoByDirection,
          [directionId]: res.data,
        },
        loading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch apply info',
        loading: false,
      });
    }
  },

  getApplyInfo: (directionId: number) => {
    return get().applyInfoByDirection[directionId];
  },
}));
