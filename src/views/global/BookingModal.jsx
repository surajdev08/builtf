'use client'

import React, { useState, useEffect } from 'react'
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Stack
} from '@mui/material'
import { useFirestore } from '@/api/useFirestore'
import useUserApi from '@/api/useUserApi'
import { auth } from '@/firebase'
import { serverTimestamp } from 'firebase/firestore'
import CloseIcon from '@mui/icons-material/Close'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
}

const BookingModal = ({ open, onClose, provider, serviceId }) => {
  const [bookingDetails, setBookingDetails] = useState({
    userName: '',
    userContact: '',
    userAddress: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hook to add a document to the 'serviceRequests' collection
  const { addData, error: submissionError } = useFirestore('serviceRequests')

  // Hook to get the current user's data
  const { userData, fetchUserData } = useUserApi()

  // Pre-fill the form with the logged-in user's data
  useEffect(() => {
    if (open && auth.currentUser) {
      fetchUserData()
    }
  }, [open, fetchUserData])

  useEffect(() => {
    if (userData) {
      setBookingDetails({
        userName: userData.name || '',
        userContact: userData.contact || '',
        userAddress: userData.address || ''
      })
    }
  }, [userData])

  const handleChange = e => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!auth.currentUser) {
      console.error('User not logged in.')
      setIsSubmitting(false)
      return
    }

    const requestData = {
      ...bookingDetails,
      userId: auth.currentUser.uid, // Attach the user's ID
      providerId: provider.id,
      providerName: provider.Name,
      providerContact: provider.contact,
      serviceId: serviceId,
      status: 'pending', // Initial status of the request
      requestedAt: serverTimestamp()
    }

    await addData(requestData)
    setIsSubmitting(false)

    // Close the modal on success
    if (!submissionError) {
      onClose(true) // Pass 'true' to indicate success
    }
  }

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <Box sx={style}>
        <IconButton onClick={() => onClose(false)} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
        <Typography variant='h6' component='h2' gutterBottom>
          Request Service from {provider?.Name}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Confirm or edit your details below to book this service.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label='Your Name'
              name='userName'
              value={bookingDetails.userName}
              onChange={handleChange}
              required
            />
            <TextField
              label='Your Contact Number'
              name='userContact'
              value={bookingDetails.userContact}
              onChange={handleChange}
              required
            />
            <TextField
              label='Your Full Address'
              name='userAddress'
              value={bookingDetails.userAddress}
              onChange={handleChange}
              required
              multiline
              rows={3}
            />
            <Button type='submit' variant='contained' disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : 'Submit Request'}
            </Button>
            {submissionError && <Alert severity='error'>{submissionError}</Alert>}
          </Stack>
        </form>
      </Box>
    </Modal>
  )
}

export default BookingModal
