'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Image from 'next/image'
import builtflogo from '../../src/builtflogo.png'
// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@/Components/Link'
import Logo from '@/Components/layout/shared/Logo'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import useUserApi from '@/api/useUserApi'
import { toast } from 'react-toastify'
import { Card, CircularProgress } from '@mui/material'
const Register = ({ mode }) => {
  // States
  const [loading, setLoading] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { registerUser } = useUserApi()
  // Vars
  const darkImg = '/images/pages/auth-v2-mask-1-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-1-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleRegister = async () => {
    setLoading(true)
    if (email && password && confirmPassword && password === confirmPassword) {
      try {
        await registerUser(email, password)
        toast.success('Registration successful!')
        router.push('/user/profile') // ⬅ Redirect here
      } catch (error) {
        toast.error('Registration failed!')
      } finally {
        setLoading(false)
      }
    } else if (email && password && confirmPassword && password !== confirmPassword) {
      toast.error('Passwords do not match!')
    }
  }

  return (
    <div className='flex bs-full justify-center bg-white'>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href='/landingpage'
          className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'
        >
          <Image src={builtflogo} alt='Logo' width={150} height={55} />
        </Link>
        <Card className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0 px-5 py-10'>
          <div>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography className='mbs-1'>Create your account</Typography>
          </div>
          <form
            noValidate
            autoComplete='off'
            onSubmit={e => {
              e.preventDefault()
              router.push('/')
            }}
            className='flex flex-col gap-5'
          >
            <TextField
              disabled={loading}
              autoFocus
              fullWidth
              label='Email'
              onChange={e => setEmail(e.target.value)}
              value={email}
              sx={{
                '& label': {
                  color: 'grey.700' // Default label color
                },
                '& label.Mui-focused': {
                  color: 'black' // Focused label color
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'black'
                  }
                }
              }}
            />
            <TextField
              sx={{
                '& label': {
                  color: 'grey.700' // Default label color
                },
                '& label.Mui-focused': {
                  color: 'black' // Focused label color
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'black'
                  }
                }
              }}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              value={password}
              fullWidth
              label='Password'
              type={isPasswordShown ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      size='small'
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              sx={{
                '& label': {
                  color: 'grey.700' // Default label color
                },
                '& label.Mui-focused': {
                  color: 'black' // Focused label color
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'black'
                  }
                }
              }}
              disabled={loading}
              fullWidth
              onChange={e => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              label='Confirm Password'
              type={isPasswordShown ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      size='small'
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {loading ? (
              <div className='flex justify-center'>
                <CircularProgress />
              </div>
            ) : (
              <Button
                disabled={loading}
                fullWidth
                variant='contained'
                type='submit'
                onClick={handleRegister}
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'grey.700' // or use a custom grey value like '#555'
                  }
                }}
              >
                Register
              </Button>
            )}
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Link href='/login' color='primary'>
                Sign in to your account?
              </Link>
            </div>
            <Divider className='gap-3 text-textPrimary'>or</Divider>
            <div className='flex justify-center items-center gap-2'>
              <IconButton size='small' className='text-facebook'>
                <i className='ri-facebook-fill' />
              </IconButton>
              <IconButton size='small' className='text-twitter'>
                <i className='ri-twitter-fill' />
              </IconButton>
              <IconButton size='small' className='text-textPrimary'>
                <i className='ri-github-fill' />
              </IconButton>
              <IconButton size='small' className='text-googlePlus'>
                <i className='ri-google-fill' />
              </IconButton>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Register
