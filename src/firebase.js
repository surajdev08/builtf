// import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
// import { getFirestore } from 'firebase/firestore'
// import { getStorage } from 'firebase/storage'
// import { getAuth } from 'firebase/auth' // ✅ Import auth

// const firebaseConfig = {
//   apiKey: 'AIzaSyDMGo2THSjnoVqmbGonq91RQJK1kDnYQgM',
//   authDomain: 'builtf-backend.firebaseapp.com',
//   projectId: 'builtf-backend',
//   storageBucket: 'builtf-backend.appspot.com', // ❗ corrected .app ➤ .app**spot.com**
//   messagingSenderId: '10785690837',
//   appId: '1:10785690837:web:a961a76925035cc975fe5c',
//   measurementId: 'G-KWH1X7ZLZK'
// }

// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// // Initialize Analytics only on the client-side
// let analytics

// if (typeof window !== 'undefined') {
//   analytics = getAnalytics(app)
// }

// const db = getFirestore(app)
// const storage = getStorage(app)
// const auth = getAuth(app) // ✅ Init Auth

// export { db, storage, auth, app, analytics }

import { initializeApp, getApps } from 'firebase/app' // Correctly import getApps here
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyDMGo2THSjnoVqmbGonq91RQJK1kDnYQgM',
  authDomain: 'builtf-backend.firebaseapp.com',
  projectId: 'builtf-backend',
  storageBucket: 'builtf-backend.appspot.com', // ❗ corrected .app ➤ .app**spot.com**
  messagingSenderId: '10785690837',
  appId: '1:10785690837:web:a961a76925035cc975fe5c',
  measurementId: 'G-KWH1X7ZLZK'
}

// Initialize Firebase App safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Conditionally initialize Analytics only on the client-side
let analytics

if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
}

export { app, auth, db, storage, analytics }
