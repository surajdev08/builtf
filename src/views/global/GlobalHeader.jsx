'use client'

import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Image from 'next/image'
import builtflogo from '../../../src/builtflogo.png'
import { useRouter } from 'next/navigation'

import useUserApi from '@/api/useUserApi'

const GlobalHeader = ({ handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const [user, setUser] = useState(null)

  const { getUserRole, fetchUserData, userData } = useUserApi()
  const router = useRouter()

  const handleMenuOpen = event => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleProfile = () => {
    handleMenuClose()
    router.push('/user/profile')
  }

  const handleRequests = () => {
    handleMenuClose()
    router.push('/user/myrequests')
  }

  const handleSettings = () => {
    handleMenuClose()
    router.push('/user/settings')
  }

  const handleDashboard = () => {
    handleMenuClose()
    router.push('/dashboard')
  }

  useEffect(() => {
    const init = async () => {
      try {
        const fetchedUser = await fetchUserData()
        setUser(fetchedUser)

        const role = await getUserRole()
        if (role === 'admin') {
          setShowDashboard(true)
        }
      } catch (error) {
        console.error('Error fetching user or role:', error.message)
        router.push('/login')
      }
    }

    init()
  }, [])

  return (
    <AppBar component='nav' sx={{ backgroundColor: 'white', color: '#000', paddingX: 10 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Image src={builtflogo} alt='Logo' width={150} height={55} />
        <Box sx={{ display: 'flex', gap: 10 }}>
          <IconButton>
            <NotificationsIcon sx={{ color: 'black' }} />
          </IconButton>
          <IconButton onClick={handleMenuOpen}>
            <AccountCircleIcon sx={{ color: 'black' }} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {showDashboard && <MenuItem onClick={handleDashboard}>Admin Dashboard</MenuItem>}
            <MenuItem onClick={handleProfile}>My Profile</MenuItem>
            <MenuItem onClick={handleSettings}>Settings</MenuItem>
            <MenuItem onClick={handleRequests}>My Requests</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default GlobalHeader
