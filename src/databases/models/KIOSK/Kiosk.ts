// src/databases/models/KIOSK/Kiosk.ts
export interface Kiosk {
  kiosk_id: number;
  name: string;
  location_name: string;
  address: string;
  latitude: number;
  longitude: number;
  marker_id: number | null;
  background_image: string | null;
  logo_image: string | null;
  video: string | null;
  assistant_id: number | null;
  weather_api_key: string | null;
  weather_location_id: string | null;
  is_active: boolean;
  created_at: string;
  created_by: number;
  updated_at: string | null;
  updated_by: number | null;
  security_code: string | null;
}

export type KioskFormData = Omit<
  Kiosk,
  'kiosk_id' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by'
>;
