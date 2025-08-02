// src/ProvidersListPage.js
'use client'
import { auth } from '@/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import useUserApi from '@/api/useUserApi'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Box,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Skeleton
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LogoutIcon from '@mui/icons-material/Logout'
import ProviderCard from './ProviderCard'
import { useSearchParams } from 'next/navigation'
import { useFirestore } from '@/api/useFirestore' // Assuming this path is correct
import GlobalHeader from '../global/GlobalHeader'
import ElevationScroll from '../global/ElevationScroll'
import GlobalFooter from '../global/GlobalFooter'

const ProviderPage = () => {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('serviceId')
  const { fetchUserData, userData } = useUserApi()

  // State for the single filter we will use
  const [typeFilter, setTypeFilter] = useState('All Types')

  const [user, setUser] = useState(null)

  const router = useRouter()
  const [loadingData, setLoadingData] = useState(true)

  // Fetch data from Firestore using the custom hook
  const {
    data: firestoreProviders,
    fetchData: fetchProviders,
    loading,
    error
  } = useFirestore(serviceId ? `services/${serviceId}/providers` : null)

  // Trigger data fetching when the component mounts or serviceId changes
  useEffect(() => {
    if (serviceId) {
      fetchProviders()
    }
    // Reset filter when serviceId changes
    setTypeFilter('All Types')
  }, [serviceId, fetchProviders])

  // --- Data Transformation and Filtering Logic ---

  // 1. Memoize the transformation of Firestore data to match the expected format for the UI
  const formattedProviders = useMemo(() => {
    if (!firestoreProviders) return []
    return firestoreProviders.map(p => ({
      id: p.id, // useFirestore hook should provide the document ID
      name: p.Name,
      type: p.Type,
      location: p.Location,
      price: p.Price,
      profileImageUrl: p.profileimg || null, // Handle empty profile image URL
      contact: p.contact
    }))
  }, [firestoreProviders])

  // 2. Get unique types from the formatted data for the filter dropdown
  const uniqueTypes = useMemo(() => [...new Set(formattedProviders.map(p => p.type))], [formattedProviders])

  // 3. Filter providers based on the selected type
  const filteredProviders = useMemo(
    () =>
      formattedProviders.filter(provider => {
        return typeFilter === 'All Types' || provider.type === typeFilter
      }),
    [formattedProviders, typeFilter]
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser)
        fetchUserData()
      } else {
        router.push('/login')
      }
      setLoadingData(false)
    })
    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/landingpage')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'white' }}>
      {/* 1. Global Header */}
      <ElevationScroll>
        <GlobalHeader handleLogout={handleLogout} />
      </ElevationScroll>
      <Toolbar /> {/* Spacer */}
      {/* 2. Main Content Area */}
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
          Back to Home
        </Button>

        <Typography variant='h4' component='h1' gutterBottom align='center' fontWeight='bold'>
          Explore Our Providers
        </Typography>

        {/* 3. Filters Section - Now with only a Type filter */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <FormControl sx={{ m: 1, minWidth: 240 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select value={typeFilter} label='Filter by Type' onChange={e => setTypeFilter(e.target.value)}>
              <MenuItem value='All Types'>All Types</MenuItem>
              {uniqueTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* 4. Conditional Messages & Providers Grid */}
        {error && <Alert severity='error' sx={{ mb: 4 }}>{`Error: ${error}`}</Alert>}

        {!loading && !error && filteredProviders.length === 0 && (
          <Alert severity='info' sx={{ mt: 4 }}>
            {firestoreProviders.length > 0
              ? 'No providers found matching your criteria.'
              : 'No providers found for this service.'}
          </Alert>
        )}

        <Grid container spacing={4}>
          {loading
            ? // Loading Skeletons
              Array.from(new Array(6)).map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Skeleton variant='rectangular' height={160} />
                  <Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width='60%' />
                  </Box>
                </Grid>
              ))
            : // Provider Cards
              filteredProviders.map(provider => (
                <Grid item key={provider.id} xs={12} sm={6} md={4}>
                  <ProviderCard provider={provider} />
                </Grid>
              ))}
        </Grid>
      </Container>
      {/* 5. Global Footer */}
      <GlobalFooter />
    </Box>
  )
}

export default ProviderPage
