// 'use client'
// import React from 'react'
// import { collection, addDoc } from 'firebase/firestore'

// import { db } from '@/firebase'

// export default function Page() {
//   const testAdd = async () => {
//     try {
//       addDoc(collection(db, 'services/Construction/providers'), {
//         providerName: 'ABC Paint Co',
//         type: 'Wall Painting',
//         area: 'Mumbai',
//         price: '₹50/sqft',
//         contact: '919876543210'
//       })

//       console.log('Doc added')
//       getDocs(collection(db, 'services/Construction/providers'))
//       alert('Document added successfully!')
//     } catch (err) {
//       console.error('Error adding doc', err)
//       alert('Error adding doc: ' + err.message)
//     }
//   }
//   return (
//     <>
//       <h1>Firestore Test</h1>
//       <button onClick={testAdd}>Add Test Document</button>
//     </>
//   )
// }

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useUserApi from '@/api/useUserApi' // Adjust the import based on your file structure

// Inside /dashboard/page.jsx or a layout file

import React from 'react'
import { auth } from '@/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
export default function Page() {
  const router = useRouter()
  const [user, setUser] = React.useState(null)
  const { getUserRole, fetchUserData, userData } = useUserApi() // Adjust the import based on your file structure

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser)
        fetchUserData()
      } else {
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const checkRole = async () => {
      try {
        const role = await getUserRole()
        if (role !== 'admin') {
          router.push('/home') // redirect if not admin
        }
      } catch (error) {
        console.error('Error fetching role:', error.message)
        router.push('/login') // fallback if auth fails
      }
    }

    if (user) {
      checkRole()
    }
  }, [user]) // ✅ Wait for user state

  return (
    <div>
      <h1>Welcome {userData?.name}</h1>
    </div>
  )
}
