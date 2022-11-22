import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/devtools'
import { trpc } from '~/client/utils/trpc'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default trpc.withTRPC(App);