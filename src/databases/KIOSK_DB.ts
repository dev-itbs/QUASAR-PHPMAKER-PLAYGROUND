// src/databases/KIOSK_DB.ts

import { PHPMakerService } from './base/PHPMakerService';
import { DB_CONFIGS } from './config';
import type { KIOSKModels } from './models/KIOSK';

export function KIOSK_DB<T extends keyof KIOSKModels>(model: T) {
  return new PHPMakerService<KIOSKModels[T]>(
    DB_CONFIGS.KIOSK_DB.baseUrl,
    model.toLowerCase()
  );
}
