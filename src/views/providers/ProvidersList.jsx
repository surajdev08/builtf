'use client'
import React, { useEffect, useState } from 'react'
import { useFirestore } from '@/api/useFirestore'
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Avatar
} from '@mui/material'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ProvidersList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const serviceId = searchParams.get('serviceId')
  const {
    data: providers,
    fetchData: fetchProviders,
    deleteData: deleteProvider,
    loading,
    error
  } = useFirestore(serviceId ? `services/${serviceId}/providers` : null)

  const [selected, setSelected] = useState([])

  useEffect(() => {
    if (serviceId) {
      fetchProviders()
    }
  }, [serviceId, fetchProviders])

  const handleOpenAdd = () => {
    router.push(`/providers/edit?serviceId=${serviceId}`)
  }

  const handleOpenEdit = providerId => {
    router.push(`/providers/edit?serviceId=${serviceId}&providerId=${providerId}`)
  }

  const handleDelete = async id => {
    if (confirm('Are you sure you want to delete this provider?')) {
      await deleteProvider(id)
    }
  }

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selected.length} selected providers?`)) {
      await Promise.all(selected.map(id => deleteProvider(id)))
      setSelected([])
    }
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = providers.map(n => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const isSelected = id => selected.indexOf(id) !== -1

  if (!serviceId) {
    return <Typography sx={{ p: 4 }}>Please select a service first.</Typography>
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ m: 4 }}>
        Error fetching providers: {error}
      </Alert>
    )
  }

  return (
    <Box p={3}>
      <Typography variant='h4' gutterBottom>
        Providers for: {serviceId}
      </Typography>
      <Box display='flex' justifyContent='space-between' alignItems='center' my={2}>
        <Button variant='contained' onClick={handleOpenAdd}>
          Add New Provider
        </Button>
        {selected.length > 0 && (
          <Button variant='contained' color='error' onClick={handleBulkDelete}>
            Delete Selected ({selected.length})
          </Button>
        )}
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    color='primary'
                    indeterminate={selected.length > 0 && selected.length < providers.length}
                    checked={providers.length > 0 && selected.length === providers.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Profile</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {providers.map(provider => {
                const isItemSelected = isSelected(provider.id)
                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, provider.id)}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={provider.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox color='primary' checked={isItemSelected} />
                    </TableCell>
                    <TableCell>
                      <Avatar src={provider.profileimg} alt={provider.Name} />
                    </TableCell>
                    <TableCell>{provider.Name}</TableCell>
                    <TableCell>{provider.Location}</TableCell>
                    <TableCell>{provider.Price}</TableCell>
                    <TableCell>{provider.contact}</TableCell>
                    <TableCell>{provider.Type}</TableCell>
                    <TableCell>
                      <Box display='flex' gap={1}>
                        <Button
                          variant='outlined'
                          size='small'
                          onClick={e => {
                            e.stopPropagation() // Prevent row click
                            handleOpenEdit(provider.id)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant='outlined'
                          size='small'
                          color='error'
                          onClick={e => {
                            e.stopPropagation() // Prevent row click
                            handleDelete(provider.id)
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
