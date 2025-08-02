import { useRouter } from 'next/navigation'

import { Grid, Typography, IconButton, Card, CardContent, Divider, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const FilterHeader = ({ link, title, subtitle, children }) => {
  const router = useRouter()
  const theme = useTheme()

  return (
    <Grid
      container
      item
      xs={12}
      pr={5}
      display='flex'
      justifyContent='space-between'
      spacing={4}
      sx={{
        position: 'sticky', // Makes the grid fixed
        top: 0, // Adjusts position from the top
        left: 50, // Adjusts position from the left
        // bottom:80,
        width: '100vw', // Full width of the viewport
        height: 'auto', // Height can be set as per your needs
        zIndex: 1200, // Ensure it stays above other elements
        backgroundColor: theme.palette.customColors.bodyBg,

        // '#282a42'
        borderBottom: '1px solid #b9b9b9',
        marginBottom: 10

        // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' // Adds shadow for better visibility
      }}

      // position='fixed'
      // zIndex='9999'
    >
      <Grid item xs={children?.length === 3 ? 6 : 8} display='flex' alignItems='flex-start' pb={3}>
        <IconButton onClick={() => router.push(link)}>
          <i class='ri-arrow-left-line'></i>
        </IconButton>
        <Box display='flex' flexDirection='column' alignItems='flex-start'>
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: 18
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 15
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Grid>
      {children}
    </Grid>
  )
}

export default FilterHeader
