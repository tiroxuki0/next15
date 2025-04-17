'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { loginSchema, type LoginValues } from '@/utils/validation'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '@/stores/redux/slices/authSlice'
import { RootState, AppDispatch } from '@/stores/redux/store'
import { useToast } from '@/hooks/useToast'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)

  // Redux hooks
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

  // Lấy callbackUrl từ query params (nếu có)
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  // Kiểm tra authentication khi component được mount
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Người dùng đã đăng nhập')
      router.push(callbackUrl)
    }
  }, [isAuthenticated, router, callbackUrl])

  // Hiển thị thông báo lỗi từ Redux state
  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === 'string' ? error : 'Vui lòng kiểm tra thông tin đăng nhập'

      toast({
        title: 'Đăng nhập thất bại',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  }, [error, toast])

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const handleLogin = async (userData: LoginValues) => {
    try {
      // Sử dụng Redux thunk để đăng nhập
      const resultAction = await dispatch(login(userData))

      // Kiểm tra kết quả đăng nhập
      if (login.fulfilled.match(resultAction)) {
        // Đăng nhập thành công
        toast({
          title: 'Đăng nhập thành công',
          description: 'Chào mừng bạn quay trở lại!',
          variant: 'default'
        })

        // Chuyển hướng sẽ được xử lý bởi useEffect (khi isAuthenticated thay đổi)
      }

      // Các trường hợp lỗi được xử lý bởi useEffect (khi error thay đổi)
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Lỗi không xác định',
        description: 'Đã xảy ra lỗi không mong muốn, vui lòng thử lại sau.',
        variant: 'destructive'
      })
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='mx-auto max-w-sm space-y-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold'>Đăng nhập</h1>
        <p className='text-muted-foreground'>
          Nhập thông tin đăng nhập để truy cập tài khoản của bạn
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className='space-y-4'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên đăng nhập</FormLabel>
                <FormControl>
                  <Input placeholder='username' {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      {...field}
                      disabled={loading}
                    />
                    <button
                      type='button'
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>
                <div className='flex items-center justify-between'>
                  <FormMessage />
                  <Link href='/forgot-password' className='text-sm text-primary hover:underline'>
                    Quên mật khẩu?
                  </Link>
                </div>
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>

          <div className='mt-4 text-center'>
            <p className='text-sm text-muted-foreground'>
              Chưa có tài khoản?{' '}
              <Link href='/register' className='text-primary hover:underline'>
                Đăng ký
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  )
}
