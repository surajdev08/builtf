'use client'

import { useEffect, useState, useRef } from 'react' // Import useRef
import { useRouter } from 'next/navigation'
import { Toolbar, Typography, Box, Button, Container, Card, CardContent, Grid, Paper } from '@mui/material'
import Image from 'next/image'
import { useFirestore } from '@/api/useFirestore'
import GlobalFooter from './global/GlobalFooter'
import LandingPageHeader from './global/LandingPageHeader'

// Assuming these are correctly placed
import heroimage2 from '../Assets/heroimage2.jpg'
import CategoryIcon from '@mui/icons-material/Category'
import FoundationIcon from '@mui/icons-material/Foundation'
import EngineeringIcon from '@mui/icons-material/Engineering'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import ConstructionIcon from '@mui/icons-material/Construction'

const getServiceIcon = serviceTitle => {
  if (!serviceTitle) {
    return <CategoryIcon sx={{ fontSize: 48, color: 'primary.main' }} />
  }
  const iconMap = {
    construction: <FoundationIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    labour: <EngineeringIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    maintenence: <HomeRepairServiceIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    equipments: <ConstructionIcon sx={{ fontSize: 48, color: 'primary.main' }} />
  }
  return iconMap[serviceTitle.toLowerCase()] || <CategoryIcon sx={{ fontSize: 48, color: 'primary.main' }} />
}

function LandingPage() {
  const router = useRouter()
  const { data: services, error, fetchData, loading } = useFirestore('services')

  // Create a ref for the services section
  const servicesRef = useRef(null)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Function to handle smooth scrolling
  const handleScroll = event => {
    event.preventDefault() // Prevent default anchor behavior
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <Box sx={{ bgcolor: 'white', width: '100%' }}>
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
          <Box sx={{ flex: 1, paddingX: { xs: 2, md: 10 } }}>
            <Typography variant='h2' gutterBottom>
              Build Better. Live Smarter.
            </Typography>
            <Typography variant='body1' paragraph>
              Whether you're building your dream project or need a quick repair, BuiltF makes it easy. We are your
              one-stop platform offering trusted and affordable solutions for Construction, Maintenance, Tools, and
              Labour — all in one place.
            </Typography>
            <Button
              variant='contained'
              onClick={handleScroll} // ** ADD ONCLICK HANDLER **
              sx={{
                width: 200,
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'grey.700'
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

        {/* How It Works Section */}
        <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
          <Container maxWidth='lg'>
            <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
              How It Works
            </Typography>
            {/* ... How It Works Grid ... */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Paper variant='outlined' sx={{ p: 4, borderRadius: 2 }}>
                  <Typography variant='h1' color='primary.main' sx={{ fontWeight: 'bold' }}>
                    1
                  </Typography>
                  <Typography variant='h6' sx={{ my: 1 }}>
                    Search for a Service
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
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Services Section */}
        <Box sx={{ p: 4 }} ref={servicesRef}>
          {' '}
          {/* ** ADD REF HERE ** */}
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
          <Grid container spacing={3} justifyContent='center'>
            {loading
              ? /* Skeletons */
                Array.from(new Array(4)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper variant='outlined' sx={{ p: 3, borderRadius: 2, height: '150px' }} />
                  </Grid>
                ))
              : /* Service Cards */
                services.map(service => (
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
                        borderRadius: 2,
                        transition: 'box-shadow 0.3s, transform 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        }
                      }}
                      onClick={() => router.push(`/login`)}
                    >
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
        </Box>
      </Box>

      <GlobalFooter />
    </Box>
  )
}

export default LandingPage
