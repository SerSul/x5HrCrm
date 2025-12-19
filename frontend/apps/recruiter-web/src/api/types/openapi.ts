// TypeScript types generated from OpenAPI specification

// Employment Types
export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'REMOTE'
  | 'FREELANCE';

// Test Status
export type TestStatus =
  | 'NOT_STARTED'
  | 'STARTED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'EXPIRED'
  | 'FAILED';

// Close Reasons
export type CloseReason =
  | 'HIRED'
  | 'REJECTED'
  | 'CANDIDATE_WITHDREW'
  | 'NO_RESPONSE'
  | 'DUPLICATE'
  | 'POSITION_CLOSED'
  | 'TEST_FAILED';

// Direction Status (replaces ApplicationStage concept)
export interface DirectionStatusResponse {
  id: number;
  title: string;
  description: string;
  sequence_order: number;
  is_mandatory: boolean;
}

// Direction (replaces Vacancy)
export interface DirectionResponse {
  id: number;
  title: string;
  description: string;
  employment_type: EmploymentType;
  salary_min: number;
  salary_max: number;
  active: boolean;
  created_at: string;
  closed_at?: string;
  test_id?: number;
  statuses: DirectionStatusResponse[];
  applied?: boolean; // Only when authenticated
}

// Application Status History
export interface ApplicationStatusHistoryResponse {
  id: number;
  status_id: number;
  status_title: string;
  changed_by_user_id: number;
  changed_at: string;
  comment?: string;
}

// Test Types
export interface TestQuestionOptionDto {
  option_id: number;
  text: string;
}

export interface TestQuestionDto {
  question_id: number;
  text: string;
  difficulty: number;
  order_index: number;
  options: TestQuestionOptionDto[];
}

export interface CommonTestDto {
  test_id: number;
  attempt_id?: number;
  status: TestStatus;
  score?: number;
}

export interface TestStartRequest {
  application_id: number;
}

export interface TestStartResponse {
  attempt_id: number;
  test_id: number;
  questions: TestQuestionDto[];
}

export interface TestAnswerDto {
  question_id: number;
  selected_option_id: number;
}

export interface TestSubmitRequest {
  attempt_id: number;
  answers: TestAnswerDto[];
}

export interface TestSubmitResponse {
  attempt_id: number;
  status: TestStatus;
  score: number;
  max_score: number;
  finished_at: string;
}

// Apply Info (replaces fetchMyApplications for candidate)
export interface ApplyInfoResponse {
  direction_id: number;
  current_status?: DirectionStatusResponse;
  status_history: ApplicationStatusHistoryResponse[];
  test?: CommonTestDto;
  close_reason?: CloseReason;
}

// Apply Request
export interface ApplyRequest {
  resume_path: string;
  comment?: string;
}

// HR Application Management
export interface ApplicationFilterDto {
  direction_name?: string;
  active?: boolean;
  sort_by_score?: 'desc' | 'asc';
  page?: number;
  size?: number;
}

export interface ApplicationHrItem {
  user_id: number;
  application_id: number;
  full_name: string;
  direction_id: number;
  direction_name: string;
  test_attempt_id?: number;
  test_status?: TestStatus;
  test_score?: number;
  max_score?: number;
  is_active: boolean;
  applied_at: string;
  resume_path: string;
}

export interface ApplicationListResponse {
  items: ApplicationHrItem[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

export interface MoveApplicationStatusRequest {
  direction_id: number;
  user_id: number;
  sequence_order: number;
  comment?: string;
}

export interface RejectApplicationRequest {
  application_id: number;
  close_reason?: CloseReason;
  comment?: string;
}

// Authentication Types (from OpenAPI spec)
export interface RegisterRequest {
  email: string;
  password: string;
  phone?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  telegram?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  username: string;
  authorities: {
    authority: string;
  }[];
}
