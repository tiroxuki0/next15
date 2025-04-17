import { NextRequest } from 'next/server'
import { AuthService } from '@/services/authService'
import { success, badRequest, unauthorized, serverError } from '@/lib/apiHelpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Sử dụng AuthService để đăng nhập
    const authResult = await AuthService.login(body)

    if (!authResult.success) {
      // Xử lý các loại lỗi khác nhau
      const statusCode = authResult.status

      if (statusCode === 400 && typeof authResult.error === 'object') {
        // Validation error
        return badRequest('Dữ liệu không hợp lệ', authResult.error)
      } else if (statusCode === 401) {
        // Unauthorized
        return unauthorized(authResult.error as string)
      } else {
        // Server error
        return serverError(authResult.error as string)
      }
    }

    // Đăng nhập thành công
    return success(authResult.data, 'Đăng nhập thành công')
  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : String(error))
    
return serverError('Lỗi máy chủ, vui lòng thử lại sau')
  }
}
