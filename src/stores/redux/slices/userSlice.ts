import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { UserService } from '@/services/userService'
import { User, UserState } from '@/types'

const initialState: UserState = {
  user: null,
  users: [],
  selectedUser: null,
  loading: false,
  error: null
}

// Thunk để lấy thông tin profile người dùng hiện tại
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Sử dụng UserService thay vì gọi axios trực tiếp
      const userData = await UserService.getProfile()

      return userData
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch user profile'
      )
    }
  }
)

// Thunk để cập nhật thông tin người dùng
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const updatedUser = await UserService.updateProfile(userData)

      return updatedUser
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update user profile'
      )
    }
  }
)

// Thunk để đổi mật khẩu
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (data: { oldPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const result = await UserService.changePassword(data)

      return result
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to change password')
    }
  }
)

// Thunk để lấy danh sách người dùng (Admin)
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const basicUsers = await UserService.getUsers()

    const users = basicUsers.map(user => ({
      ...user,
      id: String(user.id), // Convert id to string to match User type
      username: user.email // Use email as username or any appropriate default
    }))

    return users
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users')
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    clearUser: state => {
      state.user = null
    },
    clearSelectedUser: state => {
      state.selectedUser = null
    },
    clearError: state => {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder

      .addCase(fetchUserProfile.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // updateUserProfile reducers
      .addCase(updateUserProfile.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // changePassword reducers
      .addCase(changePassword.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, state => {
        state.loading = false
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // fetchUsers reducers
      .addCase(fetchUsers.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { setUser, clearUser, clearSelectedUser, clearError } = userSlice.actions

export default userSlice.reducer
