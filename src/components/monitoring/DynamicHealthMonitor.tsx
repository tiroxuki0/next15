'use client'

import { usePathname } from 'next/navigation'
import PageHealthMonitor from './PageHealthMonitor'

export default function DynamicHealthMonitor() {
  const pathname = usePathname()
  
  return <PageHealthMonitor pageName={pathname || ''} />
}