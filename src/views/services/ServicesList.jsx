'use client'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useFirestore } from '@/api/useFirestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase'

export default function ServicesList() {
  const {
    data: services,
    fetchData: fetchServices,
    addData: addService,
    updateData: updateService,
    deleteData: deleteService,
    loading,
    error
  } = useFirestore('services')

  const [selectedRows, setSelectedRows] = useState([])
  const [editRow, setEditRow] = useState(null)
  const [formData, setFormData] = useState({ sectionTitle: '', details: '', status: '' })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const uploadImageToCloudinary = async file => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'unsigned_images') // Your preset
    formData.append('cloud_name', 'dsc4al7yr') // Your cloud name

    const res = await fetch(`https://api.cloudinary.com/v1_1/dsc4al7yr/image/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    return data.secure_url
  }

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleEdit = row => {
    setEditRow(row)
    setFormData({
      sectionTitle: row.sectionTitle || '',
      details: row.details || '',
      status: row.status || ''
    })
    setIsEdit(true)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setFormData({ sectionTitle: '', details: '', status: '' })
    setEditRow(null)
    setIsEdit(false)
    setDialogOpen(true)
  }

  const handleDelete = async id => {
    if (confirm('Are you sure you want to delete this service?')) {
      await deleteService(id)
    }
  }

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedRows.length} service(s)?`)) {
      for (const id of selectedRows) {
        await deleteService(id)
      }
      setSelectedRows([])
    }
  }

  const handleSave = async () => {
    let imageUrl = formData.imageUrl || '' // Keep existing if editing

    if (selectedFile) {
      imageUrl = await uploadImageToCloudinary(selectedFile)
    }

    const payload = {
      ...formData,
      imageUrl
    }

    if (isEdit && editRow) {
      await updateService(editRow.id, payload)
    } else {
      await addService(payload)
    }

    setDialogOpen(false)
  }

  const columns = [
    { field: 'sectionTitle', headerName: 'Name', flex: 1 },
    { field: 'details', headerName: 'Description', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'imageUrl',
      headerName: 'Image',
      flex: 1,
      renderCell: params => (
        <img src={params.value} alt='Service' style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: params => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant='outlined' size='small' color='primary' onClick={() => handleEdit(params.row)}>
            Edit
          </Button>
          <Button variant='outlined' size='small' color='error' onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </div>
      )
    }
  ]

  const rows = services.map(item => ({ id: item.id, ...item }))

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
    <Box p={3}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h4'>Construction Services</Typography>
        <Box display='flex' gap={2}>
          <Button variant='contained' color='primary' onClick={handleAdd}>
            + Add Service
          </Button>
          {selectedRows.length > 0 && (
            <Button variant='outlined' color='error' onClick={handleBulkDelete}>
              Delete Selected
            </Button>
          )}
        </Box>
      </Box>
      {loading && <Typography>Loading data...</Typography>}
      {error && <Typography color='error'>{error}</Typography>}

      {!loading && !error && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={ids => setSelectedRows(ids)}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        </div>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>{isEdit ? 'Edit Service' : 'Add Service'}</DialogTitle>
        <DialogContent>
          <TextField
            label='Name'
            fullWidth
            margin='normal'
            value={formData.sectionTitle}
            onChange={e => setFormData({ ...formData, sectionTitle: e.target.value })}
          />
          <TextField
            label='Description'
            fullWidth
            margin='normal'
            value={formData.details}
            onChange={e => setFormData({ ...formData, details: e.target.value })}
          />
          <TextField
            label='Status'
            fullWidth
            margin='normal'
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          />
          {/* Inside your Dialog */}
          <input type='file' accept='image/*' onChange={e => setSelectedFile(e.target.files[0])} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleSave}>
            {isEdit ? 'Save Changes' : 'Add Service'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
