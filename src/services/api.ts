import axios, { type AxiosResponse } from 'axios'
import type { FileNode } from '@/stores/editor'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

export interface CreateFileRequest {
  name: string
  fileType: 'html' | 'css' | 'js'
  parentId?: string
}

export interface CreateFolderRequest {
  name: string
  parentId?: string
}

export interface UpdateFileRequest {
  content: string
}

class ApiService {
  private api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  constructor() {
    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error) => {
        console.error('API request failed:', error)
        return Promise.resolve({
          data: {
            success: false,
            message: error.response?.data?.message || error.message || 'خطای ناشناخته',
          },
        } as AxiosResponse<ApiResponse>)
      },
    )
  }

  // دریافت ساختار کامل فایل‌ها
  async getFileTree(): Promise<ApiResponse<FileNode[]>> {
    const response = await this.api.get<ApiResponse<FileNode[]>>('/files')
    return response.data
  }

  // دریافت محتوای فایل
  async getFileContent(fileId: string): Promise<ApiResponse<{ content: string }>> {
    const response = await this.api.get<ApiResponse<{ content: string }>>(
      `/files/${fileId}/content`,
    )
    return response.data
  }

  // بروزرسانی محتوای فایل
  async updateFileContent(fileId: string, content: string): Promise<ApiResponse> {
    const body: UpdateFileRequest = { content }
    const response = await this.api.put<ApiResponse>(`/files/${fileId}/content`, body)
    return response.data
  }

  // ایجاد فایل جدید
  async createFile(
    name: string,
    fileType: 'html' | 'css' | 'js',
    parentId?: string,
  ): Promise<ApiResponse<FileNode>> {
    const body: CreateFileRequest = { name, fileType, parentId }
    const response = await this.api.post<ApiResponse<FileNode>>('/files', body)
    return response.data
  }

  // ایجاد فولدر جدید
  async createFolder(name: string, parentId?: string): Promise<ApiResponse<FileNode>> {
    const body: CreateFolderRequest = { name, parentId }
    const response = await this.api.post<ApiResponse<FileNode>>('/folders', body)
    return response.data
  }

  // حذف فایل یا فولدر
  async deleteItem(itemId: string): Promise<ApiResponse> {
    const response = await this.api.delete<ApiResponse>(`/items/${itemId}`)
    return response.data
  }

  // تغییر وضعیت فولدر (باز/بسته)
  async toggleFolder(folderId: string): Promise<ApiResponse> {
    const response = await this.api.put<ApiResponse>(`/folders/${folderId}/toggle`)
    return response.data
  }

  // ریست پروژه
  async resetProject(): Promise<ApiResponse> {
    const response = await this.api.post<ApiResponse>('/reset')
    return response.data
  }

  // بررسی وضعیت سرور
  async healthCheck(): Promise<ApiResponse> {
    const response = await this.api.get<ApiResponse>('/health')
    return response.data
  }
}

export const apiService = new ApiService()
