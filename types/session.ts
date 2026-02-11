// types/session.ts

export interface AttendanceSession {
  id: string;
  course_id: string;
  faculty_id: string;
  classroom_lat: number;
  classroom_lng: number;
  radius_meters: number;
  secret_seed: string;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
}

export interface ActiveSessionTokenResponse {
  token: string;
  sessionId: string;
}