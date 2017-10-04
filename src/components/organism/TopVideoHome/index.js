import React from 'react'
import PropTypes from 'prop-types'
import {BGImg} from 'components'
import styled, {keyframes} from 'styled-components'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import FontIcon from 'material-ui/FontIcon';
import truncate from 'lodash/truncate'
// import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'
// import 'slick-carousel/slick/ajax-loader.gif'

const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	padding: 80px 0 0 0;
	@media (max-width:480px) {
		padding: 70px 0 0 0;
  }
  .arrow{
    position:relative;
    color:#C4C4C4;
    font-size:50px;
    top:-35px;
    &:hover{
      color:${props=>props.theme.accentColor};
    }
  }
`
const Feed = styled.div`
	flex: 12 1120px;
	max-width: 1120px;
	@media (max-width:480px) {
    flex: 0 100%;
		max-width: 100%;
		padding:0 15px 0 15px;
  }
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
const MiniBox = styled(BGImg)`
  width:310px;
	height:175px;
  margin:0 auto 0 auto;
`
const Gra = styled.div`
  position:relative;
  width:310px;
	height:175px;
  background:rgba(0,0,0,0.5);
  display:flex;
  flex-direction:column;
  transition: all 0.4s;
  &:hover{
    background:rgba(0,0,0,0.7);
    cursor:pointer;
    > div{
      color:${props=>props.theme.accentColor};
    }
  }
`

const Test = styled.div`

`
const Text = styled.div`
  font-size:18px;
  color:white;
  padding:10px;
  margin-top:auto;
`

class TopVideoHome extends React.Component {
  contextTypes = {
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
    var settings = {
      centerMode: false,
      slidesToShow: 3,
      speed: 300,
      draggable: false,
      infinite: false,
      slickGoTo:3,
      slidesToScroll: 3,
      prevArrow:<button type="button"><i style={{left:'-15px'}} className="material-icons arrow">keyboard_arrow_left</i></button>,
      nextArrow:<button type="button"><i style={{left:'-15px'}} className="material-icons arrow">keyboard_arrow_right</i></button>,
      dots: true,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            initialSlide:1,
            slickGoTo:1,
            arrows: false,
            centerMode: true,
            draggable: true,
            centerPadding: '10px',
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
      ]
    };
    var vdo = [] 
    for(var i=0;i<9;i++){
      vdo.push(
          <Test key={i}>
            <MiniBox hover={hover} large={large} src={'/tmp/story-list/1486687443533-Dakota.jpeg'}  opacity={-1}>
              <Gra  hover={hover} >
                <Text>
                  {truncate(`“เน็ตมือถือไม่พอใช้” ปัญหาใหญ่ของผู้ใช้สมาร์ท
  โฟนชาวไทยในยุคนี้ สมาร์ทโฟนชาวไทยในยุคนี้...`, {
                'length': 70,
                'separator': ''
                  })}
                </Text>
              </Gra>
            </MiniBox>
          </Test>
      )
    }
    return (
      <Content className={className} style={{padding:'50px 0 80px 0'}}>
        <Feed>
          <TextLine className='sans-font'>VIDEO</TextLine>
          <Dash style={{margin:'5px 0 30px 0'}}></Dash>

          <Slider {...settings}>
            {vdo}
          </Slider>
        </Feed>
      </Content>
    )
  }
}

export default TopVideoHome;
