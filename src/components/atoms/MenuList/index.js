import React from 'react'
import styled from 'styled-components'

const List = styled.div`
  min-height:60px;
	display:inline;
  padding:0px  !important;
  margin:0px !important;
  background:${props=> props.theme.primaryColor}; 
`
const Anim = styled.button`
  position:relative;
  font-size:18px;
  color:white;
  
  text-align:center;
  height:100%;
  margin:0px;
  border:none;
  background:none;
  padding:8px 15px 10px 15px; 
  &:hover{
		background:rgba(10,10,10,0.1);
		text-decoration:underline;
		cursor:pointer;
	}
  &:focus{
    outline: none !important;
    outline: none !important;
  }
`

const MenuList = ({onClick,style,className,children,type,id})=>{
  return(
    <List  style={{...style}} className={className} >
      <Anim onClick={onClick} id={id} type={type} >
        {children}
      </Anim>
    </List>
  )
}

export default MenuList