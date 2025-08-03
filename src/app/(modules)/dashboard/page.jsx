'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import useUserApi from '@/api/useUserApi'

export default function Page() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const { getUserRole, fetchUserData, userData } = useUserApi()

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

  useEffect(() => {
    // This effect runs when the 'user' state has been updated.
    const handleUserAuthorization = async () => {
      if (user) {
        try {
          // Fetch the user's role and profile data in parallel for efficiency.
          const [role] = await Promise.all([getUserRole(), fetchUserData(user.uid)])

          // If the user's role is not 'admin', redirect them to the home page.
          if (role !== 'admin') {
            router.push('/home')
          }
        } catch (error) {
          console.error('Error during user authorization:', error.message)
          // Fallback to the login page if there's any error fetching data or roles.
          router.push('/login')
        }
      }
    }

    handleUserAuthorization()
  }, [user, fetchUserData, getUserRole, router])

  // Display a loading message while the user's data is being fetched.
  if (!userData) {
    return <div>Loading...</div>
  }

  // Once data is loaded, welcome the user.
  return (
    <div>
      <h1>Welcome {userData.name}</h1>
    </div>
  )
}
