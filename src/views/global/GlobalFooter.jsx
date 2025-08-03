'use client'

import { Box, Typography, Grid, IconButton, Divider, Stack, Container } from '@mui/material'
import { Facebook, Twitter, Instagram, GitHub } from '@mui/icons-material'
import builtflogo from '../../../src/builtflogo.png' // Adjust path if necessary
import Image from 'next/image'

const GlobalFooter = () => {
  return (
    <Box
      sx={{
        bgcolor: '#161C24', // Dark background color
        color: '#FFFFFF', // White text color
        mt: 8,
        py: 6,
        px: { xs: 2, md: 4 }
      }}
    >
      <Container maxWidth='lg'>
        <Grid container spacing={4} alignItems='center'>
          {/* Column 1: Logo and About */}
          <Grid item xs={12} md={6}>
            <Box display='flex' alignItems='center' mb={2}>
              <Typography variant='h6' component='div' sx={{ ml: 1, fontWeight: 'bold', color: 'white' }}>
                BuiltF
              </Typography>
            </Box>
            <Typography variant='body2' sx={{ color: 'rgba(255, 255, 255, 0.7)', pr: { md: 4 } }}>
              Whether you're building or fixing, BuiltF connects you to trusted services — Construction, Maintenance,
              Tools & Labour, all in one place.
            </Typography>
          </Grid>

          {/* Column 2: Contact and Socials */}
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant='overline' sx={{ fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.5)' }}>
              Contact
            </Typography>
            <Typography variant='body2' sx={{ opacity: 0.7, mt: 1, color: 'white' }}>
              support@builtf.com
            </Typography>
            <Stack direction='row' spacing={1} mt={1} sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <IconButton href='https://twitter.com' target='_blank' color='inherit'>
                <Twitter />
              </IconButton>
              <IconButton href='https://facebook.com' target='_blank' color='inherit'>
                <Facebook />
              </IconButton>
              <IconButton href='https://instagram.com' target='_blank' color='inherit'>
                <Instagram />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Typography variant='body2' align='center' sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          © {new Date().getFullYear()} BuiltF. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}

export default GlobalFooter
