import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

type DecodedToken = {
  sub: string
  username: string
  email: string
  name?: string
  roles?: string[]
  exp: number
  iat: number
}

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)

    // Thiết lập domain theo môi trường
    const isLocalhost = window.location.hostname === 'localhost'

    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; httpOnly=false`

    Cookies.set('token', token, {
      expires: 7,
      path: '/',
      sameSite: 'lax',

      // Không thiết lập domain cho localhost
      ...(isLocalhost ? {} : { domain: window.location.hostname })
    })
  }
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')

    // Xóa cookie
    Cookies.remove('token', { path: '/' })

    console.log('Token removed from localStorage and cookie')
  }
}

export const getToken = () => {
  if (typeof window !== 'undefined') {
    // ★ QUAN TRỌNG: Kiểm tra cả localStorage và cookie
    return localStorage.getItem('token') || Cookies.get('token') || null
  }

  return null
}

export const isTokenValid = () => {
  const token = getToken()

  if (!token) return false

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Date.now() / 1000

    return decoded.exp > currentTime
  } catch {
    return false
  }
}

export const getUser = () => {
  const token = getToken()

  if (!token) return null

  try {
    const decoded = jwtDecode<DecodedToken>(token)

    return {
      id: decoded.sub,
      username: decoded.username,
      email: decoded.email,
      name: decoded.name,
      roles: decoded.roles || []
    }
  } catch {
    return null
  }
}

export const hasRole = (role: string) => {
  const user = getUser()

  if (!user || !user.roles) return false

  return user.roles.includes(role)
}
