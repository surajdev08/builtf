'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TextField, Button, Box, Typography } from '@mui/material'
import useUserApi from '@/api/useUserApi'
import { toast } from 'react-toastify'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const Profile = () => {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    city: '',
    address: '',
    state: '',
    pin: ''
  })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { updateUserDetails, fetchUserData } = useUserApi()

  // Handle input change
  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Save form data
  const handleSubmit = async () => {
    try {
      await updateUserDetails(form)
      toast.success('Profile updated successfully')
      router.push('/home') // Or your dashboard
    } catch (error) {
      toast.error('Error updating profile')
      console.error(error)
    }
  }

  // On auth state change → fetch user + user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      try {
        const userData = await fetchUserData()
        if (userData) {
          setForm(prev => ({
            ...prev,
            name: userData.name || '',
            contact: userData.contact || '',
            city: userData.city || '',
            address: userData.address || '',
            state: userData.state || '',
            pin: userData.pin || ''
          }))
        }
      } catch (err) {
        console.error('Failed to fetch user profile data:', err)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) return <Typography>Loading profile...</Typography>

  return (
    <Box maxWidth={600} mx='auto' p={4}>
      <Typography variant='h4' mb={2}>
        {user ? 'Edit Your Profile' : 'Loading...'}
      </Typography>
      <form className='flex flex-col gap-4'>
        {['name', 'contact', 'city', 'address', 'state', 'pin'].map(field => (
          <TextField
            key={field}
            name={field}
            label={field[0].toUpperCase() + field.slice(1)}
            fullWidth
            value={form[field]}
            onChange={handleChange}
          />
        ))}
        <Button variant='contained' onClick={handleSubmit}>
          Save Details
        </Button>
      </form>
    </Box>
  )
}

export default Profile
