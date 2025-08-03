'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Skeleton,
  Alert,
  ImageList,
  ImageListItem,
  Rating,
  Avatar,
  Divider,
  Toolbar,
  Card,
  CardContent,
  Chip,
  Stack,
  Snackbar
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useFirestoreDoc } from '@/api/useFirestoreDoc'
import GlobalHeader from '../global/GlobalHeader'
import ElevationScroll from '../global/ElevationScroll'
import GlobalFooter from '../global/GlobalFooter'
import BookingModal from '../global/BookingModal'

const ProviderProfile = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const serviceId = searchParams.get('serviceId')
  const providerId = searchParams.get('providerId')

  // 2. ADD STATE FOR MODAL AND SUCCESS MESSAGE
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const providerPath = useMemo(() => {
    return serviceId && providerId ? `services/${serviceId}/providers/${providerId}` : null
  }, [serviceId, providerId])

  const { data: provider, error, loading } = useFirestoreDoc(providerPath)

  // 3. UPDATE HANDLER TO OPEN THE MODAL
  const handleRequestService = () => {
    setIsModalOpen(true)
  }

  // 4. FUNCTION TO CLOSE MODAL AND SHOW SUCCESS MESSAGE
  const handleModalClose = success => {
    setIsModalOpen(false)
    if (success) {
      setShowSuccess(true)
    }
  }

  const renderSkeletons = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Skeleton variant='rectangular' width='100%' height={300} sx={{ borderRadius: 2 }} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <Skeleton variant='rectangular' width='100%' height={150} sx={{ borderRadius: 2 }} />
          <Skeleton variant='rectangular' width='100%' height={150} sx={{ borderRadius: 2 }} />
          <Skeleton variant='rectangular' width='100%' height={250} sx={{ borderRadius: 2 }} />
        </Stack>
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
        {!loading && !error && !provider && <Alert severity='warning'>Provider not found.</Alert>}

        {provider && (
          <Grid container spacing={4}>
            {/* Left Column: Profile Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={provider.profileimg}
                    alt={provider.Name}
                    sx={{ width: 120, height: 120, margin: '0 auto 16px' }}
                  />
                  <Typography variant='h5' component='h1' fontWeight='bold'>
                    {provider.Name}
                  </Typography>
                  <Typography
                    variant='body1'
                    color='text.secondary'
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}
                  >
                    <LocationOnIcon fontSize='small' sx={{ mr: 0.5 }} />
                    {provider.Location}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Rating value={parseFloat(provider.rating) || 0} precision={0.5} readOnly />
                    <Typography sx={{ ml: 1.5 }} variant='body2' color='text.secondary'>
                      ({provider.reviewCount || 0})
                    </Typography>
                  </Box>
                  <Button variant='contained' size='large' fullWidth onClick={handleRequestService}>
                    Request Service
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column: Details, About, Gallery */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {/* Cards for details, about, and gallery remain the same */}
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Top Skills
                    </Typography>
                    <Stack direction='row' spacing={1} useFlexGap flexWrap='wrap'>
                      <Chip label={provider.Type || 'General'} color='primary' />
                      <Chip label='Repair' />
                      <Chip label='Installation' />
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Details
                    </Typography>
                    <Typography variant='body1' color='text.secondary'>
                      Contact: {provider.contact}
                    </Typography>
                    <Typography variant='body1' color='text.secondary'>
                      Pricing: ${provider.Price}
                      {provider.priceUnit}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      About {provider.Name}
                    </Typography>
                    <Typography variant='body1' paragraph color='text.secondary'>
                      {provider.description || 'No description available.'}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Work Gallery
                    </Typography>
                    {provider.workImage && provider.workImage.length > 0 ? (
                      <ImageList variant='quilted' cols={3} rowHeight={180} gap={8}>
                        {provider.workImage.map((img, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={img}
                              alt={`Work sample ${index + 1}`}
                              loading='lazy'
                              style={{ borderRadius: '8px', width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        No work samples have been uploaded yet.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Container>
      <GlobalFooter />

      {/* 5. RENDER THE MODAL AND SNACKBAR */}
      {provider && (
        <BookingModal open={isModalOpen} onClose={handleModalClose} provider={provider} serviceId={serviceId} />
      )}

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        message="Service requested successfully! You can track it in 'My Requests'."
      />
    </Box>
  )
}

export default ProviderProfile
