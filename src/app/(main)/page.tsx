import Link from 'next/link'

export default function Home() {
  return (
    <div className='container py-12 md:py-20'>
      {/* Hero Section */}
      <section className='mx-auto max-w-5xl pb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-6xl'>Next.js 15 Template</h1>
        <p className='mb-8 text-lg text-muted-foreground md:text-xl'>
          Một khung khởi đầu hiện đại, nhanh chóng và dễ sử dụng cho dự án Next.js của bạn
        </p>
        <div className='flex flex-wrap justify-center gap-4'>
          <Link
            href='https://github.com/yourusername/next-15-starter'
            target='_blank'
            className='inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90'
          >
            GitHub Repository
          </Link>
          <Link
            href='https://nextjs.org/docs'
            target='_blank'
            className='inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground'
          >
            Xem Tài Liệu
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className='mx-auto max-w-6xl py-12'>
        <h2 className='mb-10 text-center text-3xl font-bold'>Tính Năng Chính</h2>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <FeatureCard
            title='Next.js 15'
            description='Tận dụng sức mạnh của phiên bản mới nhất với Server Components và App Router'
          />
          <FeatureCard title='TypeScript' description='Phát triển an toàn hơn với TypeScript được tích hợp sẵn' />
          <FeatureCard
            title='Tailwind CSS'
            description='Thiết kế giao diện linh hoạt và nhanh chóng với Tailwind CSS'
          />
          <FeatureCard
            title='Blockchain Integration'
            description='Kết nối dễ dàng với các smart contract và wallet trên nhiều blockchain'
          />
          <FeatureCard
            title='Authentication'
            description='Hỗ trợ đăng nhập bằng nhiều phương thức bao gồm Web3 và Social Login'
          />
          <FeatureCard
            title='Responsive UI'
            description='Giao diện tương thích với tất cả các thiết bị từ điện thoại đến máy tính'
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className='rounded-lg border bg-card p-6 shadow transition-all hover:shadow-md'>
      <h3 className='mb-2 text-xl font-bold'>{title}</h3>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  )
}
