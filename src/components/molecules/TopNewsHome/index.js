import React from 'react'
import PropTypes from 'prop-types'
import {BGImg, ShareDropdown} from 'components'
import styled,{keyframes} from 'styled-components'
import {Link} from 'react-router-dom'
import api from '../../../services/api'
import moment from 'moment'
import truncate from 'lodash/truncate'
import utils from '../../../services/utils'
const NewsBox = styled.div`
	flex:2;
	height:444px;
  padding:18px;
  background:white;
  @media (max-width:480px) {
    padding:0px;
    height:auto;
  }
  @media (min-width: 768px) and (max-width: 992px) {
    height:300px;
  }
`
const News = styled.div`
  color:${props=>props.theme.primaryColor};
  font-size:20px;
  font-weight:bold;
`
const Dash = styled.div`
  margin:5px 0 0 0;
  width:30px;
  height:4px;
  background-color:${props=>props.theme.accentColor};
`
const VerticalTimeline = styled.div`
  width:8px;
  position:relative;
  height:100%;
  margin:0 5px 0 0px;
  border-radius:2em;
  background-color:#F4F4F4;
  position:relative;
  min-height:50px;
  @media (min-width: 768px) and (max-width: 992px) {
    min-height:40px;
  }
`
const Doughnut = styled.div`
  margin:0 5px 0 0px;
  border: 2px solid ${props=>props.theme.accentColor};
  border-radius: 50%;
  height:8px;
  width:8px;
`
const NameLink = styled(Link)`
  display: block;
  font-family: Mitr;
  color:#222;
  font-weight:bold;
  font-style: normal;
  font-size:14px;
  &:hover{
    color:${props=>props.theme.accentColor}
  }
  @media (max-width:480px) {
    font-size:14px;
    line-height:1.3;
  }
  @media (min-width: 768px) and (max-width: 992px) {
    font-size:14px;
  }
`
const Time = styled.div`
  color:#8E8E8E;
  font-size:10px;
  @media (max-width:480px) {
    align-self:flex-end;
    margin:3px 0 3px 0;
  }
`
const Box = styled.div`
  display:flex;
  min-height:50px;
  height:auto;
  padding-bottom:8px;
  @media (max-width:480px) {
    height:76px;
  }
`
const BoxInner = styled.div`
  margin:20px 0 0 0;
  overflow:auto;
  width:100%;
  height:90%;
  position:relative;
  @media (min-width: 768px) and (max-width: 992px) {
    height:80%;
  }
`
const Grad = styled.div`
  position:relative;
  width:100%;
  height:100%;
  z-index:5;
  background: rgba(255,255,255,0);
background: -moz-linear-gradient(top, rgba(255,255,255,0) 48%, rgba(255,255,255,1) 100%);
background: -webkit-gradient(left top, left bottom, color-stop(48%, rgba(255,255,255,0)), color-stop(100%, rgba(255,255,255,1)));
background: -webkit-linear-gradient(top, rgba(255,255,255,0) 48%, rgba(255,255,255,1) 100%);
background: -o-linear-gradient(top, rgba(255,255,255,0) 48%, rgba(255,255,255,1) 100%);
background: -ms-linear-gradient(top, rgba(255,255,255,0) 48%, rgba(255,255,255,1) 100%);
background: linear-gradient(to bottom, rgba(255,255,255,0) 48%, rgba(255,255,255,1) 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#ffffff', GradientType=0 );
`
const BoxDivMo = styled.div`
  margin-right: 10px;
`
const BoxDiv2Mo = styled.div`
  flex:7;
  margin-right: 8px;
  @media (max-width:480px) {
    display:flex;
    flex-wrap: wrap;
  }
`
const BoxDiv3Mo = styled.div`
  float:right;
`

const TextBox = styled.div`
   @media (max-width:480px) {
    flex:1 100%;
  }
`

const BoxInnerInner = styled.div`
  margin-top: 10px;
  ${props => props.isMobile ? 'border-bottom: 1px solid #e2e2e2' : ''};
`

const BG = styled(BGImg)`
  position: relative;
  margin-top: 6px;
  width: 80px;
  height: 42px;
`

const BoxDiv = styled.div`
  flex:0 15px;
`
const BoxDiv2 = styled.div`
  flex:0 90%;
`

class TopNewsHome extends React.Component {
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
    return (
      <NewsBox>
        <News className='hidden-mob'>NEWS</News>
        <Dash className='hidden-mob'/>
        <BoxInner>
          {news && news.map((val,ind)=>(
            <div key={ind}>
              {utils.isMobile() ?
              <BoxInnerInner isMobile={utils.isMobile()}>   
                <Box>
                  <BoxDivMo>
                    <BG  url={val.url} src={val.cover.small || val.cover.medium} alt={val.ptitle || ''} />
                  </BoxDivMo>
                  <BoxDiv2Mo>
                    <TextBox>
                      <NameLink to={val.url} className='nunito-font' >
                        {truncate(val.ptitle&&val.ptitle, {
                          'length': 65,
                          'separator': ''
                        })}
                      </NameLink>
                    </TextBox>
                    <Time className='sans-font'>{moment(val.published).fromNow()}</Time>
                  </BoxDiv2Mo>
                  <BoxDiv3Mo>
                      <ShareDropdown buttonSize={16} url={val.url} className='hidden-des'/>
                  </BoxDiv3Mo>
                </Box>
              </BoxInnerInner>
            :
              <Box>
                <BoxDiv>
                  <Doughnut/>
                  <VerticalTimeline/>
                </BoxDiv>
                <BoxDiv2>
                  <NameLink to={val.url} className='nunito-font' >
                    {truncate(val.ptitle&&val.ptitle, {
                      'length': 70,
                      'separator': ''
                    })}
                  </NameLink>
                  <Time className='sans-font'>{moment(val.published).fromNow()}</Time>
                </BoxDiv2>
              </Box>}
            </div>
          ))}
        </BoxInner>

      </NewsBox>
    )
  }
}

export default TopNewsHome;
