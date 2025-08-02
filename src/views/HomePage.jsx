'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import useUserApi from '@/api/useUserApi'
import {
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  Paper
} from '@mui/material'

// Import MUI Icons
import SearchIcon from '@mui/icons-material/Search'
import CategoryIcon from '@mui/icons-material/Category'
import FoundationIcon from '@mui/icons-material/Foundation'
import EngineeringIcon from '@mui/icons-material/Engineering'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import ConstructionIcon from '@mui/icons-material/Construction'

import GlobalHeader from './global/GlobalHeader'
import ElevationScroll from './global/ElevationScroll'
import GlobalFooter from './global/GlobalFooter'
import { useFirestore } from '@/api/useFirestore'

// --- Helper for mapping service titles to icons ---
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

const HomePage = () => {
  const [user, setUser] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const router = useRouter()
  const { fetchUserData } = useUserApi()

  const { data: services, error, fetchData, loading } = useFirestore('services')

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser)
        fetchUserData()
      }
      setLoadingData(false)
    })
    return () => unsubscribe()
  }, [router, fetchUserData])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/landingpage')
  }

  if (loadingData) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  // To debug your services data, log the entire array like this:
  // console.log('Services from Firestore:', services)

  return (
    <Box sx={{ bgcolor: 'grey.50', width: '100%', backgroundColor: 'white' }}>
      <ElevationScroll>
        <GlobalHeader handleLogout={handleLogout} />
      </ElevationScroll>

      <Toolbar />

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 12 },
          textAlign: 'center',
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth='md'>
          <Typography variant='h2' component='h1' gutterBottom sx={{ fontWeight: 'bold' }}>
            Find & Book Trusted Services
          </Typography>
          <Typography variant='h6' color='text.secondary' paragraph sx={{ mb: 4 }}>
            Your one-stop platform for Construction, Maintenance, Tools, and Labour. Verified professionals, transparent
            pricing, and reliable service.
          </Typography>
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
                          onClick={() => router.push(`/providerspage?serviceId=${service.sectionTitle}`)}
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

      {/* How It Works Section */}
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

      <GlobalFooter />
    </Box>
  )
}

export default HomePage
