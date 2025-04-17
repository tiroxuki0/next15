'use client'

import { AuthProvider } from '@/hooks/useAuth'
import { Provider } from 'react-redux'
import { store } from '@/stores/redux/store'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  )
}
