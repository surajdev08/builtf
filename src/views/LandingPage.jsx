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
import CategoryIcon from '@mui/icons-material/Category'
import FoundationIcon from '@mui/icons-material/Foundation'
import EngineeringIcon from '@mui/icons-material/Engineering'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import ConstructionIcon from '@mui/icons-material/Construction'

const getServiceIcon = serviceTitle => {
  // Add a check to prevent errors if serviceTitle is undefined
  if (!serviceTitle) {
    return <CategoryIcon sx={{ fontSize: 48, color: 'primary.main' }} />
  }

  const iconMap = {
    construction: <FoundationIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    labour: <EngineeringIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    // FIX: Changed "maintenance" to "maintenence" to match your data/screenshot
    maintenence: <HomeRepairServiceIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    // FIX: Changed "equipment" to "equipments" to match your data/screenshot
    equipments: <ConstructionIcon sx={{ fontSize: 48, color: 'primary.main' }} />
  }
  // Convert title to lowercase for reliable matching
  return iconMap[serviceTitle.toLowerCase()] || <CategoryIcon sx={{ fontSize: 48, color: 'primary.main' }} />
}

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
        <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center', backgroundColor: 'white' }}>
          <Container maxWidth='lg'>
            <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
              How It Works
            </Typography>
            <Typography variant='subtitle1' color='text.secondary' sx={{ mb: 6 }}>
              Get your project done in three simple steps.
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Paper variant='outlined' sx={{ p: 4, borderRadius: 2 }}>
                  <Typography variant='h1' color='primary.main' sx={{ fontWeight: 'bold' }}>
                    1
                  </Typography>
                  <Typography variant='h6' sx={{ my: 1 }}>
                    Search for a Service
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Use our filters to find exactly what you need, from construction to skilled labour.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper variant='outlined' sx={{ p: 4, borderRadius: 2 }}>
                  <Typography variant='h1' color='primary.main' sx={{ fontWeight: 'bold' }}>
                    2
                  </Typography>
                  <Typography variant='h6' sx={{ my: 1 }}>
                    Book a Provider
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Compare profiles, view ratings, and book the right professional for your job.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper variant='outlined' sx={{ p: 4, borderRadius: 2 }}>
                  <Typography variant='h1' color='primary.main' sx={{ fontWeight: 'bold' }}>
                    3
                  </Typography>
                  <Typography variant='h6' sx={{ my: 1 }}>
                    Get It Done
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Relax as our verified providers deliver quality service right to your doorstep.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
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

          <Container maxWidth='md'>
            <Box id='services' sx={{ py: { xs: 6, md: 10 }, bgcolor: 'white' }}>
              <Container maxWidth='lg'>
                {error && (
                  <Typography color='error' align='center'>
                    {error}
                  </Typography>
                )}

                <Grid container spacing={3}>
                  {loading
                    ? Array.from(new Array(4)).map((_, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <Paper variant='outlined' sx={{ p: 3, borderRadius: 2, height: '100px' }} />
                        </Grid>
                      ))
                    : services.map(service => (
                        <Grid item xs={12} sm={6} md={3} key={service.id}>
                          <Card
                            sx={{
                              height: '100%',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              p: 3,
                              borderRadius: 2, // Match modern aesthetic
                              transition: 'box-shadow 0.3s, transform 0.3s',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 6
                              }
                            }}
                            onClick={() => router.push(`/login`)}
                          >
                            {/* --- Icon Display --- */}
                            {getServiceIcon(service.sectionTitle)}

                            <CardContent sx={{ textAlign: 'center', p: 0, '&:last-child': { pb: 0 }, mt: 2 }}>
                              <Typography variant='h6' gutterBottom sx={{ fontWeight: 'medium' }}>
                                {service.sectionTitle}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                </Grid>
              </Container>
            </Box>
          </Container>
        </Box>
      </Box>

      <GlobalFooter />
    </Box>
  )
}

export default LandingPage
