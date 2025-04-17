import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { setToken, removeToken } from '@/lib/auth'
import { AuthService, LoginCredentials } from '@/services/authService'
import { User } from '@/types'

// State của Authentication
interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null | Record<string, string[]>
}

// State ban đầu
const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

/**
 * Đăng nhập
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Sử dụng AuthService thay vì gọi axios trực tiếp
      const result = await AuthService.login(credentials)

      if (!result.success) {
        // Xử lý lỗi từ AuthService
        return rejectWithValue(result.error || 'Đăng nhập thất bại')
      }

      // Trả về dữ liệu đăng nhập thành công
      return result.data
    } catch (error) {
      console.error('Login error:', error)

      return rejectWithValue('Đã xảy ra lỗi không mong muốn khi đăng nhập')
    }
  }
)

/**
 * Đăng xuất
 */
export const logout = createAsyncThunk('auth/logout', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as { auth: AuthState }

    if (auth.token) {
      // Sử dụng AuthService để logout
      const result = await AuthService.logout(auth.token)

      if (!result.success) {
        return rejectWithValue(result.error || 'Đăng xuất thất bại')
      }
    }

    // Xóa token từ storage
    removeToken()

    return true
  } catch (error) {
    console.error('Logout error:', error)
    removeToken()

    return true
  }
})

/**
 * Xác thực token
 */
export const verifyToken = createAsyncThunk(
  'auth/verify',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState }

      if (!auth.token) {
        return rejectWithValue('Không có token')
      }

      // Verify token hiện tại
      const result = await AuthService.verifyToken(auth.token)

      if (!result.success) {
        return rejectWithValue(result.error || 'Token không hợp lệ')
      }

      return result.data
    } catch (error) {
      console.error('Token verification error:', error)

      return rejectWithValue('Không thể xác thực token')
    }
  }
)

/**
 * Làm mới token
 */
export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState }

      if (!auth.token) {
        return rejectWithValue('Không có token để làm mới')
      }

      // Refresh token hiện tại
      const result = await AuthService.refreshToken(auth.token)

      if (!result.success) {
        return rejectWithValue(result.error || 'Không thể làm mới token')
      }

      return result.data
    } catch (error) {
      console.error('Token refresh error:', error)

      return rejectWithValue('Đã xảy ra lỗi khi làm mới token')
    }
  }
)

/**
 * Đăng ký
 */
export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      // Giả định AuthService.register tồn tại
      const result = await AuthService.register(userData)

      if (!result.success) {
        return rejectWithValue(result.error || 'Đăng ký thất bại')
      }

      return result.data
    } catch (error) {
      console.error('Registration error:', error)

      return rejectWithValue('Đã xảy ra lỗi khi đăng ký')
    }
  }
)

// Tạo slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Thiết lập thông tin xác thực thủ công
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      setToken(action.payload.token)
    },

    // Xóa thông tin xác thực
    clearCredentials: state => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      state.error = null
      removeToken()
    },

    // Xóa lỗi
    clearError: state => {
      state.error = null
    },

    // Cập nhật thông tin user
    updateUserInfo: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload && action.payload.token) {
          state.token = action.payload.token
          state.user = action.payload.user
          state.isAuthenticated = true
          state.loading = false
          state.error = null
          setToken(action.payload.token)
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload as AuthState['error']
      })

      // Register reducers
      .addCase(register.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        // Nếu đăng ký tự động đăng nhập, thì dòng dưới là phù hợp
        // Nếu không, comment lại và để người dùng đăng nhập
        if (action.payload && action.payload.token) {
          state.token = action.payload.token
          state.user = action.payload.user
          state.isAuthenticated = true
          state.loading = false
          setToken(action.payload.token)
        } else {
          state.loading = false
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as AuthState['error']
      })

      // Logout reducers
      .addCase(logout.pending, state => {
        state.loading = true
      })
      .addCase(logout.fulfilled, state => {
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
      .addCase(logout.rejected, state => {
        // Xóa thông tin dù thất bại
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })

      // Verify token reducers
      .addCase(verifyToken.pending, state => {
        state.loading = true
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload
          state.isAuthenticated = true
        }
        state.loading = false
        state.error = null
      })
      .addCase(verifyToken.rejected, state => {
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })

      // Refresh token reducers
      .addCase(refreshToken.pending, state => {
        state.loading = true
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token
          state.isAuthenticated = true
          state.loading = false
          setToken(action.payload.token)
        }
      })
      .addCase(refreshToken.rejected, state => {
        state.loading = false
      })
  }
})

// Export actions
export const { setCredentials, clearCredentials, clearError, updateUserInfo } = authSlice.actions

// Export reducer
export default authSlice.reducer

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error
