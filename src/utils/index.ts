import { type ClassValue, clsx } from 'clsx'
import { formatDate, formatDistanceToNowStrict } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date()
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true })
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, 'MMM d')
    } else {
      return formatDate(from, 'MMM d, yyyy')
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(n)
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// Interface cho performance metric
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  route?: string;
  context?: Record<string, any>;
}

// Log performance metric
export function logPerformanceMetric(
  name: string, 
  value: number, 
  options: { 
    unit?: string; 
    route?: string;
    context?: Record<string, any> 
  } = {}
): void {
  const { unit = 'ms', route, context = {} } = options
  
  const metric: PerformanceMetric = {
    name,
    value,
    unit,
    timestamp: Date.now(),
    route,
    context
  }
  
  // Log trong development
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `Metric [${name}]${route ? ` on ${route}` : ''}: ` +
      `${value.toFixed(2)}${unit}`, 
      context
    )
  }
  
  // Lưu vào localStorage để phân tích sau (giới hạn 1000 entries)
  if (typeof window !== 'undefined') {
    try {
      const storedMetrics = JSON.parse(
        localStorage.getItem('__performance_metrics__') || '[]'
      ) as PerformanceMetric[]
      
      storedMetrics.push(metric)
      
      // Giữ chỉ 1000 metrics gần nhất
      const limitedMetrics = storedMetrics.slice(-1000)
      
      localStorage.setItem('__performance_metrics__', JSON.stringify(limitedMetrics))
    } catch (e) {
      console.error('Failed to store performance metric:', e)
    }
  }
  
  // TODO: Gửi đến monitoring service của bạn (Sentry, Datadog, etc.)
  // sendToMonitoringService(metric);
}