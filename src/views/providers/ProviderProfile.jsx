'use client'

import React, { useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Skeleton,
  Alert,
  ImageList,
  ImageListItem,
  Rating,
  Avatar,
  Divider,
  Toolbar
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// ## FIX 1: Import the new hook ##
import { useFirestoreDoc } from '@/api/useFirestoreDoc'
import GlobalHeader from '../global/GlobalHeader'
import ElevationScroll from '../global/ElevationScroll'
import GlobalFooter from '../global/GlobalFooter'

const ProviderProfile = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const serviceId = searchParams.get('serviceId')
  const providerId = searchParams.get('providerId')

  const providerPath = useMemo(() => {
    return serviceId && providerId ? `services/${serviceId}/providers/${providerId}` : null
  }, [serviceId, providerId])

  // ## FIX 2: Use the new useFirestoreDoc hook ##
  const { data: provider, error, loading } = useFirestoreDoc(providerPath)

  const handleRequestService = () => {
    router.push(`/booking?serviceId=${serviceId}&providerId=${providerId}`)
  }

  // Skeletons remain the same
  const renderSkeletons = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        <Skeleton variant='rectangular' width='100%' height={400} sx={{ borderRadius: 2 }} />
        <Skeleton variant='rectangular' width='100%' height={56} sx={{ mt: 2, borderRadius: 2 }} />
      </Grid>
      <Grid item xs={12} md={7}>
        <Skeleton variant='text' width='60%' height={48} />
        <Skeleton variant='text' width='40%' height={24} />
        <Skeleton variant='text' width='50%' height={32} sx={{ my: 2 }} />
        <Skeleton variant='text' width='100%' height={20} />
        <Skeleton variant='text' width='100%' height={20} />
        <Skeleton variant='text' width='80%' height={20} />
        <Skeleton variant='rectangular' width='100%' height={250} sx={{ mt: 3, borderRadius: 2 }} />
      </Grid>
    </Grid>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <ElevationScroll>
        <GlobalHeader />
      </ElevationScroll>
      <Toolbar />

      <Container maxWidth='lg' sx={{ py: 4, flexGrow: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 3 }}>
          Back to Providers
        </Button>

        {loading && renderSkeletons()}
        {error && <Alert severity='error'>{error}</Alert>}
        {!loading && !error && !provider && (
          <Alert severity='warning'>Provider not found. They may no longer be available.</Alert>
        )}

        {provider && (
          <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, bgcolor: 'white', borderRadius: 2 }}>
            <Grid container spacing={{ xs: 3, md: 5 }}>
              <Grid item xs={12} md={5}>
                <Box
                  component='img'
                  src={provider.profileimg || 'https://via.placeholder.com/600x600?text=No+Image'}
                  alt={`Profile of ${provider.Name}`}
                  sx={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: 2, mb: 3 }}
                />
                <Button variant='contained' size='large' fullWidth onClick={handleRequestService}>
                  Request Service
                </Button>
              </Grid>

              <Grid item xs={12} md={7}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant='h4' component='h1' fontWeight='bold'>
                      {provider.Name}
                    </Typography>
                    <Typography variant='body1' color='text.secondary'>
                      {provider.Location}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                  <Rating value={parseFloat(provider.rating) || 0} precision={0.5} readOnly />
                  <Typography sx={{ ml: 1.5 }} variant='body1' color='text.secondary'>
                    {provider.rating || 'No rating'} ({provider.reviewCount || 0} reviews)
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  About
                </Typography>
                <Typography variant='body1' paragraph color='text.secondary'>
                  {provider.description || 'No description available.'}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Work Gallery
                </Typography>
                {/* ## FIX 4: Corrected typo from workImage to workImages ## */}
                {provider.workImages && provider.workImages.length > 0 ? (
                  <ImageList variant='quilted' cols={3} rowHeight={164} gap={8}>
                    {provider.workImages.map((img, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={img}
                          alt={`Work sample ${index + 1}`}
                          loading='lazy'
                          style={{ borderRadius: '8px' }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <Typography variant='body2' color='text.secondary'>
                    No work samples have been uploaded yet.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>

      <GlobalFooter />
    </Box>
  )
}

export default ProviderProfile
