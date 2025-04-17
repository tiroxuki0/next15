// import { redirect } from "next/navigation";
import { Header, Footer } from '@/components/layout'
import SessionProvider from '@/providers/SessionProvider'
import DynamicHealthMonitor from '@/components/monitoring/DynamicHealthMonitor'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = null

  // if (!session?.user) redirect("/login");

  return (
    <SessionProvider session={session}>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-1'>{children}</main>
        <Footer />
        {/* Health Monitor không hiển thị UI nhưng giám sát performance và lỗi */}
        <DynamicHealthMonitor />
      </div>
    </SessionProvider>
  )
}