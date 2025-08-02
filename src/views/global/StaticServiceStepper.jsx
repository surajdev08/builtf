'use client'

import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material'

const steps = [
  'Select Service',
  'Describe Requirement',
  'Get Matched with Pros',
  'Confirm & Track',
  'Complete & Review'
]

const StaticServiceStepper = () => {
  return (
    <Box sx={{ width: '100%', p: 4 }}>
      <Typography variant='h3' align='center' gutterBottom>
        How BuiltF Works
      </Typography>
      <Typography variant='subtitle1' align='center' sx={{ mb: 4 }}>
        From booking to service completion, here's how we make your experience seamless:
      </Typography>

      <Stepper activeStep={-1} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

export default StaticServiceStepper
