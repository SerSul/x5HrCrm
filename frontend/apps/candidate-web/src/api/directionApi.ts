import api from './baseApi';
import type { DirectionResponse, ApplyRequest, ApplyInfoResponse } from './types/openapi';

/**
 * Fetch all directions (public endpoint)
 * @param only_applied - Filter to only show directions where user has applied (requires authentication)
 */
export const fetchDirectionsRequest = async (only_applied?: boolean) => {
  return await api.get<DirectionResponse[]>('/public/directions', {
    params: { only_applied },
  });
};

/**
 * Apply to a direction with resume
 * @param directionId - ID of the direction to apply to
 * @param data - Application data with resume_path and optional comment
 */
export const applyToDirectionRequest = async (directionId: number, data: ApplyRequest) => {
  return await api.post(`/directions/apply/${directionId}`, data);
};

/**
 * Withdraw application from a direction
 * @param directionId - ID of the direction to withdraw from
 */
export const withdrawApplicationRequest = async (directionId: number) => {
  return await api.delete(`/directions/apply/${directionId}`);
};

/**
 * Get application info for a specific direction
 * @param directionId - ID of the direction
 * @param user_id - Optional user ID (for HR/ADMIN to view other users)
 */
export const fetchApplyInfoRequest = async (directionId: number, user_id?: number) => {
  return await api.get<ApplyInfoResponse>(`/apply-info/directions/${directionId}`, {
    params: { user_id },
  });
};
