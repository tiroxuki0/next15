'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Log lỗi ra console cho dev
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-6 py-12'>
      <div className='max-w-xl text-center'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight'>Đã xảy ra lỗi</h1>
        <p className='mb-2 text-muted-foreground'>Rất tiếc, đã xảy ra lỗi máy chủ khi xử lý yêu cầu của bạn.</p>
        <p className='mb-8 text-muted-foreground'>
          Đội ngũ kỹ thuật của chúng tôi đã được thông báo và đang khắc phục sự cố.
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
