import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import FormProvider from "../context";
import 'tailwindcss/tailwind.css';
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { pageview } from '../lib/gtag'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <FormProvider>
        <Component {...pageProps} />
      </FormProvider>
    </>
    )
}

export default MyApp
