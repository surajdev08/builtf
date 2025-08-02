import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useState, useCallback, useEffect } from 'react'

export function useFirestoreDoc(path) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDoc = useCallback(async () => {
    if (!path) {
      setData(null)
      return
    }
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
      setLoading(false)
    }
  }, [path])

  useEffect(() => {
    fetchDoc()
  }, [fetchDoc])

  return { data, loading, error, refetch: fetchDoc }
}
