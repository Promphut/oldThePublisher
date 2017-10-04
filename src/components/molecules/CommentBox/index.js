import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components'
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar'
import {CommentInput,CommentUser} from 'components'

const Container = styled.div`
  width:100%;
  margin:50px 0 30px 0;
` 

const CommentBox = ({style, className}) => {
  return(
      <Container style={{...style}} className={className}>
        <CommentInput/>
      </Container>
    )
}

export default CommentBox;