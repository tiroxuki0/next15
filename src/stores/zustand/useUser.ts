import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserService } from '@/services/userService'
import { User } from '@/types'

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  fetchUser: () => Promise<User | null>
  updateUser: (userData: Partial<User>) => Promise<boolean>
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: user => set({ user }),

      fetchUser: async () => {
        set({ isLoading: true, error: null })

        try {
          // Sử dụng service đã được tách biệt
          const userData = await UserService.getProfile()

          set({
            user: userData,
            isLoading: false
          })

          return userData
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lỗi không xác định',
            isLoading: false
          })

          return null
        }
      },

      updateUser: async userData => {
        set({ isLoading: true, error: null })

        try {
          // Sử dụng service đã được tách biệt
          const updatedUser = await UserService.updateProfile(userData)

          set({
            user: { ...get().user, ...updatedUser },
            isLoading: false
          })

          return true
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lỗi không xác định',
            isLoading: false
          })

          return false
        }
      },

      clearUser: () => set({ user: null, error: null })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// Selectors and Actions
export const useUser = () =>
  useUserStore(state => ({
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    fetchUser: state.fetchUser,
    updateUser: state.updateUser,
    clearUser: state.clearUser
  }))
