'use client'

import React, { useState } from 'react'
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, useTheme, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Image from 'next/image'
import builtflogo from '../../../src/builtflogo.png'
import { useRouter } from 'next/navigation'

const LandingPageHeader = ({ handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()
  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    handleMenuClose()
    window.location.href = '/user/profile'
  }

  const handleSettings = () => {
    handleMenuClose()
    window.location.href = '/user/settings'
  }

  return (
    <AppBar component='nav' sx={{ backgroundColor: 'white', color: '#000', paddingX: 10 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Image src={builtflogo} alt='Logo' width={150} height={55} />

        <Box sx={{ display: 'flex', gap: 10 }}>
          <Button
            variant='oulined'
            sx={{ color: 'black', border: '1px solid black' }}
            onClick={() => router.push('/register')}
          >
            SignUp
          </Button>
          <Button
            variant='contained'
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: 'grey.700' // or use a custom grey value like '#555'
              }
            }}
            onClick={() => router.push('/login')}
            hover={{ backgroundColor: 'darkgray' }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default LandingPageHeader
