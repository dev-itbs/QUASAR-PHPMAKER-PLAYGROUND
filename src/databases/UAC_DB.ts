// src/databases/UAC_DB.ts

import { PHPMakerService } from './base/PHPMakerService';
import { DB_CONFIGS } from './config';
import type { UACModels } from './models/UAC';

export function UAC_DB<T extends keyof UACModels>(model: T) {
  return new PHPMakerService<UACModels[T]>(
    DB_CONFIGS.UAC_DB.baseUrl,
    model.toLowerCase()
  );
}
