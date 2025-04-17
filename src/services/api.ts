import { AxiosError, AxiosRequestConfig } from 'axios'
import axiosInstance from '@/config/axios'

// Định nghĩa kiểu dữ liệu cho API response
export interface ApiResponse<T = any> {
  status: number
  data: T
  message: string
  success: boolean
}

// Hàm wrapper giúp tự động extract data và xử lý lỗi
export const apiCall = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axiosInstance(config)
    
return response.data.data as T
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    
    // Tạo error message có cấu trúc
    const errorMessage = axiosError.response?.data?.message || 
                         axiosError.message || 
                         'Đã xảy ra lỗi không xác định'
    
    throw new Error(errorMessage)
  }
}

// Các hàm helper
export const get = <T>(url: string, params?: any): Promise<T> => {
  return apiCall<T>({ method: 'GET', url, params })
}

export const post = <T>(url: string, data?: any): Promise<T> => {
  return apiCall<T>({ method: 'POST', url, data })
}

export const put = <T>(url: string, data?: any): Promise<T> => {
  return apiCall<T>({ method: 'PUT', url, data })
}

export const patch = <T>(url: string, data?: any): Promise<T> => {
  return apiCall<T>({ method: 'PATCH', url, data })
}

export const del = <T>(url: string): Promise<T> => {
  return apiCall<T>({ method: 'DELETE', url })
}

// Re-export axiosInstance để sử dụng trực tiếp nếu cần
export { axiosInstance }