import { NextResponse } from 'next/server'

// Định nghĩa các kiểu lỗi API
export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'SERVER_ERROR'

// Định nghĩa kiểu dữ liệu cho lỗi validation
export type ValidationErrors = {
  [field: string]: string | string[]
}

// Định nghĩa kiểu dữ liệu cho API response
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  error?: ApiErrorCode
  errors?: ValidationErrors
  data?: T
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      error: 'UNAUTHORIZED'
    },
    { status: 401 }
  )
}

export function forbidden(message = 'Forbidden') {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      error: 'FORBIDDEN'
    },
    { status: 403 }
  )
}

export function notFound(message = 'Not Found') {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      error: 'NOT_FOUND'
    },
    { status: 404 }
  )
}

export function serverError(message = 'Internal Server Error') {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      error: 'SERVER_ERROR'
    },
    { status: 500 }
  )
}

export function badRequest(message = 'Bad Request', errors?: ValidationErrors) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      error: 'BAD_REQUEST',
      errors
    },
    { status: 400 }
  )
}

export function success<T>(data: T, message = 'Success') {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data
    },
    { status: 200 }
  )
}

export function createApiResponse<T>(data: T, success = true, message = '', status = 200) {
  return NextResponse.json(
    {
      data,
      success,
      message,
      status
    },
    { status }
  )
}
