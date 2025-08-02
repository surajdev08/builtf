import React from 'react'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import PropTypes from 'prop-types'
import { AppBar } from '@mui/material'

function ElevationScroll({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  })

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  })
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired
}

export default ElevationScroll
