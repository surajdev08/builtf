'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { auth } from '@/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import useUserApi from '@/api/useUserApi'
import { useFirestore } from '@/api/useFirestore'

import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Skeleton,
  Paper,
  TextField,
  Slider,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Rating,
  Toolbar // Make sure Toolbar is imported
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import GlobalHeader from '../global/GlobalHeader'
import ElevationScroll from '../global/ElevationScroll'
import GlobalFooter from '../global/GlobalFooter'

const ProviderPage = () => {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('serviceId')
  const { fetchUserData } = useUserApi()
  const router = useRouter() // Initialize the router

  // --- State for Filters ---
  const [locationFilter, setLocationFilter] = useState('')
  const [sortBy, setSortBy] = useState('rating_desc')
  const [priceRange, setPriceRange] = useState([0, 500])

  const [user, setUser] = useState(null)
  const [loadingData, setLoadingData] = useState(true)

  // Fetch data from Firestore
  const {
    data: firestoreProviders,
    fetchData: fetchProviders,
    loading,
    error
  } = useFirestore(serviceId ? `services/${serviceId}/providers` : null)

  useEffect(() => {
    if (serviceId) {
      fetchProviders()
    }
  }, [serviceId, fetchProviders])

  // --- Data Transformation and Filtering Logic ---
  const formattedProviders = useMemo(() => {
    if (!firestoreProviders) return []
    return firestoreProviders.map(p => ({
      id: p.id,
      name: p.Name,
      type: p.Type,
      location: p.Location,
      priceUnit: p.priceUnit,
      price: parseFloat(p.Price) || 0,
      rating: parseFloat(p.rating) || 0,
      profileImageUrl: p.profileimg || `https://source.unsplash.com/random/400x400?face&sig=${p.id}`
    }))
  }, [firestoreProviders])

  const filteredAndSortedProviders = useMemo(() => {
    let providers = [...formattedProviders] // Create a mutable copy

    if (locationFilter) {
      providers = providers.filter(p => p.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }
    providers = providers.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    providers.sort((a, b) => {
      switch (sortBy) {
        case 'rating_desc':
          return b.rating - a.rating
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        default:
          return 0
      }
    })
    return providers
  }, [formattedProviders, locationFilter, sortBy, priceRange])

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
  }, [router, fetchUserData])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/landingpage')
  }

  const pageTitle = serviceId ? `${serviceId.charAt(0).toUpperCase() + serviceId.slice(1)} Providers` : 'All Providers'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <ElevationScroll>
        <GlobalHeader handleLogout={handleLogout} />
      </ElevationScroll>
      <Toolbar />

      <Container maxWidth='lg' sx={{ py: 4, flexGrow: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/')} sx={{ mb: 2 }}>
          Back to Services
        </Button>

        <Typography variant='h3' component='h1' gutterBottom fontWeight='bold' sx={{ mb: 3 }}>
          {pageTitle}
        </Typography>

        <Paper elevation={2} sx={{ p: 3, mb: 5, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems='center'>
            {/* Filter components remain the same */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='Filter by Location'
                variant='outlined'
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select value={sortBy} label='Sort by' onChange={e => setSortBy(e.target.value)}>
                  <MenuItem value='rating_desc'>Rating (High to Low)</MenuItem>
                  <MenuItem value='price_asc'>Price (Low to High)</MenuItem>
                  <MenuItem value='price_desc'>Price (High to Low)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <Typography gutterBottom>
                Price Range (${priceRange[0]} - ${priceRange[1]})
              </Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay='auto'
                min={0}
                max={1000}
                step={10}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* --- Grid of Provider Cards --- */}
        <Grid container spacing={4}>
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Skeleton variant='rectangular' height={200} sx={{ borderRadius: 2 }} />
                  <Skeleton width='80%' height={28} />
                  <Skeleton width='40%' />
                </Grid>
              ))
            : filteredAndSortedProviders.map(provider => (
                <Grid item key={provider.id} xs={12} sm={6} md={4}>
                  {/*
                   *
                   * ## KEY CHANGE IS HERE ##
                   * The entire Card is now clickable and navigates to the detail page.
                   *
                   */}
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      cursor: 'pointer', // Add pointer cursor to indicate it's clickable
                      transition: '0.3s',
                      '&:hover': { boxShadow: 6 }
                    }}
                    onClick={() => router.push(`/providerprofile?serviceId=${serviceId}&providerId=${provider.id}`)}
                  >
                    <CardMedia component='img' height='200' image={provider.profileImageUrl} alt={provider.name} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant='h6' component='h2' fontWeight='bold'>
                        {provider.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                        {provider.location}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={provider.rating} precision={0.5} readOnly />
                        <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>
                          ({provider.rating})
                        </Typography>
                      </Box>
                      <Typography variant='h6' fontWeight='bold' color='primary.main'>
                        {provider.price}rs{provider.priceUnit}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button fullWidth variant='contained' size='large' component='div' tabIndex={-1}>
                        View Profile
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Container>
      <GlobalFooter />
    </Box>
  )
}

export default ProviderPage
