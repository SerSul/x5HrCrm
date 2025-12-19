import api from './baseApi';
import type {
  TestStartRequest,
  TestStartResponse,
  TestSubmitRequest,
  TestSubmitResponse,
} from './types/openapi';

/**
 * Start a test for a given application
 * @param data - Request with application_id
 * @returns Test start response with questions and attempt_id
 */
export const startTestRequest = async (data: TestStartRequest) => {
  return await api.post<TestStartResponse>('/test/start', data);
};

/**
 * Get test questions by attempt ID (for resuming a test)
 * @param attemptId - ID of the test attempt
 * @returns Test questions for the attempt
 */
export const fetchTestQuestionsRequest = async (attemptId: number) => {
  return await api.get<TestStartResponse>(`/test/questions/${attemptId}`);
};

/**
 * Submit test answers
 * @param data - Request with attempt_id and answers array
 * @returns Test submission result with score
 */
export const submitTestRequest = async (data: TestSubmitRequest) => {
  return await api.post<TestSubmitResponse>('/test/submit', data);
};
