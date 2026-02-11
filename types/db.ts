// types/db.ts

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: "student" | "faculty" | "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: "student" | "faculty" | "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "student" | "faculty" | "admin";
          created_at?: string;
        };
      };

      courses: {
        Row: {
          id: string;
          course_code: string;
          course_name: string;
          faculty_id: string;
        };
        Insert: {
          id?: string;
          course_code: string;
          course_name: string;
          faculty_id: string;
        };
        Update: {
          id?: string;
          course_code?: string;
          course_name?: string;
          faculty_id?: string;
        };
      };

      class_sessions: {
        Row: {
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
        };
        Insert: {
          id?: string;
          course_id: string;
          faculty_id: string;
          classroom_lat: number;
          classroom_lng: number;
          radius_meters: number;
          secret_seed: string;
          start_time: string;
          end_time?: string | null;
          is_active: boolean;
        };
        Update: {
          id?: string;
          course_id?: string;
          faculty_id?: string;
          classroom_lat?: number;
          classroom_lng?: number;
          radius_meters?: number;
          secret_seed?: string;
          start_time?: string;
          end_time?: string | null;
          is_active?: boolean;
        };
      };

      attendance_records: {
        Row: {
          id: string;
          session_id: string;
          student_id: string;
          server_timestamp: string;
          ip_address: string | null;
          device_hash: string | null;
          submission_lat: number;
          submission_lng: number;
          distance_meters: number;
        };
        Insert: {
          id?: string;
          session_id: string;
          student_id: string;
          server_timestamp?: string;
          ip_address?: string | null;
          device_hash?: string | null;
          submission_lat: number;
          submission_lng: number;
          distance_meters: number;
        };
        Update: {
          id?: string;
          session_id?: string;
          student_id?: string;
          server_timestamp?: string;
          ip_address?: string | null;
          device_hash?: string | null;
          submission_lat?: number;
          submission_lng?: number;
          distance_meters?: number;
        };
      };
    };
  };
};