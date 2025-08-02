'use client'

import { getDocs, collection } from 'firebase/firestore'
import { db } from '@/firebase' // adjust this path if needed
import { useState, useCallback, useEffect } from 'react'
export function useServicesApi(path) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!path) return

    setLoading(true)
    setError('')
    try {
      const snapshot = await getDocs(collection(db, path))
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setData(results)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [path])

  const addData = async newData => {
    if (!path) return

    setLoading(true)
    setError('')
    try {
      await addDoc(collection(db, path), newData)
      await fetchData()
    } catch (err) {
      console.error('Error adding data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Auto fetch on mount

  return {
    data,
    loading,
    error,
    fetchData,
    addData
  }
}
