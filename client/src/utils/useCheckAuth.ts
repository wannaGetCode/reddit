import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useIsLoginQuery } from '../generated/graphql'

export const useCheckAuth = () => {
  const router = useRouter()

  const {data, loading} = useIsLoginQuery()

  useEffect(() => {
    if (
      !loading &&
      data?.isLogin &&
      (
        router.route === '/login' ||
        router.route === '/register' ||
        router.route === '/forgot-password' ||
        router.route === '/change-password'
      )
    ) {
      router.replace('/')
    } else if (!data?.isLogin && router.route === 'create-post') {
      router.push('/login')
    }
  }, [data, loading, router])

  return {data, loading}
}