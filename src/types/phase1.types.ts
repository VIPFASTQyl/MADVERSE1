/**
 * Phase 1 - TypeScript Interfaces and Types
 * 
 * All type definitions for Phase 1 features
 */

// ============ USER PROFILE TYPES ============

export interface UserProfile {
  id: string;
  full_name: string | null;
  bio: string | null;
  interests: string[] | null;
  profile_image_url: string | null;
  date_of_birth: string | null;
  location: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileInput {
  full_name?: string;
  bio?: string;
  interests?: string[];
  profile_image_url?: string;
  date_of_birth?: string;
  location?: string;
  phone?: string;
}

export interface UserStats {
  total_viewed: number;
  total_registered: number;
  total_completed: number;
  total_favorited: number;
}

// ============ FAVORITES TYPES ============

export interface ActivityFavorite {
  id: string;
  user_id: string;
  activity_id: string;
  created_at: string;
}

export interface AddFavoritePayload {
  user_id: string;
  activity_id: string;
}

// ============ REGISTRATION TYPES ============

export type RegistrationStatus = 'registered' | 'completed' | 'cancelled';

export interface ActivityRegistration {
  id: string;
  user_id: string;
  activity_id: string;
  status: RegistrationStatus;
  registered_at: string;
  completed_at: string | null;
}

export interface CreateRegistrationPayload {
  user_id: string;
  activity_id: string;
  status?: RegistrationStatus;
}

export interface RegistrationStats {
  total_registered: number;
  total_completed: number;
  total_cancelled: number;
}

// ============ HISTORY TYPES ============

export type ActivityAction = 'viewed' | 'registered' | 'completed' | 'favorite';

export interface ActivityHistoryRecord {
  id: string;
  user_id: string;
  activity_id: string;
  action: ActivityAction;
  action_date: string;
}

export interface TrackActionPayload {
  user_id: string;
  activity_id: string;
  action: ActivityAction;
}

export interface ActivityHistoryResponse {
  records: ActivityHistoryRecord[];
  total_count: number;
}

// ============ ACTIVITY TYPES ============

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  image: string;
  participants: number;
  is_favorited?: boolean;
  is_registered?: boolean;
  user_registration_status?: RegistrationStatus;
}

export interface ActivityWithUserStatus extends Activity {
  is_favorited: boolean;
  is_registered: boolean;
  user_registration_status: RegistrationStatus | null;
}

// ============ SERVICE RESPONSE TYPES ============

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ============ FILTER & SEARCH TYPES ============

export interface ActivityFilterOptions {
  categories?: string[];
  date_from?: string;
  date_to?: string;
  location?: string;
  search_query?: string;
  sort_by?: 'date' | 'popularity' | 'recent';
}

export interface ProfileFilterOptions {
  interests?: string[];
  search_query?: string;
}

// ============ COMPONENT PROP TYPES ============

export interface ActivityCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  participants: number;
  image: string;
  description?: string;
  onRegisterSuccess?: () => void;
  onFavoriteChange?: (isFavorited: boolean) => void;
}

export interface MyActivitiesSectionProps {
  onActivityClick?: (activityId: string) => void;
  onRefresh?: () => void;
}

export interface ProfileEditProps {
  initialData?: Partial<UserProfile>;
  onSave?: (data: UpdateProfileInput) => void;
  onCancel?: () => void;
}

// ============ ERROR TYPES ============

export class Phase1Error extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'Phase1Error';
  }
}

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  INVALID_INPUT = 'INVALID_INPUT',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN = 'UNKNOWN',
}

// ============ VALIDATION TYPES ============

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const ActivityCategories = [
  'Arts',
  'Culture',
  'Sports',
  'Volunteering',
  'Youth',
  'Exhibition',
] as const;

export type ActivityCategory = typeof ActivityCategories[number];

// ============ SORT OPTIONS ============

export enum SortOption {
  RECENT = 'recent',
  OLDEST = 'oldest',
  POPULAR = 'popular',
  UPCOMING = 'upcoming',
  RECENTLY_COMPLETED = 'recently_completed',
}

// ============ VIEW MODES ============

export enum ViewMode {
  GRID = 'grid',
  LIST = 'list',
  TIMELINE = 'timeline',
}

// ============ NOTIFICATION TYPES ============

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id?: string;
  title?: string;
  description: string;
  type?: ToastType;
  duration?: number;
}

// ============ API REQUEST/RESPONSE TYPES ============

export interface ApiRequest<T = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: T;
  params?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

// ============ USER ACTIVITY SUMMARY ============

export interface UserActivitySummary {
  user_id: string;
  profile: UserProfile | null;
  registration_count: number;
  completion_count: number;
  favorite_count: number;
  view_count: number;
  activity_categories: string[];
  last_activity_date: string | null;
  member_since: string;
}

// ============ BULK OPERATIONS ============

export interface BulkActionPayload {
  activity_ids: string[];
  action: 'favorite' | 'register' | 'unfavorite' | 'unregister';
}

export interface BulkActionResponse {
  successful: string[];
  failed: Array<{
    activity_id: string;
    error: string;
  }>;
}

// ============ EXPORT ALL TYPES ============

export type {
  UserProfile,
  UpdateProfileInput,
  UserStats,
  ActivityFavorite,
  ActivityRegistration,
  ActivityHistoryRecord,
  Activity,
  ActivityWithUserStatus,
  ActivityCardProps,
  MyActivitiesSectionProps,
};
