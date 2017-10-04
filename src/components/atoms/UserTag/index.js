import React from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

const Tag = styled(Link)`
  color:${props=> props.theme.primaryColor};
  font-weight:bold;
  font-style: italic;
  font-size:19px;
  &:hover{
    cursor:pointer;
    color:${props=> props.theme.primaryColor};
    opacity:0.5;
  }
  @media(max-width:480px){
    font-size:14px;
  }
`

const UserTag = (props)=>{
  return(
    <Tag  style={{...props.style}} className={props.className}/>
  )
}

export default UserTag