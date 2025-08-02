import React, { useEffect, useState } from 'react'
import { useFirestore } from '@/api/useFirestore'
// Assuming you have Material UI components installed and configured
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert
} from '@mui/material'

function AdminUserManagement() {
  // Use the useFirestore hook to fetch ALL documents from the 'users' collection
  const {
    data: users, // 'data' is renamed to 'users' for clarity
    loading,
    error,
    fetchData, // Function to trigger data re-fetch
    updateData, // Function to update a document in 'users' collection
    deleteData // Function to delete a document from 'users' collection
  } = useFirestore('users') // Specify the 'users' collection path

  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [currentUserBeingEdited, setCurrentUserBeingEdited] = useState(null) // The user object currently being edited
  const [editFormData, setEditFormData] = useState({
    email: '',
    role: '',
    name: '',
    contact: '',
    address: '',
    city: '',
    state: '',
    pin: ''
  })
  const [updateError, setUpdateError] = useState('')
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null) // The user object being considered for deletion

  // Fetch users when the component mounts or `fetchData` function changes (though it's stable)
  useEffect(() => {
    fetchData()
  }, [fetchData]) // Dependency array includes fetchData to prevent infinite loops if it were to change

  const handleEditClick = user => {
    setCurrentUserBeingEdited(user)
    setEditFormData({
      email: user.email || '',
      role: user.role || 'user',
      name: user.name || '',
      contact: user.contact || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      pin: user.pin || ''
    })
    setUpdateError('') // Clear any previous errors
    setOpenEditDialog(true)
  }

  const handleEditDialogClose = () => {
    setOpenEditDialog(false)
    setCurrentUserBeingEdited(null) // Clear the currently edited user
  }

  const handleFormChange = e => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateSubmit = async () => {
    setUpdateError('')
    if (!currentUserBeingEdited) return

    try {
      // Prepare data to send to Firestore, excluding empty strings or unchanged email (if disabled)
      const dataToUpdate = {}
      for (const key in editFormData) {
        // Only include fields that have a value or are the 'role' which is always selected
        if (editFormData[key] !== '' || key === 'role') {
          dataToUpdate[key] = editFormData[key]
        }
      }

      // Call updateData from useFirestore, passing the document ID (user.id) and the updated fields
      await updateData(currentUserBeingEdited.id, dataToUpdate)
      handleEditDialogClose() // Close dialog on success
      // fetchData is called by useFirestore's updateData, so table will auto-refresh
    } catch (err) {
      console.error('Error updating user:', err)
      setUpdateError('Failed to update user: ' + err.message)
    }
  }

  const handleDeleteClick = user => {
    setUserToDelete(user)
    setDeleteConfirmationOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return
    try {
      // Call deleteData from useFirestore, passing the document ID
      await deleteData(userToDelete.id)
      setDeleteConfirmationOpen(false) // Close confirmation dialog
      setUserToDelete(null) // Clear user to delete
      // fetchData is called by useFirestore's deleteData, so table will auto-refresh
    } catch (err) {
      console.error('Error deleting user:', err)
      setUpdateError('Failed to delete user: ' + err.message) // This error will appear in the edit dialog, or you might add a separate global alert
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false)
    setUserToDelete(null)
  }

  // --- UI Rendering ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress />
        <Typography variant='h6' sx={{ ml: 2 }}>
          Loading users...
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
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Manage Enrolled Users
      </Typography>

      {users.length === 0 ? (
        <Alert severity='info'>No users found in the database.</Alert>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label='user management table'>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created At</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  {' '}
                  {/* user.id is the Firestore document ID (which is also the UID) */}
                  <TableCell>{user.email}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
                  <TableCell>{user.name || 'N/A'}</TableCell>
                  <TableCell>{user.contact || 'N/A'}</TableCell>
                  <TableCell>
                    {user.address && user.city ? `${user.address}, ${user.city}, ${user.state}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt.toDate ? user.createdAt.toDate() : user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='outlined'
                      color='primary'
                      size='small'
                      sx={{ mr: 1 }}
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </Button>
                    <Button variant='outlined' color='error' size='small' onClick={() => handleDeleteClick(user)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit User: {currentUserBeingEdited?.email}</DialogTitle>
        <DialogContent dividers>
          {updateError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {updateError}
            </Alert>
          )}
          <Box component='form' sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
            {/* Email is disabled because direct Firestore doc update doesn't change Firebase Auth email */}
            <TextField label='Email' name='email' value={editFormData.email} fullWidth margin='dense' disabled />
            <TextField
              label='Role'
              name='role'
              value={editFormData.role}
              onChange={handleFormChange}
              fullWidth
              select // Makes it a select dropdown
              margin='dense'
            >
              <MenuItem value='user'>User</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
            </TextField>
            <TextField
              label='Name'
              name='name'
              value={editFormData.name}
              onChange={handleFormChange}
              fullWidth
              margin='dense'
            />
            <TextField
              label='Contact'
              name='contact'
              value={editFormData.contact}
              onChange={handleFormChange}
              fullWidth
              margin='dense'
            />
            <TextField
              label='Address'
              name='address'
              value={editFormData.address}
              onChange={handleFormChange}
              fullWidth
              margin='dense'
            />
            <TextField
              label='City'
              name='city'
              value={editFormData.city}
              onChange={handleFormChange}
              fullWidth
              margin='dense'
            />
            <TextField
              label='State'
              name='state'
              value={editFormData.state}
              onChange={handleFormChange}
              fullWidth
              margin='dense'
            />
            <TextField
              label='PIN'
              name='pin'
              value={editFormData.pin}
              onChange={handleFormChange}
              fullWidth
              margin='dense'
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleUpdateSubmit} color='primary' variant='contained'>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmationOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user "{userToDelete?.email}"? This action will remove their profile data
            from Firestore. **Note: This will NOT delete their Firebase Authentication account. For full deletion, you'd
            need Firebase Admin SDK (backend).**
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminUserManagement
