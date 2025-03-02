// src/databases/models/UAC/User.ts
export interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
  date_created: string; // ISO date string
  last_login: string | null; // ISO date string
  is_active: boolean;
  user_level_id: number | null;
  reports_to_user_id: number | null;
  photo: string | null;
  mobile_number: string | null;
  profile: string | null;
}
