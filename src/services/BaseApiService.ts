// src/services/BaseApiService.ts
import { api } from 'boot/axios';
import { ApiResponse, PaginationParams } from 'src/types/api';
import { BaseModel } from 'src/types/BaseModel';
import { Notify } from 'quasar';

export class BaseApiService<T extends BaseModel> {
  constructor(protected endpoint: string) {}

  protected handleError(error: any): never {
    const message = error.response?.data?.message || 'An error occurred';
    Notify.create({
      type: 'negative',
      message,
      position: 'top'
    });
    throw error;
  }

  async getAll(params?: PaginationParams): Promise<ApiResponse<T[]>> {
    try {
      const response = await api.get<ApiResponse<T[]>>(this.endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getOne(id: number | string): Promise<ApiResponse<T>> {
    try {
      const response = await api.get<ApiResponse<T>>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await api.post<ApiResponse<T>>(this.endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: number | string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await api.put<ApiResponse<T>>(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: number | string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async bulkDelete(ids: (number | string)[]): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>(`${this.endpoint}/bulk-delete`, { ids });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}