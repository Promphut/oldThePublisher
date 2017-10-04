import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  width:40px;
  display:flex;
`

const Dot = styled.div`
  width:8px;
  height:8px;
  border-radius:50%;
  background-color:#8F8F8F;
`

const More = ({style})=>{
  return(
    <Box style={{...style}}>
      <div style={{flex:1}}><Dot/></div>
      <div style={{flex:1}}><Dot/></div>
      <div style={{flex:1}}><Dot/></div>
    </Box>
  )
}

export default More
