import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'
import moment from 'moment'

const Container = styled.div`
  display:flex;
  width:100%;
  padding:8px;
  @media (max-width:480px){
    width:280px;
    padding:0px;
  }
`

const Contain = styled.div`
  color:#8F8F8F;
  font-size:17px;
  float:left;
  margin:3px 10px 10px 14px;
  .imgWidth{
    width:49px;
    height:49px;
  }
  @media (max-width:480px){
    font-size:14px;
    .imgWidth{
      width:36px;
      height:36px;
    }
  }
`

const Span1 = styled.span`
  color:#222;
  font-weight:bold;
  font-size:19px;
  margin:0 5px 0 5px;
`

const WritedBy = ({style, writer, /*column,*/ published}) => {
  //let {name,date,column,url} = detail
  //console.log('WritedBy', writer, published)
  //writer = writer || { pic: {} }
  //console.log(writer)
  return (
    <Container style={{...style}}>

      <div>
        <a href={writer.url || '#'}><Avatar src={writer.pic && writer.pic.medium} size={54} className='imgWidth' style={{float:'left',marginTop:'8px'}}/></a>
      </div>

      <Contain className="content-font">
        by <Span1><a href={writer.url || '#'} style={{color:'#222'}}>{writer.display}</a></Span1>
        {/*{moment(published).format('lll')} */}
        <br/>
        {/*writer of <Link to={column.url}><strong>{column.name}</strong></Link>*/}
        {writer.intro}
    
      </Contain>

    </Container>
  )
}

WritedBy.propTypes = {
  writer: PropTypes.object.isRequired,
  column: PropTypes.object,
  published: PropTypes.string
}


export default WritedBy
