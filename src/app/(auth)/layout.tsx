import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = null

  if (user) redirect('/')

  return <>{children}</>
}
