import { getDocs, addDoc, updateDoc, deleteDoc, collection, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useState, useCallback } from 'react'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export function useFirestore(path) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    if (!path) return
    setLoading(true)
    setError('')
    try {
      const snapshot = await getDocs(collection(db, path))
      const results = snapshot.docs.map(d => {
        const docData = d.data()
        return {
          id: d.id,
          ...docData,
          createdAt: docData.createdAt?.toDate?.(),
          updatedAt: docData.updatedAt?.toDate?.()
        }
      })
      setData(results)
      return results
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [path])

  // NEW FUNCTION
  const uploadImages = async files => {
    const storage = getStorage()
    const urls = []
    for (const file of files) {
      const storageRef = ref(storage, `images/${path}/${Date.now()}-${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      urls.push(url)
    }
    return urls
  }

  const addData = async (newData, files = []) => {
    if (!path) return
    setLoading(true)
    setError('')
    try {
      if (files.length > 0) {
        newData.image = files.length === 1 ? (await uploadImages(files))[0] : await uploadImages(files)
      }
      await addDoc(collection(db, path), newData)
      await fetchData()
    } catch (err) {
      console.error('Error adding data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateData = async (id, updatedData, files = []) => {
    if (!path) return
    setLoading(true)
    setError('')
    try {
      if (files.length > 0) {
        updatedData.image = files.length === 1 ? (await uploadImages(files))[0] : await uploadImages(files)
      }
      const docRef = doc(db, path, id)
      await updateDoc(docRef, updatedData)
      await fetchData()
    } catch (err) {
      console.error('Error updating data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteData = async id => {
    if (!path) return
    setLoading(true)
    setError('')
    try {
      const docRef = doc(db, path, id)
      await deleteDoc(docRef)
      await fetchData()
    } catch (err) {
      console.error('Error deleting data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    fetchData,
    addData,
    updateData,
    deleteData
  }
}
