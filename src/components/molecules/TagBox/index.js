import React from 'react'
import styled from 'styled-components'
import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon';

const Tag = styled.div`
  float:left;
  border:1px solid #e2e2e2;
  color:#8F8F8F;
  text-align:center;
  padding:10px 15px 10px 15px;
  font-size:16px;

  &:hover{
    color:${props=>props.theme.accentColor}
    cursor:pointer;
  }
  @media (max-width:480px){
    font-size:13px;
    padding:6px 10px 8px 10px;
  }
`

const TagBox = ({children,style}) => {
  let stl = style 
  return(
    <Tag style={{...stl}}>{children}</Tag>
  )
}

export default TagBox