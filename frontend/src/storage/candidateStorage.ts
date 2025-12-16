import { create } from 'zustand';
import {
  fetchCandidatesRequest,
  fetchCandidateByIdRequest,
  type Candidate,
} from '../api/candidateApi';

interface CandidateState {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  loading: boolean;
  error: string | null;
  fetchCandidates: () => Promise<void>;
  fetchCandidateById: (id: string) => Promise<void>;
}

export const useCandidateStore = create<CandidateState>()((set) => ({
  candidates: [],
  selectedCandidate: null,
  loading: false,
  error: null,

  fetchCandidates: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchCandidatesRequest();
      set({ candidates: res.data, loading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch candidates',
        loading: false,
      });
    }
  },

  fetchCandidateById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetchCandidateByIdRequest(id);
      set({ selectedCandidate: res.data, loading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch candidate',
        loading: false,
      });
    }
  },
}));
