// src/api/useFirestoreDoc.js
import { useState, useCallback, useEffect } from 'react'

import { doc, getDoc } from 'firebase/firestore'

import { db } from '@/firebase'

export function useFirestoreDoc(path) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDoc = useCallback(async () => {
    if (!path) {
      setLoading(false) // Stop loading if no path is provided
      
return
    }


    // Set loading to true only when a fetch starts
    setLoading(true)
    setError('')

    try {
      const docRef = doc(db, path)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const docData = docSnap.data()

        setData({
          id: docSnap.id,
          ...docData,
          createdAt: docData.createdAt?.toDate?.(),
          updatedAt: docData.updatedAt?.toDate?.()
        })
      } else {
        setError('Document not found.')
        setData(null)
      }
    } catch (err) {
      console.error('Error fetching document:', err)
      setError(err.message)
    } finally {
      // **CRITICAL:** Always set loading to false after the operation.
      setLoading(false)
    }
  }, [path])

  useEffect(() => {
    fetchDoc()
  }, [fetchDoc]) // The dependency array is correct

  return { data, loading, error, refetch: fetchDoc }
}
