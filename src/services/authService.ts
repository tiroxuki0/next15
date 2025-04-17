import { jwtDecode } from 'jwt-decode'
import { z } from 'zod'

// Types
export interface UserData {
  id: string
  username: string
  email: string
  name: string
  roles?: string[]
}

export interface LoginResponse {
  token: string
  user: UserData
  expiresAt: string
}

export interface ValidationError {
  [key: string]: string[]
}

export interface AuthResult<T = any> {
  success: boolean
  data?: T
  error?: string | ValidationError
  status: number
}

// Schemas for validation
export const loginSchema = z.object({
  username: z.string().min(1, 'Tên đăng nhập không được để trống'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

export type LoginCredentials = z.infer<typeof loginSchema>

export const AuthService = {
  /**
   * Đăng nhập và trả về token nếu thành công
   */
  login: async (credentials: LoginCredentials): Promise<AuthResult<LoginResponse>> => {
    // Validate input
    const validationResult = loginSchema.safeParse(credentials)

    if (!validationResult.success) {
      const formattedErrors: ValidationError = {}

      Object.entries(validationResult.error.flatten().fieldErrors).forEach(([field, errors]) => {
        formattedErrors[field] = errors as string[]
      })

      return {
        success: false,
        error: formattedErrors,
        status: 400
      }
    }

    try {
      // Trong thực tế, bạn sẽ gọi API
      // const response = await axiosInstance.post('/auth/login', credentials)
      // return response.data

      // Mock authentication
      const { username, password } = credentials

      if (username === 'user' && password === '123456a@') {
        // Tạo mock token
        const mockPayload = {
          sub: '1',
          username,
          email: `${username}@example.com`,
          name: 'User',
          roles: ['user', 'admin'],
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 giờ
        }

        // Tạo JWT token giả
        const token = [
          btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
          btoa(JSON.stringify(mockPayload)),
          'MOCK_SIGNATURE'
        ].join('.')

        // Calculate expiry time
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

        return {
          success: true,
          data: {
            token,
            user: {
              id: '1',
              username,
              email: `${username}@example.com`,
              name: 'Admin User'
            },
            expiresAt: expiresAt.toISOString()
          },
          status: 200
        }
      } else {
        return {
          success: false,
          error: 'Tên đăng nhập hoặc mật khẩu không chính xác',
          status: 401
        }
      }
    } catch (error) {
      console.error('Login error:', error)

      return {
        success: false,
        error: 'Lỗi máy chủ, vui lòng thử lại sau',
        status: 500
      }
    }
  },

  /**
   * Tạo Mock JWT token (client-side)
   */
  generateMockToken: (payload: Record<string, any>): string => {
    const mockPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 giờ
    }

    return [
      btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
      btoa(JSON.stringify(mockPayload)),
      'MOCK_SIGNATURE'
    ].join('.')
  },

  /**
   * Decode token (client-side)
   */
  verifyToken: (token: string): AuthResult<UserData> => {
    try {
      // Sử dụng jwt-decode thay vì jsonwebtoken
      const decoded = jwtDecode<{
        sub: string
        username: string
        email: string
        name: string
        roles?: string[]
        exp?: number
      }>(token)

      // Kiểm tra token có hết hạn không
      if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000)
        if (decoded.exp < currentTime) {
          return {
            success: false,
            error: 'Token đã hết hạn',
            status: 401
          }
        }
      }

      return {
        success: true,
        data: {
          id: decoded.sub,
          username: decoded.username,
          email: decoded.email,
          name: decoded.name,
          roles: decoded.roles
        },
        status: 200
      }
    } catch (error) {
      return {
        success: false,
        error: 'Token không hợp lệ hoặc đã hết hạn',
        status: 401
      }
    }
  },

  /**
   * Refresh token
   */
  refreshToken: (token: string): AuthResult<{ token: string; expiresAt: string }> => {
    const verification = AuthService.verifyToken(token)

    if (!verification.success) {
      return verification as AuthResult
    }

    // Tạo token mới với thông tin user cũ
    const newToken = AuthService.generateMockToken({
      sub: verification.data?.id,
      username: verification.data?.username,
      email: verification.data?.email,
      name: verification.data?.name,
      roles: verification.data?.roles
    })

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    return {
      success: true,
      data: {
        token: newToken,
        expiresAt: expiresAt.toISOString()
      },
      status: 200
    }
  },

  /**
   * Kiểm tra user có quyền không
   */
  hasPermission: (userData: UserData, requiredRole: string): boolean => {
    return userData.roles?.includes(requiredRole) || false
  },

  /**
   * Logout - chủ yếu xử lý phía client
   */
  logout: async (token: string): Promise<AuthResult<void>> => {
    // Trong thực tế, bạn có thể thêm token vào blacklist hoặc invalidate session
    // await axiosInstance.post('/auth/logout', { token })

    return {
      success: true,
      status: 200
    }
  },

  /**
   * Đăng ký người dùng mới
   */
  register: async (userData: any): Promise<AuthResult<LoginResponse>> => {
    try {
      // Trong thực tế, bạn sẽ gọi API
      // const response = await axiosInstance.post('/auth/register', userData)
      // return response.data

      // Mock registration
      const token = AuthService.generateMockToken({
        sub: Math.floor(Math.random() * 1000).toString(),
        username: userData.username,
        email: userData.email,
        name: userData.name || userData.username,
        roles: ['user']
      })

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      return {
        success: true,
        data: {
          token,
          user: {
            id: '2',
            username: userData.username,
            email: userData.email,
            name: userData.name || userData.username
          },
          expiresAt: expiresAt.toISOString()
        },
        status: 201
      }
    } catch (error) {
      return {
        success: false,
        error: 'Lỗi đăng ký tài khoản',
        status: 500
      }
    }
  }
}

export default AuthService
