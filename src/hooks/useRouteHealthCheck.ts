import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { logPerformanceMetric, measurePerformance } from '@/utils'

// Theo dõi thời gian tải trang
export function useRouteLoadTime() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Sử dụng Web Vitals API
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Đảm bảo thực hiện sau khi trang đã tải xong
      setTimeout(() => {
        // Lấy thông tin navigation timing
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (navigation) {
          // Thời gian tải trang tổng thể
          const pageLoadTime = navigation.loadEventEnd - navigation.startTime
          
          // Log page load time
          logPerformanceMetric('page_load_time', pageLoadTime, {
            route: pathname,
            context: {
              domComplete: navigation.domComplete,
              fetchStart: navigation.fetchStart,
              domInteractive: navigation.domInteractive
            }
          })
          
          // Log thời gian render
          const renderTime = navigation.domComplete - navigation.domContentLoadedEventStart
          logPerformanceMetric('render_time', renderTime, { route: pathname })
          
          // Log thời gian phản hồi server
          const serverResponseTime = navigation.responseEnd - navigation.requestStart
          logPerformanceMetric('server_response_time', serverResponseTime, { route: pathname })
        }
        
        // Kiểm tra LCP (Largest Contentful Paint)
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
        if (lcpEntries && lcpEntries.length > 0) {
          const lcp = lcpEntries[lcpEntries.length - 1] as any
          logPerformanceMetric('largest_contentful_paint', lcp.startTime, { 
            route: pathname,
            context: { element: lcp.element ? lcp.element.tagName : 'unknown' }
          })
        }
      }, 0)
    }
    
    // Cleanup
    return () => {
      // Log thời gian ở trên trang
      if (typeof window !== 'undefined' && window.performance) {
        const timeOnPage = performance.now()
        logPerformanceMetric('time_on_page', timeOnPage, { route: pathname })
      }
    }
  }, [pathname, searchParams])
}

// Check health của API calls trên route
export function useApiHealthCheck() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Patch fetch để theo dõi API calls
    const originalFetch = window.fetch
    
    window.fetch = async function(input, init) {
      const url = typeof input === 'string' 
        ? input 
        : input instanceof URL 
          ? input.href 
          : input instanceof Request 
            ? input.url 
            : String(input)
      
      const startTime = performance.now()
      
      try {
        const response = await originalFetch(input, init)
        const endTime = performance.now()
        
        // Log API call performance
        logPerformanceMetric('api_call', endTime - startTime, { 
          route: pathname,
          context: { 
            url,
            status: response.status,
            method: init?.method || 'GET'
          }
        })
        
        return response
      } catch (error) {
        const endTime = performance.now()
        
        // Log API call error
        logPerformanceMetric('api_call_error', endTime - startTime, { 
          route: pathname,
          context: { 
            url,
            error: error instanceof Error ? error.message : String(error),
            method: init?.method || 'GET'
          }
        })
        
        throw error
      }
    }
    
    // Cleanup patch
    return () => {
      window.fetch = originalFetch
    }
  }, [pathname])
}

// Theo dõi lỗi JavaScript trên route
export function useErrorTracking() {
  const pathname = usePathname()
  
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logPerformanceMetric('js_error', 1, {
        unit: 'count',
        route: pathname,
        context: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }
      })
    }
    
    window.addEventListener('error', handleError)
    
    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [pathname])
}

// Hook tổng hợp
export function useRouteHealthCheck() {
  useRouteLoadTime()
  useApiHealthCheck()
  useErrorTracking()
}