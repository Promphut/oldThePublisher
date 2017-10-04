import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components'
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar'

const Container = styled.div`
  overflow: auto;
	width: 100%;
  @media (min-width:481px) {
    .menu-font {
      font-family: 'Nunito', 'Mitr';
      font-weight: bold;
    }
    .title-font {
      font-family: 'PT Serif', 'Mitr';
    }
    .content-font {
      font-family: 'PT Sans', 'cs_prajad', sans-serif;
    }
  }
  /* FOR MOBILE */
  @media (max-width:480px) {
    .menu-font {
      font-family: 'Nunito', 'Mitr';
      font-weight: bold;
    }
    .title-font {
      font-family: 'Roboto Slab', 'Mitr';
    }
    .content-font {
      font-family: 'Roboto', 'cs_prajad', sans-serif;
    }
  }
  
` 

const TextInput = styled.textarea`
  width:534px;
  height:82px;
  margin-left:15px;
  float:left;
  border: 1px solid #C1C1C1;
`

const Btn = styled.button`
  border-radius:20px;
  width:95px;
  height:40px;
  background-color:${props=> props.theme.primaryColor};
  color:#fff;
  float:left;
  margin-left:20px;
  &:hover{
    cursor:pointer;
  }
`

let styles = {
  button:{
    borderRadius:'20px',
    marginLeft:'15px'
  },
  btnStyle:{
    borderRadius:'20px',
  },
}

const CommentInput = ({}) => {
  return(
    <Container>
      <a href="#"><Avatar src='/tmp/avatar.png' size={49} style={{float:'left'}}/></a>
      <TextInput placeholder='Your comment here...'/>
      <RaisedButton 
        label="Send" 
        target="_blank"
        labelColor="#fff"
        style={styles.button}
        buttonStyle={styles.btnStyle}
        backgroundColor="#00B2B4"/>
    </Container>
  )
}

export default CommentInput;