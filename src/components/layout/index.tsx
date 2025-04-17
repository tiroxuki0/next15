'use client'

import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, User, Moon, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { isTokenValid, removeToken } from '@/lib/auth'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/stores/redux/slices/authSlice'
import { useToast } from '@/hooks/useToast'
import { AppDispatch, RootState } from '@/stores/redux/store'

export function Header() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Lấy trạng thái đăng nhập từ Redux store
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  // Xử lý hydration và kiểm tra đăng nhập
  useEffect(() => {
    setMounted(true)

    // Kiểm tra trạng thái đăng nhập
    const checkAuthStatus = () => {
      // Ưu tiên sử dụng trạng thái từ Redux nếu đã được hydrate
      if (isAuthenticated) {
        setIsLoggedIn(true)
        setUsername(user?.username || 'User')
      } else {
        // Fallback kiểm tra token nếu Redux chưa được hydrate
        const loggedIn = isTokenValid()
        setIsLoggedIn(loggedIn)

        // Lấy thông tin người dùng từ localStorage nếu đã đăng nhập
        if (loggedIn) {
          try {
            const userStr = localStorage.getItem('user')
            if (userStr) {
              const userObj = JSON.parse(userStr)
              setUsername(userObj.username || 'User')
            }
          } catch (error) {
            console.error('Error parsing user data:', error)
          }
        }
      }
    }

    checkAuthStatus()
  }, [isAuthenticated, user])

  const handleLogout = async () => {
    try {
      // Dispatch action logout để cập nhật Redux store
      await dispatch(logout()).unwrap()

      // Hiển thị thông báo
      toast({
        title: 'Đăng xuất thành công',
        description: 'Bạn đã đăng xuất khỏi hệ thống',
        variant: 'default'
      })

      // Cập nhật trạng thái UI (mặc dù useEffect sẽ làm điều này khi Redux cập nhật)
      setIsLoggedIn(false)
      setUsername('')

      // Chuyển hướng về trang chủ
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)

      // Trong trường hợp lỗi, vẫn xóa token và thông tin người dùng
      removeToken()
      localStorage.removeItem('user')

      // Hiển thị thông báo
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Vẫn tiến hành đăng xuất. Vui lòng thử đăng nhập lại.',
        variant: 'destructive'
      })

      // Cập nhật UI và chuyển hướng
      setIsLoggedIn(false)
      router.push('/')
    }
  }

  // Lấy chữ cái đầu tiên của username cho avatar
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <header className='sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between py-4'>
        <div className='flex items-center gap-2'>
          <Link href='/' className='text-xl font-bold'>
            Next.js 15 Starter
          </Link>
        </div>

        <nav className='flex items-center gap-4'>
          {/* Hiển thị các liên kết chính */}
          <Link href='/about' className='hidden text-sm font-medium hover:underline md:block'>
            About
          </Link>
          <Link href='/services' className='hidden text-sm font-medium hover:underline md:block'>
            Services
          </Link>
          <Link href='/blog' className='hidden text-sm font-medium hover:underline md:block'>
            Blog
          </Link>

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className='rounded-md bg-muted/60 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
            aria-label='Toggle theme'
          >
            {mounted &&
              (isDark ? (
                <Sun size={18} className='text-yellow-500' />
              ) : (
                <Moon size={18} className='text-blue-500' />
              ))}
          </button>

          {/* Hiển thị nút đăng nhập hoặc dropdown menu tùy thuộc vào trạng thái đăng nhập */}
          {mounted && isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary hover:bg-primary/20'
                >
                  {getInitials(username)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>{username}</p>
                    <p className='text-xs leading-none text-muted-foreground'>
                      {username.toLowerCase()}@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href='/login'>
              <Button variant='outline' size='sm' className='bg-background hover:bg-muted'>
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className='border-t py-6'>
      <div className='container flex flex-col items-center justify-between gap-4 md:flex-row'>
        <p className='text-center text-sm text-muted-foreground'>
          &copy; Next.js 15 Starter. All rights reserved.
        </p>
        <nav className='flex items-center gap-4'>
          <Link
            href='https://nextjs.org'
            target='_blank'
            className='text-sm text-muted-foreground hover:underline'
          >
            Next.js
          </Link>
          <Link
            href='https://tailwindcss.com'
            target='_blank'
            className='text-sm text-muted-foreground hover:underline'
          >
            Tailwind CSS
          </Link>
        </nav>
      </div>
    </footer>
  )
}
