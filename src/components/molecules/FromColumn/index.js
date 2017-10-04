import React from 'react'
import styled from 'styled-components'
import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'
import moment from 'moment'
import truncate from 'lodash/truncate'
import config from '../../../config'

const Container = styled.div`
  width:100%;
  padding:8px;
`
const Contain = styled.div`
  color:#8F8F8F;
  font-size:17px;
  @media (max-width:480px){
    width:280px;
    font-size:14px;
  }
`
const Div = styled.div`
  display:inline-block;
  border-radius:30px;
  padding:5px 20px;
  margin-bottom:5px;
  background: linear-gradient(135deg,  ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
`
const Span1 = styled(Link)`
  color:white;
  display:inline-block;
  font-weight:bold;
  font-size:16px;
  position:relative;
  top:-3px;
  &:hover{
    color:${props=>props.theme.accentColor};
  }
`
const Icon = styled.img`
	width:18px;
	height:18px;
	display:inline;
  margin:5px 10px 0 0;
	@media (max-width:480px) {
    
  }
`
const FromColumn = ({style, column}) => {
  //console.log('WritedBy',column)
  if(!column) {
    return (
      <Container></Container>
    )
  }

  return (
    <Container style={{...style}}>
      <Div>
        {column.icon!=config.BACKURL + '/imgs/brand_display.png'&&<Icon src={column.icon}  />}
        <Span1 to={column.url||'/'} className='sans-font'>
          {column.name}
        </Span1>
      </Div>
      <Contain className="content-font">
        {truncate(column.shortDesc, {'length': 95,'separator': ''})}
      </Contain>
    </Container>
  )
}
 

export default FromColumn