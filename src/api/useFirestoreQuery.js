import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'
import { useState, useEffect, useCallback } from 'react'

export function useFirestoreQuery(collectionPath, field, operator, value) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!collectionPath || !field || !value) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const q = query(collection(db, collectionPath), where(field, operator, value))

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        const results = querySnapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.()
        }))
        setData(results)
        setLoading(false)
      },
      err => {
        console.error('Error fetching query:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [collectionPath, field, operator, value])

  return { data, loading, error }
}
