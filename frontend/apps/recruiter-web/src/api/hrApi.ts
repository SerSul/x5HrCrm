import api from './baseApi';
import type {
  DirectionResponse,
  ApplicationHrItem,
  ApplicationListResponse,
  ApplicationFilterDto,
  MoveApplicationStatusRequest,
  RejectApplicationRequest,
  ApplyInfoResponse,
} from './types/openapi';

// Get all directions (same as candidate app)
export const fetchDirectionsRequest = async () => {
  return await api.get<DirectionResponse[]>('/public/directions');
};

// Get single direction by ID
export const fetchDirectionByIdRequest = async (directionId: number) => {
  return await api.get<DirectionResponse>(`/public/directions/${directionId}`);
};

// Get applications list for HR with filters and pagination
export const fetchApplicationsListRequest = async (filters: ApplicationFilterDto) => {
  return await api.post<ApplicationListResponse>('/hr/applications/list', filters);
};

// Move application to next status (sequence-based progression)
export const moveApplicationStatusRequest = async (data: MoveApplicationStatusRequest) => {
  return await api.post('/hr/applications/status', data);
};

// Reject a candidate application
export const rejectApplicationRequest = async (data: RejectApplicationRequest) => {
  return await api.post('/hr/applications/reject', data);
};

// Get candidate application info (for HR viewing candidate's application details)
export const fetchApplyInfoRequest = async (directionId: number, userId: number) => {
  return await api.get<ApplyInfoResponse>(`/apply-info/directions/${directionId}`, {
    params: { user_id: userId },
  });
};
