import { get, patch, post, del } from './api'
import type { User } from '@/types'

// Định nghĩa mới cho User nếu cần
export interface BasicUser {
  id: string
  name: string
  email?: string
}

export const UserService = {
  // Các phương thức hiện có
  getProfile: () => get<User>('/user/profile'),
  updateProfile: (userData: Partial<User>) => patch<User>('/user/profile', userData),
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    post<{ success: boolean }>('/user/change-password', data),
  deleteAccount: () => del<{ success: boolean }>('/user/account'),

  // Các phương thức mới để quản lý users
  getUsers: () => get<BasicUser[]>('/users'),

  getUserById: (id: number) => get<BasicUser>(`/users/${id}`),

  createUser: (userData: Omit<BasicUser, 'id'>) => post<BasicUser>('/users', userData),

  updateUser: (id: number, userData: Partial<BasicUser>) =>
    patch<BasicUser>(`/users/${id}`, userData),

  deleteUser: (id: number) => del<{ success: boolean }>(`/users/${id}`)
}

export default UserService
