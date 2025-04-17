'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log error cho phát triển
    console.error('Application error:', error)
  }, [error])

  return (
    <div className='flex h-screen flex-col items-center justify-center px-6 py-12'>
      <div className='max-w-xl text-center'>
        <div className='mx-auto mb-8 h-64 w-64'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-full w-full text-primary/50'
          >
            <circle cx='12' cy='12' r='10' />
            <line x1='12' y1='8' x2='12' y2='12' />
            <line x1='12' y1='16' x2='12.01' y2='16' />
          </svg>
        </div>

        <h1 className='mb-4 text-4xl font-bold tracking-tight'>Đã xảy ra lỗi</h1>

        <p className='mb-8 text-muted-foreground'>
          Rất tiếc, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Đội ngũ kỹ thuật của chúng tôi đã được thông báo.
        </p>

        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <button
            onClick={reset}
            className='inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          >
            Thử lại
          </button>
          <Link
            href='/'
            className='inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
