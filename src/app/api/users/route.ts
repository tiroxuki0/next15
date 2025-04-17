import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/services/userService'
import { createApiResponse } from '@/lib/apiHelpers'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)

    if (isNaN(id)) {
      return createApiResponse(null, false, 'Invalid user ID', 400)
    }

    // Mock data (thay vì gọi service)
    // Trong thực tế: const user = await UserService.getUserById(id);
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ]

    const user = users.find(u => u.id === id)

    if (!user) {
      return createApiResponse(null, false, 'User not found', 404)
    }

    return createApiResponse(user)
  } catch (error) {
    return createApiResponse(
      null,
      false,
      error instanceof Error ? error.message : 'Server error',
      500
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) {
      return createApiResponse(null, false, 'Invalid user ID', 400)
    }

    const body = await request.json()

    // Đảm bảo có dữ liệu để cập nhật
    if (Object.keys(body).length === 0) {
      return createApiResponse(null, false, 'No data provided for update', 400)
    }

    // Trong thực tế: const updatedUser = await UserService.updateUser(id, body);
    const updatedUser = { id, ...body }

    return createApiResponse(updatedUser, true, 'User updated successfully')
  } catch (error) {
    return createApiResponse(
      null,
      false,
      error instanceof Error ? error.message : 'Error updating user',
      500
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) {
      return createApiResponse(null, false, 'Invalid user ID', 400)
    }

    // Trong thực tế: await UserService.deleteUser(id);
    // Mô phỏng xóa thành công

    return createApiResponse(null, true, 'User deleted successfully')
  } catch (error) {
    return createApiResponse(
      null,
      false,
      error instanceof Error ? error.message : 'Error deleting user',
      500
    )
  }
}
