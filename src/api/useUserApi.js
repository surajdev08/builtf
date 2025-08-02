import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { set } from 'date-fns'
import { useState } from 'react'

const useUserApi = () => {
  const [userData, setUserData] = useState(null)

  const registerUser = async (email, password, role = 'user') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    // Save user role and details in Firestore
    await setDoc(doc(db, 'users', uid), {
      email,
      role,
      createdAt: serverTimestamp()
    })
  }

  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const updateUserDetails = async ({ name, contact, address, city, state, pin }) => {
    const uid = auth.currentUser.uid
    await updateDoc(doc(db, 'users', uid), {
      name,
      contact,
      address,
      city,
      state,
      pin
    })
  }

  const fetchUserData = async () => {
    const uid = auth.currentUser.uid
    const docSnap = await getDoc(doc(db, 'users', uid))
    setUserData(docSnap.data())
    if (docSnap.exists()) {
      return docSnap.data()
    }
  }

  const getUserRole = async (user = auth.currentUser) => {
    if (!user) throw new Error('User not authenticated')

    const userId = user.uid
    const userDoc = await getDoc(doc(db, 'users', userId))

    return userDoc.exists() ? userDoc.data().role : null
  }

  return { registerUser, loginUser, updateUserDetails, fetchUserData, getUserRole, userData }
}

export default useUserApi
