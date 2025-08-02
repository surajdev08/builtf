'use client'
import React, { useEffect, useState } from 'react'
import { useFirestore } from '@/api/useFirestore'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Button, Modal, TextField, Stack, CircularProgress } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'unsigned_images') // Replace with your actual preset
  formData.append('cloud_name', 'dsc4al7yr') // Replace with your actual Cloudinary cloud name

  const response = await axios.post('https://api.cloudinary.com/v1_1/dsc4al7yr/image/upload', formData)
  return response.data.secure_url
}

export default function ProvidersList() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('serviceId')
  const {
    data: providers,
    fetchData: fetchProviders,
    addData: addProvider,
    updateData: updateProvider,
    deleteData: deleteProvider,
    loading,
    error
  } = useFirestore(serviceId ? `services/${serviceId}/providers` : null)

  const [selectionModel, setSelectionModel] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    Name: '',
    Location: '',
    Price: '',
    contact: '',
    Type: '',
    profileFile: null,
    profileimg: '',
    workFiles: [],
    workImage: []
  })

  useEffect(() => {
    if (serviceId) {
      fetchProviders()
    }
  }, [serviceId, fetchProviders])

  const handleOpenAdd = () => {
    setEditMode(false)
    setFormData({
      Name: '',
      Location: '',
      Price: '',
      contact: '',
      Type: '',
      profileFile: null,
      profileimg: '',
      workFiles: [],
      workImage: []
    })
    setModalOpen(true)
  }

  const handleOpenEdit = item => {
    setEditMode(true)
    setFormData({ ...item, profileFile: null, workFiles: [] })
    setModalOpen(true)
  }

  const handleDelete = async id => {
    if (confirm('Are you sure you want to delete this service?')) {
      await deleteProvider(id)
    }
  }

  const handleClose = () => setModalOpen(false)

  const handleSave = async () => {
    const { profileFile, workFiles, ...rest } = formData

    if (profileFile) {
      const profileUrl = await uploadToCloudinary(profileFile)
      rest.profileimg = profileUrl
    }

    if (workFiles.length > 0) {
      const workUrls = await Promise.all(workFiles.map(file => uploadToCloudinary(file)))
      rest.workImage = workUrls
    }

    if (editMode) {
      await updateProvider(formData.id, rest)
    } else {
      await addProvider(rest)
    }
    handleClose()
  }

  const handleBulkDelete = async () => {
    await Promise.all(selectionModel.map(id => deleteProvider(id)))
  }

  if (!serviceId) {
    return <Typography>Please select a service first.</Typography>
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
      <Box sx={{ p: 4 }}>
        <Alert severity='error'>Error fetching users: {error}</Alert>
      </Box>
    )
  }
  const columns = [
    {
      field: 'profileimg',
      headerName: 'Profile',
      flex: 1,
      renderCell: params =>
        params.value ? (
          <img src={params.value} alt='Profile' style={{ width: 40, height: 40, borderRadius: '50%' }} />
        ) : (
          'No image'
        )
    },
    { field: 'Name', headerName: 'Name', flex: 1 },
    { field: 'Location', headerName: 'Location', flex: 1 },
    { field: 'Price', headerName: 'Price', flex: 1 },
    { field: 'contact', headerName: 'Contact', flex: 1 },
    { field: 'Type', headerName: 'Type', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: params => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant='outlined' size='small' color='primary' onClick={() => handleOpenEdit(params.row)}>
            Edit
          </Button>
          <Button variant='outlined' size='small' color='primary' onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </div>
      )
    }
  ]

  const rows = providers.map(item => ({ id: item.id, ...item }))

  return (
    <Box p={3}>
      <Typography variant='h4' gutterBottom>
        Providers for Service: {serviceId}
      </Typography>
      <Box display='flex' justifyContent='space-between' alignItems='center' my={2}>
        <Button variant='contained' color='primary' onClick={handleOpenAdd}>
          Add Provider
        </Button>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          onRowSelectionModelChange={newSelection => {
            setSelectionModel(newSelection)
          }}
        />
      </div>

      <Modal open={modalOpen} onClose={handleClose} aria-labelledby='modal-title' sc>
        <Box
          bgcolor='background.paper'
          p={6}
          borderRadius={2}
          boxShadow={3}
          maxWidth={600}
          margin='auto'
          mt={5}
          maxHeight={'100vh'}
          sx={{ overflowY: 'auto' }}
        >
          <Typography variant='h6' id='modal-title' gutterBottom>
            {editMode ? 'Edit Provider' : 'Add Provider'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label='Name'
              value={formData.Name}
              onChange={e => setFormData({ ...formData, Name: e.target.value })}
              fullWidth
            />
            <TextField
              label='Location'
              value={formData.Location}
              onChange={e => setFormData({ ...formData, Location: e.target.value })}
              fullWidth
            />
            <TextField
              label='Price'
              value={formData.Price}
              onChange={e => setFormData({ ...formData, Price: e.target.value })}
              fullWidth
            />
            <TextField
              label='Contact'
              value={formData.contact}
              onChange={e => setFormData({ ...formData, contact: e.target.value })}
              fullWidth
            />
            <TextField
              label='Type'
              value={formData.Type}
              onChange={e => setFormData({ ...formData, Type: e.target.value })}
              fullWidth
            />

            {editMode && formData.profileimg && (
              <>
                <Typography variant='body2'>Current Profile Image:</Typography>
                <img
                  src={formData.profileimg}
                  alt='Profile'
                  style={{ width: '100%', maxHeight: 150, objectFit: 'cover' }}
                />
              </>
            )}

            {editMode && formData.workImage && formData.workImage.length > 0 && (
              <>
                <Typography variant='body2'>Current Work Images:</Typography>
                <Stack direction='row' spacing={1} flexWrap='wrap'>
                  {formData.workImage.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Work ${idx}`}
                      style={{ width: 80, height: 80, objectFit: 'cover' }}
                    />
                  ))}
                </Stack>
              </>
            )}

            <Typography variant='subtitle2'>Upload Profile Image</Typography>
            <input
              type='file'
              accept='image/*'
              onChange={e => setFormData({ ...formData, profileFile: e.target.files[0] })}
            />

            <Typography variant='subtitle2'>Upload Work Images (Multiple)</Typography>
            <input
              multiple
              type='file'
              accept='image/*'
              onChange={e => setFormData({ ...formData, workFiles: Array.from(e.target.files) })}
            />

            <Button variant='contained' color='primary' onClick={handleSave}>
              Save
            </Button>
            <Button variant='outlined' onClick={handleClose}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}
