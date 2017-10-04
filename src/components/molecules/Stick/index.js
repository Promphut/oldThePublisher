import React from 'react';
import styled from 'styled-components'
import {findDOMNode as dom} from 'react-dom'

const Container = styled.div`
  width: ${props=> props.special ? '100%': 'auto'};
  height: ${props=> props.special ? '60px' : 'auto'};
  z-index:100;
  position: ${props=> props.special ? '-webkit-fixed' : '-webkit-sticky'};
  position: ${props=> props.special ? 'fixed' : 'sticky'};
  top: ${props=> props.topOffset && !props.special ? props.topOffset:0}px;
  bottom: ${props=> props.bottomOffset?props.bottomOffset:0}px;
  margin-bottom: ${props => props.marginBottom ? props.marginBottom : 0}px;  
`

const Stick = (props) => {
  return (
    <Container
      topOffset={props.fixed ? -100 : props.topOffset}
      bottomOffset={props.bottomOffset}
      style={{...props.style}}
      className={props.className}
      marginBottom={props.marginBottom}
      special={props.special}
    >
      {props.children}
    </Container>
  )
}

export default Stick;
