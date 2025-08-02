// src/ProviderCard.js
import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Avatar,
  Divider
} from '@mui/material'
import Image from 'next/image'

// A default image to use if a provider has no profile image
const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/300x200.png?text=No+Image'

const ProviderCard = ({ provider }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        borderRadius: 2,
        boxShadow: 3,
        alignItems: 'center',
        padding: 2,
        gap: 10
      }}
    >
      <Avatar
        src={provider.profileimg || DEFAULT_IMAGE_URL}
        alt={provider.name}
        sx={{
          width: { xs: 60, sm: 80, md: 100 },
          height: { xs: 60, sm: 80, md: 100 }
        }}
      />

      <Divider orientation='vertical' variant='middle' flexItem />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant='h6' component='div' fontWeight='bold'>
          {provider.name}
        </Typography>
        <Chip label={provider.type} color='primary' size='small' sx={{ mb: 1 }} />
        <Typography variant='body2' color='text.secondary'>
          Location: {provider.location}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Price: {typeof provider.price === 'number' ? `$${provider.price}` : provider.price}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ProviderCard
