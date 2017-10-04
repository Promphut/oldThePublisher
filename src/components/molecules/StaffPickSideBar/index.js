import React from 'react'
import PropTypes from 'prop-types'
import {BGImg,Stick} from 'components'
import styled,{keyframes} from 'styled-components'
import {Link} from 'react-router-dom'
import api from '../../../services/api' 
import moment from 'moment'
import truncate from 'lodash/truncate'

const Container = styled.div`
  width:100%;
`
const Dash = styled.div`
  margin:5px 0 0 0;
  width:30px;
  height:4px;
  background-color:${props=>props.theme.accentColor};
`
const TextLine = styled.div`
  color:${props=>props.theme.primaryColor};
  font-size:28px;
  font-weight:bold;
`
const Box = styled(BGImg)`
  width:200px;
  height:200px;
  display:flex;
  align-items:center;
  justify-content:center;
  &:hover{
    cursor:pointer;
    & a{
      visibility:visible;
      color:white;
    }
  }
`
const Grad = styled(Link)`
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  width:100%;
  height:100%;
  padding:20px;
  text-align:center;
  color:white;
  font-size:14px;
  background:rgba(0,0,0,0.7);
  visibility:hidden;
`

class StaffPickSideBar extends React.Component {
  static contextTypes = {
    setting: PropTypes.object
  }

  state = {
    hover:false,
    news:[],
  }

  getFeed = () => {
    // - Fetching latestStories
    api.getFeed('news', {status:1}, 'latest', null, 0, 10)
    .then(result => {
      if(result) {
        this.setState({
          news:result.feed
        })
      }
    })
  }
  hover = () => {
    this.setState({hover:true})
  }
  leave = () => {
    this.setState({hover:false})
  }

  componentDidMount(){
    this.getFeed()
  }

  render(){
    var {theme} = this.context.setting.publisher
    var {style,swift,className,large} = this.props
    var {hover,news} = this.state
    //console.log(news)
    return (
      <Stick topOffset={60} style={{zIndex:'0'}}>
        <Container >
          <TextLine className='sans-font'>OUR PICKS</TextLine>
          <Dash style={{margin:'5px 0 10px 0'}}></Dash>
          <div style={{padding:'25px 0 0 25px'}}>
            <Box  src='/tmp/story-list/1485309433041-Screen-Shot-2017-01-23-at-33221-PM-1.png'>
              <Grad to='#' className='grad nunito-font'>{truncate(`“เน็ตมือถือไม่พอใช้” ปัญหาใหญ่ของผู้ใช้สมาร์ท
  โฟนชาวไทยในยุคนี้ สมาร์ทโฟนชาวไทยในยุคนี้...`, {
                'length': 150,
                'separator': ''
              })}</Grad>
            </Box>
            <Box src='/tmp/story-list/1485309433041-Screen-Shot-2017-01-23-at-33221-PM-1.png'>
              <Grad to='#' className='grad nunito-font'>{truncate(`“เน็ตมือถือไม่พอใช้” ปัญหาใหญ่ของผู้ใช้สมาร์ท
  โฟนชาวไทยในยุคนี้ สมาร์ทโฟนชาวไทยในยุคนี้...`, {
                'length': 150,
                'separator': ''
              })}</Grad>
            </Box>
            <Box src='/tmp/story-list/1485309433041-Screen-Shot-2017-01-23-at-33221-PM-1.png'>
              <Grad to='#' className='grad nunito-font'>{truncate(`“เน็ตมือถือไม่พอใช้” ปัญหาใหญ่ของผู้ใช้สมาร์ท
  โฟนชาวไทยในยุคนี้ สมาร์ทโฟนชาวไทยในยุคนี้...`, {
                'length': 150,
                'separator': ''
              })}</Grad>
            </Box>
          </div>
        </Container>
      </Stick> 
    )
  }
}

export default StaffPickSideBar;
