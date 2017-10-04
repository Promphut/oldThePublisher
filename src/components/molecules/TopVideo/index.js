import React from 'react'
import PropTypes from 'prop-types'
import {BGImg} from 'components'
import styled,{keyframes} from 'styled-components'
import {Link} from 'react-router-dom'
import FontIcon from 'material-ui/FontIcon';

const LargeBox =styled(Link)`
  display:flex;
	flex:${props=>props.large?3:2};
	height:222px;
`
const MiniBox = styled(BGImg)`
  flex:${props=>props.large?2:1};
	height:222px;
  z-index:0;
`
const Box1 = styled.div`
  flex:${props=>props.large?2:1};
	height:222px;
  overflow: hidden;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
`
const MiniBoxDark = styled.div`
	flex:1;
	height:222px;
	background-color:${props=>props.theme.primaryColor};
`
const MiniBoxLight = styled.div`
	flex:1;
	height:222px;
	background-color:white;
`
const ArrowLeft = styled.div`
	position:relative;
	left:-15px;
	top:96px;
	width:0;
	height:0;
	z-index:10; 
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left:15px solid ${props=>props.theme.primaryColor};
`
const ArrowRight = styled.div`
	position:relative;
	left:-15px;
	top:96px;
	width:0;
	height:0;
	z-index:10; 
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right:15px solid ${props=>props.theme.primaryColor};
`
const NewsBox = styled.div`
	flex:2;
	height:444px;
`
const SName = styled(Link)`
	font-size:18px;
  transition: all 0.3s;
  color:${props=>props.hover?props.theme.accentColor:'white'};
  &:hover{
    color:${props=>props.theme.accentColor};
  }
`
const HName = styled.div`
	text-transform: uppercase;
	color:#C4C4C4;
	font-size:14px;
	font-weight:bold;
  margin-bottom:8px;
`
const Gra = styled.div`
  flex:2;
  height:222px;
  background:${props=> props.hover?'rgba(0,0,0,0.7)':'rgba(0,0,0,0.5)'};
  display:flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s;
`
const IC = styled.div`
  opacity:0;
  animation: ${props=> props.hover?fadeIn:fadeOut} 0.4s forwards;
`
const fadeIn = keyframes`
  from {
    opacity:0;
  }
  to {
    opacity:1;
  }
`
const fadeOut = keyframes`
  from {
    opacity:1;
  }
  to {
    opacity:0;
  }
`

class TopVideo extends React.Component {
  static contextTypes = {
    setting: PropTypes.object
  }

  state = {
    hover:false
  }

  hover = () => {
    this.setState({hover:true})
  }
  leave = () => {
    this.setState({hover:false})
  }

  render(){
    var {style,swift,className,large} = this.props
    var {hover} = this.state

    if(swift){
      return (
        <LargeBox to='#' large={large} style={{...style}} className={' '+className} onMouseOver={this.hover} onMouseLeave={this.leave}>
          <MiniBoxDark>
            <ArrowLeft style={{marginLeft:'100%',left:'0px'}}/>
            <div style={{width:'174px',margin:'0 0 0 20px'}}>
              <HName className='sans-font' style={{}}>TOP VIDEO</HName>
              <SName hover={hover} to={'#'} className='nunito-font' >“เน็ตมือถือไม่พอใช้” ปัญหาใหญ่ของผู้ใช้ สมาร์ทโฟนชาวไทยในยุคนี้</SName>
            </div>
          </MiniBoxDark>
          <MiniBox large={large} hover={hover} src={'/tmp/story-list/1486687443533-Dakota.jpeg'}  opacity={-1}>
              <Gra  hover={hover} >
                <IC  hover={hover} >
                  <FontIcon className="material-icons" style={{color:'white',fontSize:'60px'}}>play_circle_outline</FontIcon>
                </IC>
              </Gra>
          </MiniBox>
        </LargeBox>    
      )
    }else{
      return (
        <LargeBox to='#' large={large} style={{...style}} className={' '+className} onMouseOver={this.hover} onMouseLeave={this.leave}>
          <MiniBox hover={hover} large={large} src={'/tmp/story-list/1486687443533-Dakota.jpeg'}  opacity={-1}>
            <Gra  hover={hover} >
              <IC  hover={hover} >
                <FontIcon className="material-icons" style={{color:'white',fontSize:'60px'}}>play_circle_outline</FontIcon>
              </IC>
            </Gra>
          </MiniBox>
          <MiniBoxDark>
            <ArrowRight />
            <div style={{width:'174px',margin:'0 0 0 20px'}}>
              <HName className='sans-font' style={{}}>TOP VIDEO</HName>
              <SName hover={hover} to={'#'} className='nunito-font' >“เน็ตมือถือไม่พอใช้” ปัญหาใหญ่ของผู้ใช้ สมาร์ทโฟนชาวไทยในยุคนี้</SName>
            </div>
          </MiniBoxDark>
        </LargeBox>    
      )
    }
  }
}

export default TopVideo;
