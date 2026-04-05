import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { AuthProvider } from '@/contexts/AuthContext'
import { logger } from '@/utils/productionLogger'
import ErrorBoundary from '@/components/ErrorBoundary'

import AppBootstrapGuard from '@/components/AppBootstrapGuard'
// import RouteGuard from '@/components/RouteGuard'  // DISABLED
import ServiceInitializer from '@/components/ServiceInitializer'

import '@/styles/globals.css'

const Navbar = dynamic(() => import('@/components/layout/Navbar'), {
  ssr: false
})

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  const isAuthPage = router.pathname.startsWith('/auth')

  useEffect(() => {
    setIsMounted(true)
    document.documentElement.classList.add('dark')
    
    // Log environment variables in development only
    logger.debug('APP', 'Environment variables loaded', {
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      wsUrl: process.env.NEXT_PUBLIC_WS_URL,
      pathname: router.pathname
    })
  }, [router.pathname])

  useEffect(() => {
    // Log component mount in development only
    logger.debug('APP', 'Component mounted', { pathname: router.pathname })
  }, [router.pathname])

  // Prevent hydration mismatch by waiting for client-side mount
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white/60 font-mono text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('APP', 'Unhandled error in application', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack
        });
      }}
      maxRetries={3}
    >
      <AuthProvider>
        <AppBootstrapGuard>
          {/* <RouteGuard> */}  {/* DISABLED */}
            <ServiceInitializer>
              {!isAuthPage && <Navbar />}
              <Component {...pageProps} />
            </ServiceInitializer>
          {/* </RouteGuard> */}  {/* DISABLED */}

        </AppBootstrapGuard>

      </AuthProvider>
    </ErrorBoundary>
  )
}

export default MyApp