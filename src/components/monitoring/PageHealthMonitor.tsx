'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouteHealthCheck } from '@/hooks/useRouteHealthCheck'
import { logPerformanceMetric } from '@/utils'

// Theo dõi việc render lại quá nhiều của component
function useRenderCounter(componentName: string) {
  const renderCount = useRef(0)
  const pathname = usePathname()
  
  useEffect(() => {
    renderCount.current = 0
  }, [pathname])
  
  renderCount.current += 1
  
  useEffect(() => {
    if (renderCount.current > 5) {
      // Log nhiều lần render
      logPerformanceMetric('excessive_renders', renderCount.current, {
        unit: 'count',
        route: pathname,
        context: { componentName }
      })
    }
  })
  
  return renderCount.current
}

interface PageHealthMonitorProps {
  pageName: string // Tên của trang cụ thể đang được monitor
}

export default function PageHealthMonitor({ pageName }: PageHealthMonitorProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const renderCount = useRenderCounter(pageName)
  const mountTimeRef = useRef(performance.now())
  
  // Sử dụng hook tổng hợp
  useRouteHealthCheck()
  
  // Đo thời gian mounting của component
  useEffect(() => {
    const mountDuration = performance.now() - mountTimeRef.current
    
    logPerformanceMetric('page_mount_time', mountDuration, {
      route: pathname,
      context: { pageName }
    })
    
    // Snapshot Memory Usage
    if ('memory' in performance) {
      const memory = (performance as any).memory
      if (memory) {
        logPerformanceMetric('memory_usage', memory.usedJSHeapSize / (1024 * 1024), {
          unit: 'MB',
          route: pathname,
          context: { 
            totalJSHeapSize: memory.totalJSHeapSize / (1024 * 1024),
            jsHeapSizeLimit: memory.jsHeapSizeLimit / (1024 * 1024)
          }
        })
      }
    }
    
    // Check layout stability
    let cumulativeLayoutShift = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Capture CLS value
        if (entry.entryType === 'layout-shift') {
          const layoutShiftEntry = entry as any // LayoutShift type
          if (layoutShiftEntry.hadRecentInput === false) {
            cumulativeLayoutShift += layoutShiftEntry.value
          }
        }
      }
    })
    
    try {
      observer.observe({ type: 'layout-shift', buffered: true })
    } catch (e) {
      console.warn('Layout Shift API not supported', e)
    }
    
    // Capture FPS (dùng requestAnimationFrame)
    let frameCount = 0
    let lastFrameTime = performance.now()
    let lowFpsDetected = false
    
    function checkFrame() {
      frameCount++
      const now = performance.now()
      const delta = now - lastFrameTime
      
      if (delta >= 1000) { // Mỗi giây
        const fps = Math.round((frameCount * 1000) / delta)
        
        if (fps < 30 && !lowFpsDetected) {
          lowFpsDetected = true
          logPerformanceMetric('low_fps', fps, {
            unit: 'fps',
            route: pathname,
            context: { pageName }
          })
        }
        
        frameCount = 0
        lastFrameTime = now
      }
      
      requestId = requestAnimationFrame(checkFrame)
    }
    
    let requestId = requestAnimationFrame(checkFrame)
    
    // Cleanup
    return () => {
      cancelAnimationFrame(requestId)
      observer.disconnect()
      
      // Log CLS khi unmount
      if (cumulativeLayoutShift > 0) {
        logPerformanceMetric('cumulative_layout_shift', cumulativeLayoutShift, {
          unit: '',
          route: pathname
        })
      }
      
      // Đo thời gian tồn tại của component
      const lifetime = performance.now() - mountTimeRef.current
      logPerformanceMetric('page_lifetime', lifetime, {
        route: pathname,
        context: { pageName }
      })
    }
  }, [pathname, pageName])
  
  // Log khi có thay đổi URL params
  useEffect(() => {
    logPerformanceMetric('url_params_changed', 1, {
      unit: 'count',
      route: pathname,
      context: { 
        params: Object.fromEntries(new URLSearchParams(searchParams).entries())
      }
    })
  }, [searchParams, pathname])
  
  // Component này không render gì cả
  return null
}


/* EXAMPLE */

/* 

// Ví dụ trong Profile Page
'use client'

import { useEffect } from 'react'
import PageHealthMonitor from '@/components/monitoring/PageHealthMonitor'
import { measurePerformance } from '@/utils/utils'

export default function ProfilePage() {
  // Logic của trang
  useEffect(() => {
    // Đo thời gian khởi tạo dữ liệu
    measurePerformance(() => {
      // Logic khởi tạo dữ liệu
    }, 'profile_data_init')
  }, [])

  return (
    <>
      <div>
        <h1>Profile Page</h1>
      </div>
      
      <PageHealthMonitor pageName="ProfilePage" />
    </>
  )
}

*/