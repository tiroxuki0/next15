// src/app/[dynamic]/page.tsx
import { notFound } from 'next/navigation'

// Danh sách các trang động hợp lệ
const VALID_PAGES = ['about', 'services', 'contact', 'blog', 'profile', 'settings']

export default function DynamicPage({ params }: { params: { dynamic: string } }) {
  // Kiểm tra xem trang có tồn tại không
  if (!VALID_PAGES.includes(params.dynamic)) {
    // Kích hoạt trang 404
    notFound()
  }

  return (
    <div className='container py-12'>
      <h1 className='mb-6 text-3xl font-bold'>{params.dynamic.charAt(0).toUpperCase() + params.dynamic.slice(1)}</h1>
      <p className='text-lg'>Nội dung trang {params.dynamic}</p>
    </div>
  )
}
