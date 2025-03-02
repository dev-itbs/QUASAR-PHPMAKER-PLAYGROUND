// src/databases/config.ts

export const DB_CONFIGS = {
  UAC_DB: {
    baseUrl: '/UAC/api', // http://domain.com/phpmaker
  },
  KIOSK_DB: {
    baseUrl: '/KIOSK/api', // http://domain.com/phpmaker
  },
} as const;

export type DatabaseName = keyof typeof DB_CONFIGS;
