'use client'

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import useUserApi from '@/api/useUserApi'
import {
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Paper,
  CardMedia,
  Skeleton
} from '@mui/material'

import heroimage2 from '../Assets/heroimage2.jpg'

import Image from 'next/image'
import StaticServiceStepper from './global/StaticServiceStepper'

import { useFirestore } from '@/api/useFirestore'
import GlobalFooter from './global/GlobalFooter'
import LandingPageHeader from './global/LandingPageHeader'
function LandingPage() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const router = useRouter()
  const { fetchUserData, userData } = useUserApi()

  const { data: services, error, fetchData, loading } = useFirestore('services')
  const skeletonArray = new Array(4).fill(null)
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Box sx={{ bgcolor: 'white', width: '100%' }}>
      {/* AppBar */}
      <LandingPageHeader />
      <Toolbar />
      <Box sx={{ px: { xs: 2, sm: 4, md: 8 }, py: 4 }}>
        {/* Hero Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            mb: 8
          }}
        >
          {/* Text Content */}
          <Box sx={{ flex: 1, paddingX: 10 }}>
            <Typography variant='h2' gutterBottom>
              Build Better. Live Smarter.
            </Typography>
            <Typography variant='body1' paragraph>
              Whether you're building your dream project or need a quick repair, BuiltF makes it easy. We are your
              one-stop platform offering trusted and affordable solutions for Construction, Maintenance, Tools, and
              Labour — all in one place.
            </Typography>
            <Typography variant='body1' paragraph>
              From finding expert contractors and booking skilled workers to renting equipment or managing daily home
              fixes, BuiltF connects you with verified professionals, transparent pricing, and reliable service.
            </Typography>
            <Button
              variant='contained'
              sx={{
                width: 200,
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'grey.700' // or use a custom grey value like '#555'
                }
              }}
            >
              Explore Services
            </Button>
          </Box>

          {/* Hero Image */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Image src={heroimage2} width={600} height={500} alt='Hero' />
          </Box>
        </Box>

        {/* About Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            mb: 15
          }}
        >
          <StaticServiceStepper />
        </Box>

        {/* Services Section */}

        <Box sx={{ p: 4 }}>
          <Typography variant='h4' align='center' gutterBottom sx={{ mb: 2 }}>
            Our Services
          </Typography>
          <Typography variant='subtitle1' align='center' sx={{ mb: 4 }}>
            Explore a wide range of professional services designed to meet your needs.
          </Typography>

          {error && (
            <Typography color='error' align='center'>
              {error}
            </Typography>
          )}

          <Grid container spacing={4}>
            {loading
              ? skeletonArray.map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                      <Skeleton variant='rectangular' height={180} />
                      <CardContent>
                        <Skeleton variant='text' width='60%' height={28} />
                        <Skeleton variant='text' width='90%' height={20} />
                        <Skeleton variant='text' width='80%' height={20} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : services.map(service => (
                  <Grid item xs={12} sm={6} md={3} key={service.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardMedia component='img' height='180' image={service.image} alt={service.title} />
                      <CardContent>
                        <Typography variant='h6' gutterBottom>
                          {service.sectionTitle}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {service.details}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Box>
      </Box>

      <GlobalFooter />
    </Box>
  )
}

export default LandingPage
