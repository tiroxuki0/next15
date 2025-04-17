import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

/**
 * Global React Query configuration file
 * This file configures default settings for React Query throughout the application
 */
const staleTimesByType = {
  user: 5 * 60 * 1000, // User data: 5 minutes
  system: 10 * 60 * 1000, // System data: 10 minutes
  static: 60 * 60 * 1000, // Static data: 1 hour
  dynamic: 30 * 1000 // Dynamic data: 30 seconds
}

// Create a QueryClient with default options
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: staleTimesByType.dynamic,

        // Don't retry on 404, 401, 403 errors
        retry: (failureCount, error: unknown) => {
          // Type casting với type guard
          const axiosError = error as AxiosError

          // Kiểm tra các mã lỗi HTTP
          if (axiosError?.response?.status === 404) return false
          if (axiosError?.response?.status === 401) return false
          if (axiosError?.response?.status === 403) return false

          return failureCount < 2 // retry other errors up to 2 times
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true
      },
      mutations: {
        retry: false
      }
    }
  })
}

// Commonly used query keys
export const queryKeys = {
  auth: {
    user: ['auth', 'user'],
    session: ['auth', 'session']
  },
  users: {
    all: ['users'],
    byId: (id: string) => ['users', id],
    preferences: (id: string) => ['users', id, 'preferences']
  },
  posts: {
    all: ['posts'],
    byId: (id: string) => ['posts', id],
    byCategory: (category: string) => ['posts', 'category', category]
  }
}

// Hook to check if the query needs to be refetched
export const getRefetchPolicy = (queryKey: string[]) => {
  const type = queryKey[0]

  switch (type) {
    case 'auth':
      return { staleTime: staleTimesByType.user }
    case 'users':
      return { staleTime: staleTimesByType.system }
    case 'static':
      return { staleTime: staleTimesByType.static }
    default:
      return { staleTime: staleTimesByType.dynamic }
  }
}
