'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Grid,
  Paper,
  ImageList,
  ImageListItem,
  Stack,
  Divider,
  Button
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StarIcon from '@mui/icons-material/Star'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// Placeholder data for the provider
const providerData = {
  name: 'Mohan Sharma',
  location: 'Basti, Uttar Pradesh, India',
  profileImage: 'https://via.placeholder.com/150/f0f0f0/000?Text=MS', // Placeholder avatar
  skills: [
    { name: 'Plumbing', level: 0.8 },
    { name: 'Carpentry', level: 0.65 },
    { name: 'Electrical Wiring', level: 0.9 },
    { name: 'Painting', level: 0.75 }
  ],
  description:
    'Experienced and reliable handyman providing quality services in Basti and surrounding areas. Specializing in plumbing, carpentry, and electrical work. Contact me for your home repair needs!',
  views: 125,
  stars: 4.8,
  reviewCount: 32
}

// Placeholder images of the provider's work
const workImages = [
  'https://via.placeholder.com/300/cccccc/000?Text=Work+Sample+1',
  'https://via.placeholder.com/300/dddddd/000?Text=Work+Sample+2',
  'https://via.placeholder.com/300/eeeeee/000?Text=Work+Sample+3',
  'https://via.placeholder.com/300/f0f0f0/000?Text=Work+Sample+4'
]

const ProviderProfilePage = () => {
  return (
    <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Providers
      </Button>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={providerData.profileImage} sx={{ width: 80, height: 80, mr: 2 }} />
            <Box>
              <Typography variant='h5' component='h2'>
                {providerData.name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit', verticalAlign: 'middle' }} />
                {providerData.location}
              </Typography>
            </Box>
          </Box>
          {/* Placeholder for edit/options */}
          {/* <IconButton aria-label="add an alarm">
              <MoreVertIcon />
            </IconButton> */}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Skills Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Skills
          </Typography>
          <Stack spacing={2}>
            {providerData.skills.map((skill, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='subtitle1' sx={{ width: 120 }}>
                  {skill.name}
                </Typography>
                <LinearProgress variant='determinate' value={skill.level * 100} sx={{ flexGrow: 1, mr: 1 }} />
                <Typography variant='body2' color='text.secondary'>
                  {Math.round(skill.level * 100)}%
                </Typography>
              </Box>
            ))}
            {/* Placeholder for adding more skills */}
            {/* <Button size="small" startIcon={<AddIcon />}>Add Skill</Button> */}
          </Stack>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Work Samples */}
        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Work Samples
          </Typography>
          {workImages.length > 0 ? (
            <ImageList rowHeight={200} cols={3} gap={8}>
              {workImages.map((item, index) => (
                <ImageListItem key={index}>
                  <img
                    src={`${item}?w=300&h=200&fit=crop&auto=format`}
                    alt={`Work sample ${index + 1}`}
                    loading='lazy'
                    style={{ borderRadius: 4, display: 'block', width: '100%', height: 'auto' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Typography variant='body2' color='text.secondary'>
              No work samples available.
            </Typography>
          )}
          {/* Placeholder for adding more work images */}
          {/* <Button size="small" startIcon={<AddIcon />}>Add Work Image</Button> */}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Description */}
        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            About Me
          </Typography>
          <Typography variant='body1'>{providerData.description}</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Recognition/Stats */}
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VisibilityIcon color='primary' sx={{ mr: 0.5 }} />
            <Typography variant='body2'>{providerData.views} Views</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon color='warning' sx={{ mr: 0.5 }} />
            <Typography variant='body2'>
              {providerData.stars} ({providerData.reviewCount} Reviews)
            </Typography>
          </Box>
        </Box>

        {/* Contact Button */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant='contained' color='primary' size='large'>
            Contact Provider
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default ProviderProfilePage
