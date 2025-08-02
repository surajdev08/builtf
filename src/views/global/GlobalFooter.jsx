'use client'

import { Box, Typography, Grid, Link, IconButton, Divider } from '@mui/material'
import { Facebook, Twitter, Instagram, GitHub } from '@mui/icons-material'
import builtflogo from '../../../src/builtflogo.png'
import Image from 'next/image'

const GlobalFooter = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        mt: 8,
        pt: 6,
        pb: 4,
        px: { xs: 4, md: 15 },
        justifyContent: 'center'
      }}
    >
      <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo + About */}
        <Grid item xs={12} md={4}>
          <Box display='flex' alignItems='center' mb={2}>
            <Image src={builtflogo} alt='Logo' width={150} height={55} />
            <Typography variant='h6' ml={1}>
              BuiltF
            </Typography>
          </Box>
          <Typography variant='body2'>
            Whether you're building or fixing, BuiltF connects you to trusted services — Construction, Maintenance,
            Tools & Labour, all in one place.
          </Typography>
        </Grid>

        {/* Navigation Links */}
        {/* <Grid item xs={12} sm={6} md={4}>
          <Typography variant='subtitle1' gutterBottom>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Link href='/home' underline='hover' color='inherit'>
              Home
            </Link>
            <Link href='/services' underline='hover' color='inherit'>
              Services
            </Link>
            <Link href='/about' underline='hover' color='inherit'>
              About Us
            </Link>
            <Link href='/contact' underline='hover' color='inherit'>
              Contact
            </Link>
          </Box>
        </Grid> */}

        {/* Contact + Socials */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{ justifyContent: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
        >
          <Typography variant='subtitle1' gutterBottom>
            Contact Us
          </Typography>
          <Typography variant='body2'>Email: support@builtf.com</Typography>
          <Typography variant='body2'>Phone: +91 98765 43210</Typography>

          <Box mt={2}>
            <IconButton href='https://facebook.com' target='_blank' color='inherit'>
              <Facebook />
            </IconButton>
            <IconButton href='https://twitter.com' target='_blank' color='inherit'>
              <Twitter />
            </IconButton>
            <IconButton href='https://instagram.com' target='_blank' color='inherit'>
              <Instagram />
            </IconButton>
            <IconButton href='https://github.com' target='_blank' color='inherit'>
              <GitHub />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant='body2' align='center' color='text.secondary'>
        © {new Date().getFullYear()} BuiltF. All rights reserved.
      </Typography>
    </Box>
  )
}

export default GlobalFooter
