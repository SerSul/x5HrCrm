import { create } from 'zustand';
import {
  startTestRequest,
  fetchTestQuestionsRequest,
  submitTestRequest,
} from '../api/testApi';
import type {
  TestStartResponse,
  TestSubmitResponse,
  TestAnswerDto,
} from '../api/types/openapi';

interface TestState {
  currentTest: TestStartResponse | null;
  testResult: TestSubmitResponse | null;
  loading: boolean;
  error: string | null;

  startTest: (applicationId: number) => Promise<void>;
  fetchTestQuestions: (attemptId: number) => Promise<void>;
  submitTest: (attemptId: number, answers: TestAnswerDto[]) => Promise<void>;
  clearTest: () => void;
}

export const useTestStore = create<TestState>()((set) => ({
  currentTest: null,
  testResult: null,
  loading: false,
  error: null,

  startTest: async (applicationId: number) => {
    set({ loading: true, error: null });
    try {
      const res = await startTestRequest({ application_id: applicationId });
      set({ currentTest: res.data, testResult: null, loading: false });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to start test',
        loading: false,
      });
      throw error;
    }
  },

  fetchTestQuestions: async (attemptId: number) => {
    set({ loading: true, error: null });
    try {
      const res = await fetchTestQuestionsRequest(attemptId);
      set({ currentTest: res.data, loading: false });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch test',
        loading: false,
      });
    }
  },

  submitTest: async (attemptId: number, answers: TestAnswerDto[]) => {
    set({ loading: true, error: null });
    try {
      const res = await submitTestRequest({ attempt_id: attemptId, answers });
      set({ testResult: res.data, currentTest: null, loading: false });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to submit test',
        loading: false,
      });
      throw error;
    }
  },

  clearTest: () => {
    set({ currentTest: null, testResult: null, error: null });
  },
}));
