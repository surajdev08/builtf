'use client'

import React, { useState, useEffect } from 'react'
import { Grid, Card, CardContent, Typography, TextField, Button, Rating, Stack, Box } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFirestore } from '@/api/useFirestore'
import axios from 'axios'

const uploadToCloudinary = async file => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'unsigned_images')
  formData.append('cloud_name', 'dsc4al7yr')

  const response = await axios.post('https://api.cloudinary.com/v1_1/dsc4al7yr/image/upload', formData)
  return response.data.secure_url
}

export default function ProviderFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('serviceId')

  const providerId = searchParams.get('providerId')

  const {
    data: providers,
    fetchData,
    updateData,
    addData
  } = useFirestore(serviceId ? `services/${serviceId}/providers` : null)

  const [formData, setFormData] = useState({
    Name: '',
    contact: '',
    Type: '',
    Location: '',
    Price: '',
    profileimg: '',
    profileFile: null,
    workImage: [],
    workFiles: [],
    Description: '',
    Rating: 0
  })

  useEffect(() => {
    if (providerId && providers.length > 0) {
      const existing = providers.find(p => p.id === providerId)
      if (existing) {
        setFormData({ ...existing, profileFile: null, workFiles: [] })
      }
    }
  }, [providerId, providers])

  useEffect(() => {
    if (serviceId) fetchData()
  }, [serviceId, fetchData])

  const handleSave = async () => {
    const { profileFile, workFiles, ...rest } = formData

    if (profileFile) {
      rest.profileimg = await uploadToCloudinary(profileFile)
    }

    if (workFiles.length > 0) {
      rest.workImage = await Promise.all(workFiles.map(f => uploadToCloudinary(f)))
    }

    if (providerId) {
      await updateData(providerId, rest)
    } else {
      await addData(rest)
    }
    router.push(`/providers?serviceId=${serviceId}`)
  }

  return (
    <Box p={4}>
      <Typography variant='h4' gutterBottom>
        {providerId ? 'Edit Provider' : 'Add Provider'}
      </Typography>

      <Grid container spacing={3}>
        {/* Card 1 - Name & Contact */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Basic Info</Typography>
              <Stack spacing={2} mt={2}>
                <TextField
                  label='Name'
                  value={formData.Name}
                  onChange={e => setFormData({ ...formData, Name: e.target.value })}
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
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 - Location & Price */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Address & Pricing</Typography>
              <Stack spacing={2} mt={2}>
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
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 - Images */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Images</Typography>
              <Stack spacing={2} mt={2}>
                {formData.profileimg && <img src={formData.profileimg} style={{ width: 100 }} alt='Profile' />}
                <input
                  type='file'
                  accept='image/*'
                  onChange={e => setFormData({ ...formData, profileFile: e.target.files[0] })}
                />

                <Typography variant='body2'>Work Images</Typography>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={e => setFormData({ ...formData, workFiles: Array.from(e.target.files) })}
                />
                <Stack direction='row' spacing={1}>
                  {formData.workImage?.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`work-${idx}`}
                      style={{ width: 80, height: 80, objectFit: 'cover' }}
                    />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4 - Description & Rating */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Description & Rating</Typography>
              <Stack spacing={2} mt={2}>
                <TextField
                  label='Description'
                  value={formData.Description}
                  onChange={e => setFormData({ ...formData, Description: e.target.value })}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <Box display='flex' alignItems='center'>
                  <TextField
                    label='Rating'
                    value={formData.Rating}
                    onChange={(e, newVal) => setFormData({ ...formData, Rating: newVal })}
                    fullWidth
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button variant='contained' color='primary' onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
