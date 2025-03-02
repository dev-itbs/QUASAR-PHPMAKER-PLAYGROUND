// src/databases/base/PHPMakerService.ts
import { api } from '../../boot/axios';
import { ApiResponse, PaginationParams } from '../../types/api';
import { BaseModel } from '../../types/BaseModel';

export class PHPMakerService<T extends BaseModel> {
  constructor(
    private baseUrl: string,
    private tableName: string
  ) {}

  private getUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`;
  }

  async list(params?: PaginationParams): Promise<T[]> {
    const { data } = await api.get<ApiResponse<T[]>>(
      this.getUrl(`list/${this.tableName}`), 
      { params }
    );
    return data[this.tableName] || [];
  }

  async get(id: number): Promise<T | null> {
    const { data } = await api.get<ApiResponse<T>>(
      this.getUrl(`view/${this.tableName}/${id}`)
    );
    return data[this.tableName] || null;
  }

  async create(formData: Partial<T>): Promise<T | null> {
    const { data } = await api.post<ApiResponse<T>>(
      this.getUrl(`add/${this.tableName}`),
      formData
    );
    return data[this.tableName] || null;
  }

  async update(id: number, formData: Partial<T>): Promise<T | null> {
    const { data } = await api.post<ApiResponse<T>>(
      this.getUrl(`edit/${this.tableName}/${id}`),
      formData
    );
    return data[this.tableName] || null;
  }

  async delete(id: number): Promise<boolean> {
    const { data } = await api.get<ApiResponse<void>>(
      this.getUrl(`delete/${this.tableName}/${id}`)
    );
    return data.success;
  }

  async bulkDelete(ids: number[]): Promise<boolean> {
    const formData = new FormData();
    ids.forEach(id => formData.append('key_m[]', id.toString()));
    
    const { data } = await api.post<ApiResponse<void>>(
      this.getUrl(`delete/${this.tableName}`),
      formData
    );
    return data.success;
  }

  async export(type: 'excel' | 'word' | 'pdf', filename?: string): Promise<string | null> {
    const params = { filename, save: 1, output: 0 };
    const { data } = await api.get<ApiResponse<any>>(
      this.getUrl(`export/${type}/${this.tableName}`),
      { params }
    );
    return data.fileId || null;
  }

  async search(searchParams: Record<string, any>): Promise<T[]> {
    const { data } = await api.get<ApiResponse<T[]>>(
      this.getUrl(`list/${this.tableName}`),
      { params: searchParams }
    );
    return data[this.tableName] || [];
  }
}