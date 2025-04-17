import { Metadata } from 'next'
import LoginForm from '@/components/pages/login/LoginForm'

export const metadata: Metadata = {
  title: 'Login'
}

export default function Page() {
  return (
    <main className='flex h-screen items-center justify-center p-5'>
      <LoginForm />
    </main>
  )
}
