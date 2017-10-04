import React from 'react'
import styled from 'styled-components'
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon'

const CloseButton = ({style,onClick})=>{
  return(
    <IconButton style={{...style}} iconStyle={{color:'#E2E2E2'}} onClick={onClick}>
      <FontIcon className="material-icons" >close</FontIcon>
    </IconButton>
  )
}

export default CloseButton