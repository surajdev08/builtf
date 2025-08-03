// src/views/providers/EditProvider.jsx
'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFirestore } from '@/api/useFirestore'
import { useFirestoreDoc } from '@/api/useFirestoreDoc'
import axios from 'axios'

// This function can be moved to a separate utility file
async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'unsigned_images')
  formData.append('cloud_name', 'dsc4al7yr')
  const response = await axios.post('https://api.cloudinary.com/v1_1/dsc4al7yr/image/upload', formData)
  return response.data.secure_url
}

const EditProviderPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('serviceId')
  const providerId = searchParams.get('providerId')
  const isEditMode = Boolean(providerId)

  const [formData, setFormData] = useState({
    Name: '',
    contact: '',
    Type: '',
    Location: '',
    address: '',
    pincode: '',
    Price: '',
    priceUnit: '/hour',
    description: '',
    rating: '5'
  })

  const [profileFile, setProfileFile] = useState(null)
  const [workFiles, setWorkFiles] = useState([])
  const [profilePreview, setProfilePreview] = useState('')
  const [workPreviews, setWorkPreviews] = useState([])
  const [isFormInitialized, setIsFormInitialized] = useState(false) // New state to control initialization

  const formPath = `services/${serviceId}/providers`
  const { addData, updateData, loading: isSubmitting, error: submissionError } = useFirestore(formPath)
  const { data: existingProvider, loading: isLoadingProvider } = useFirestoreDoc(
    isEditMode ? `${formPath}/${providerId}` : null
  )

  // This useEffect now runs only ONCE when data is ready
  useEffect(() => {
    if (isEditMode && existingProvider && !isFormInitialized) {
      setFormData({
        Name: existingProvider.Name || '',
        contact: existingProvider.contact || '',
        Type: existingProvider.Type || '',
        Location: existingProvider.Location || '',
        address: existingProvider.address || '',
        pincode: existingProvider.pincode || '',
        Price: existingProvider.Price || '',
        priceUnit: existingProvider.priceUnit || '/hour',
        description: existingProvider.description || '',
        rating: existingProvider.rating || '5'
      })
      setProfilePreview(existingProvider.profileimg || '')
      setWorkPreviews(existingProvider.workImage || [])
      setIsFormInitialized(true) // Mark form as initialized to prevent re-runs
    }
  }, [existingProvider, isEditMode, isFormInitialized])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleProfileFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setProfileFile(file)
      setProfilePreview(URL.createObjectURL(file))
    }
  }

  const handleWorkFilesChange = e => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setWorkFiles(files)
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setWorkPreviews(isEditMode ? [...workPreviews, ...newPreviews] : newPreviews)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const dataToSave = { ...formData }

    try {
      if (profileFile) {
        dataToSave.profileimg = await uploadToCloudinary(profileFile)
      }
      if (workFiles.length > 0) {
        const workUrls = await Promise.all(workFiles.map(uploadToCloudinary))
        dataToSave.workImage = isEditMode ? [...(existingProvider.workImage || []), ...workUrls] : workUrls
      }
      if (isEditMode) {
        await updateData(providerId, dataToSave)
      } else {
        await addData(dataToSave)
      }
      router.push(`/providers/list?serviceId=${serviceId}`)
    } catch (uploadError) {
      console.error('Operation failed:', uploadError)
    }
  }

  // More intelligent loading state check
  if (isEditMode && (isLoadingProvider || !isFormInitialized)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth='lg' sx={{ my: 4 }}>
      <Typography variant='h4' gutterBottom>
        {isEditMode ? `Edit ${formData.Name || 'Provider'}` : 'Add New Provider'}
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* ... The rest of your form's JSX remains the same ... */}
        {/* Card 1: Basic Info */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title='Basic Info' />
              <CardContent component={Stack} spacing={2}>
                <TextField label='Full Name' name='Name' value={formData.Name} onChange={handleChange} required />
                <TextField
                  label='Contact Number'
                  name='contact'
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label='Type (e.g., Plumber)'
                  name='Type'
                  value={formData.Type}
                  onChange={handleChange}
                  required
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: Address & Pricing */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title='Address & Pricing' />
              <CardContent component={Stack} spacing={2}>
                <TextField label='City' name='Location' value={formData.Location} onChange={handleChange} required />
                <TextField
                  label='Full Address'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
                <TextField label='Pin Code' name='pincode' value={formData.pincode} onChange={handleChange} required />
                <Box display='flex' gap={2}>
                  <TextField
                    label='Price'
                    name='Price'
                    type='number'
                    value={formData.Price}
                    onChange={handleChange}
                    required
                    sx={{ flexGrow: 1 }}
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select name='priceUnit' value={formData.priceUnit} label='Unit' onChange={handleChange}>
                      <MenuItem value='/hour'>/hour</MenuItem>
                      <MenuItem value='/day'>/day</MenuItem>
                      <MenuItem value='/sqft'>/sqft</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 3: Images */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Images' />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1' gutterBottom>
                      Profile Image
                    </Typography>
                    {profilePreview && (
                      <Box
                        component='img'
                        src={profilePreview}
                        sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 1, mb: 1 }}
                      />
                    )}
                    <Button variant='outlined' component='label'>
                      Upload Profile Image
                      <input type='file' hidden accept='image/*' onChange={handleProfileFileChange} />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1' gutterBottom>
                      Work Images
                    </Typography>
                    <Stack direction='row' spacing={1} flexWrap='wrap' mb={1} useFlexGap>
                      {workPreviews.map((src, idx) => (
                        <Box
                          key={idx}
                          component='img'
                          src={src}
                          sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                        />
                      ))}
                    </Stack>
                    <Button variant='outlined' component='label'>
                      Upload Work Images
                      <input type='file' hidden multiple accept='image/*' onChange={handleWorkFilesChange} />
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 4: Description */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Description & Rating' />
              <CardContent component={Stack} spacing={2}>
                <TextField
                  label='About the Provider'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={5}
                  fullWidth
                  required
                />
                <TextField
                  label='Default Rating'
                  name='rating'
                  type='number'
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  sx={{ maxWidth: 200 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} mt={2}>
            <Button type='submit' variant='contained' size='large' disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : isEditMode ? 'Save Changes' : 'Create Provider'}
            </Button>
            {submissionError && (
              <Alert severity='error' sx={{ mt: 2 }}>
                {submissionError}
              </Alert>
            )}
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default EditProviderPage
