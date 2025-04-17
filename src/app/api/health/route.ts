import { NextResponse } from 'next/server'

export async function GET() {
  // Kiểm tra kết nối database (nếu có)
  // Kiểm tra các dịch vụ bên ngoài (nếu cần)
  
  // Trả về thông tin cơ bản về trạng thái ứng dụng
  return NextResponse.json({
    status: 'ok',
    time: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV
  })
}