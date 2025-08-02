'use client'
import { Card, CardActionArea, CardContent, Typography, Box, TextField, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useFirestore } from '@/api/useFirestore'
import { useRouter } from 'next/navigation'

const ServicesBlock = ({ service, onClick }) => (
  <Card variant='outlined' sx={{ maxWidth: 400, m: 1, flex: '1 1 250px' }} onClick={() => onClick(service)}>
    <CardActionArea>
      <CardContent>
        <Typography variant='h5' component='div'>
          {service.sectionTitle || 'No Title'}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {service.details || 'No description available.'}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
)

function Providers() {
  const { data: services, fetchData: fetchServices, loading, error } = useFirestore('services')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleCardClick = service => {
    // ✅ Route to /providers?serviceId=<SERVICE_ID>
    router.push(`/providers/list?serviceId=${service.sectionTitle}`)
  }

  const filteredServices = services.filter(service =>
    service.sectionTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress />
        <Typography variant='h6' sx={{ ml: 2 }}>
          Loading Services...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity='error'>Error fetching users: {error}</Alert>
      </Box>
    )
  }

  return (
    <Box p={2}>
      <Box display='flex' justifyContent='center' mb={3}>
        <TextField
          label='Search Services'
          variant='outlined'
          size='small'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          sx={{ width: '300px' }}
        />
      </Box>
      <Box display='flex' flexWrap='wrap' justifyContent='start'>
        {filteredServices.length > 0 ? (
          filteredServices.map(service => (
            <ServicesBlock key={service.id} service={service} onClick={handleCardClick} />
          ))
        ) : (
          <Typography>No services match your search</Typography>
        )}
      </Box>
    </Box>
  )
}

export default Providers
