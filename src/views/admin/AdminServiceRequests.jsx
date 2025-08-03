'use client'

import React, { useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl
} from '@mui/material'
import { useFirestore } from '@/api/useFirestore'
import { format } from 'date-fns'

const AdminServiceRequests = () => {
  // Hook to manage the 'serviceRequests' collection
  const { data: requests, loading, error, fetchData, updateData } = useFirestore('serviceRequests')

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleStatusChange = async (id, newStatus) => {
    await updateData(id, { status: newStatus })
  }
  console.log(requests)
  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'confirmed':
        return 'info'
      case 'in-progress':
        return 'primary'
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Container maxWidth='xl' sx={{ my: 4 }}>
      <Typography variant='h4' gutterBottom>
        Service Requests Dashboard
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity='error'>{error}</Alert>}

      {!loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Requested At</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>User Contact</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Provider Contact</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests
                .sort((a, b) => b.requestedAt - a.requestedAt)
                .map(req => (
                  <TableRow key={req.id}>
                    <TableCell>{req.requestedAt ? format(req.requestedAt.toDate(), 'PPpp') : 'N/A'}</TableCell>
                    <TableCell>{req.userName}</TableCell>
                    <TableCell>{req.userContact}</TableCell>
                    <TableCell>{req.providerName}</TableCell>
                    <TableCell>{req.providerContact}</TableCell>
                    <TableCell>{req.serviceId}</TableCell>
                    <TableCell>
                      <FormControl size='small'>
                        <Select
                          value={req.status}
                          onChange={e => handleStatusChange(req.id, e.target.value)}
                          renderValue={selected => (
                            <Chip label={selected} color={getStatusColor(selected)} size='small' />
                          )}
                        >
                          <MenuItem value='pending'>pending</MenuItem>
                          <MenuItem value='confirmed'>confirmed</MenuItem>
                          <MenuItem value='in-progress'>in-progress</MenuItem>
                          <MenuItem value='completed'>completed</MenuItem>
                          <MenuItem value='cancelled'>cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

export default AdminServiceRequests
