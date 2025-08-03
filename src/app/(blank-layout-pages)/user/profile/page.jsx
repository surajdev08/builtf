'use client'
import Profile from '@/views/user/Profile'
import React from 'react'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import { useRouter } from 'next/navigation'
import { ex } from 'node_modules/@fullcalendar/core/internal-common'

const Page = () => {
  const router = useRouter()
  useEffect(() => {
    // This effect handles user authentication state.
    // It sets the user if they are logged in, otherwise redirects to the login page.
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push('/login')
      }
    })

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe()
  }, [router])
  return <Profile />
}

export default Page
