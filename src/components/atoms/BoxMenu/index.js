import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  height:60px;
  min-width:60px;
	display:flex;
  padding:0 !important;
`

const BoxMenu = ({style,className,children}) => {
  return (
    <Box style={{...style}} className={className}>
      {children}
    </Box>
  )
}

export default BoxMenu