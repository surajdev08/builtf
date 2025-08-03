'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Toolbar
} from '@mui/material'
import { useFirestoreQuery } from '@/api/useFirestoreQuery'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth' // Import the listener
import { format } from 'date-fns'
import GlobalHeader from '../global/GlobalHeader'
import ElevationScroll from '../global/ElevationScroll'

const MyRequests = () => {
  // ## FIX 1: Add state to manage authentication status ##
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setAuthLoading(false) // Stop loading once we get a result
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Use the new hook to fetch requests where 'userId' matches the current user's ID
  const {
    data: requests,
    loading: requestsLoading,
    error
  } = useFirestoreQuery(
    'serviceRequests',
    'userId',
    '==',
    user?.uid // Use the state variable 'user'
  )

  const steps = ['pending', 'confirmed', 'in-progress', 'completed']

  // Show a loading spinner while checking auth state
  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  // ## FIX 2: Check for user *after* auth loading is complete ##
  if (!user) {
    return (
      <Container maxWidth='md' sx={{ my: 4 }}>
        <Alert severity='error'>You must be logged in to view your requests.</Alert>
      </Container>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <ElevationScroll>
        <GlobalHeader />
      </ElevationScroll>
      <Toolbar />

      <Container maxWidth='md' sx={{ my: 4 }}>
        <Typography variant='h4' gutterBottom>
          My Service Requests
        </Typography>

        {requestsLoading && <CircularProgress size={24} />}
        {error && <Alert severity='error'>{error}</Alert>}

        {!requestsLoading && requests.length === 0 && (
          <Alert severity='info'>You have not made any service requests yet.</Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {requests
            .sort((a, b) => (b.requestedAt?.toDate() || 0) - (a.requestedAt?.toDate() || 0))
            .map(req => {
              const activeStep = steps.indexOf(req.status)
              const isCancelled = req.status === 'cancelled'

              return (
                <Card key={req.id} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant='h6'>Service: {req.serviceId}</Typography>
                    <Typography color='text.secondary'>Provider: {req.providerName}</Typography>
                    <Typography variant='body2' color='text.secondary' gutterBottom>
                      Requested on: {req.requestedAt ? format(req.requestedAt.toDate(), 'PPP') : 'N/A'}
                    </Typography>

                    {isCancelled ? (
                      <Alert severity='error' sx={{ mt: 2 }}>
                        This request has been cancelled.
                      </Alert>
                    ) : (
                      <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3 }}>
                        {steps.map(label => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    )}
                  </CardContent>
                </Card>
              )
            })}
        </Box>
      </Container>
    </Box>
  )
}

export default MyRequests
