import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'
import moment from 'moment'
import utils from '../../../services/utils'

const Container = styled.div`
  display:flex;
  width:100%;
  padding:8px;
  margin:0 0 30px 0;
  @media (max-width:480px){
    margin:0 0 10px 0;
  }
`

const Contain = styled.div`
  color:#8F8F8F;
  font-size:17px;
  float:left;
  margin:5px 10px 10px 14px;
  @media (max-width:480px){
    margin:0;
    font-size:14px;
  }
`
const Left = styled.div`
  flex:2;
`
const Right = styled.div`
  flex:1;
  display:flex;
  justify-content:flex-end;
`
const Text = styled.span`
  color:#8F8F8F;
  font-size:17px;
  margin-top:5px;
  @media (max-width:480px){
    font-size:14px;
  }
`

const Span1 = styled.span`
  color:#222;
  font-weight:bold;
  font-size:19px;
  margin:0 5px 0 5px;
`
const Div1 = styled.div`
  @media (max-width:480px){
    margin-top:10px;
  }
`

const WritedAndDate = ({style, writer, column, published,readTime}) => {
  //let {name,date,column,url} = detail
  //console.log('WritedBy', writer, published)
  //writer = writer || { pic: {} }
  return (
    <Container style={{...style}}>
      <Left>
        {!utils.isMobile()&&<div>
          <a href={writer.url || '#'}><Avatar src={writer.pic && writer.pic.medium} size={54} className='imgWidth' style={{float:'left'}}/></a>
        </div>}
        <Contain className="sans-font">
          by <Span1><a href={writer.url || '#'} style={{color:'#222'}}>{writer.display}</a></Span1>,
          {utils.isMobile()?<span><br/>{moment(published).format('lll')}</span>:<span>{moment(published).format('lll')}</span>}
          <br/>
          writer of <Link to={column.url}><strong>{column.name}</strong></Link>
          {/*{writer.intro}*/}
        </Contain>
      </Left>
      <Right>
        <Text className="sans-font">{readTime} min read</Text>
      </Right>
    </Container>
  )
}

WritedAndDate.propTypes = {
  writer: PropTypes.object.isRequired,
  column: PropTypes.object,
  published: PropTypes.string
}


export default WritedAndDate
