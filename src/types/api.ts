// src/types/api.ts
export interface ApiResponse<T> {
    success: boolean;
    version: string;
    action?: string;
    failureMessage?: string;
    totalRecordCount?: number;
    [key: string]: any; // For dynamic table data
  }
  
  export interface PaginationParams {
    start?: number;
    recperpage?: number;
    order?: string;
    ordertype?: 'ASC' | 'DESC';
    [key: string]: any; // For dynamic field searches
  }