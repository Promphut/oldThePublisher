import React from 'react';
import styled from 'styled-components'
import CopyToClipboard from 'react-copy-to-clipboard'
import api from '../../../services/api'
import utils from '../../../services/utils'
import config from '../../../config'

import {TwtShareButton, FbShareButton} from 'components'

const ImageShareContainer = styled.div `
  display: ${props=>props.open==true?'flex':'none;'};
  left: ${props => props.posLeft}px;
  top: ${props => props.posTop}px;
  position: absolute;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  z-index:3;
`

const SocialItem = styled.div`
  order: ${props => props.order};
  color: white;
  background-color: ${props => props.BGColor};
  padding: 20px 20px 20px 20px;
  &:hover {
		color: white !important;
    background-color: ${props => props.BGDarkColor};
    cursor: pointer;
	}
`

const SocialItemContainer = styled.div `
  flex:0;
  display:'inline';
`

const SocialIcon = styled.i `
  height: auto;
  font-size: 20px;
`

export default class ImageShare extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      url:'',
      posTop: 0,
      posLeft: 0,
      open:false,
      open2:false,
      topen:false,
      imgContainer:[]
    }
  }

  //Get shorten url based on current page
  getUrl = (done) => {
    let url = this.props.url
    if(!url){
      url = window.location.href
    }
    api.shorten(url, {medium:'social'})
    .then(done)
  }

  onStoryCopied (val) {
    val = utils.getTrailingSid(val)
    if(val!=null) api.incStoryInsight(val, 'share', 'share_dark')
  }

  getPos = (el)=> {
    // yay readability
    for (var lx=0, ly=0;
        el != null;
        lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    this.setState({
      posLeft:lx,
      posTop:ly
    })
  }

  hadleMouseEnter = (e) => {
    this.getPos(e.currentTarget)
    this.setState({
      open: true,
    },()=>this.checkOpen());
  }

  mouseEnter = (e)=>{
    this.setState({
      open2:true
    },()=>this.checkOpen())
  }

  mouseLeave = (e)=>{
    this.setState({
      open2:false
    },()=>this.checkOpen())
  }

  checkOpen = ()=>{
    var {open,open2} = this.state
    if(open==false&&open2==false) this.setState({topen:false})
    else this.setState({topen:true})
  }

  handleMouse = () =>{
    var self  =  this
        this.setState({imgContainer:document.querySelectorAll('img.ui-sortable-handle')},()=>{
            var eventList = [].forEach.call(this.state.imgContainer,function(e){e.addEventListener('mouseenter',function(e){
              self.hadleMouseEnter(e)
            })})
            var eventList2 = [].forEach.call(this.state.imgContainer,function(e){e.addEventListener('mouseleave',function(e){
              self.setState({
                open: false,
              },()=>self.checkOpen());
            })})
        })
  }

  removeHandleMouse = () =>{
    var eventList = [].forEach.call(this.state.imgContainer,function(e){e.removeEventListener('mouseenter',()=>{})})
    var eventList2 = [].forEach.call(this.state.imgContainer,function(e){e.removeEventListener('mouseleave',()=>{})})
}

  componentDidMount(){
    this.getUrl(res => {
      this.setState({url: res.url})
    })
    this.handleMouse()
  }

  componentWillUnmount(){
   this.removeHandleMouse()
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.sid != this.props.sid){
      this.removeHandleMouse()
      this.setState({imgContainer:[]},()=>{
        this.handleMouse()
      })
    }
  }


  render () {
		let url = this.state.url
		let hashtags = this.props.hashtags
		if(hashtags==null) hashtags = config.NAME
    var o = this.checkOpen
    return (
      <ImageShareContainer onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} open={this.state.topen} posLeft = {this.state.posLeft} posTop = {this.state.posTop} id='shareImg'>
        <SocialItemContainer><FbShareButton button = {<SocialItem target="_blank" BGColor = {"#38559c"} BGDarkColor = {"#052269"} order = {"1"}><SocialIcon className = "fa fa-facebook" aria-hidden="true"></SocialIcon></SocialItem>}/></SocialItemContainer>
        <SocialItemContainer><TwtShareButton button = {<SocialItem target="_blank" BGColor = {"#35a9e0"} BGDarkColor = {"#0276AD"} order = {"2"}><SocialIcon className = "fa fa-twitter" aria-hidden="true"></SocialIcon></SocialItem>}/></SocialItemContainer>

        <SocialItemContainer><CopyToClipboard SocialItem text={url} onCopy={this.onStoryCopied.bind(this)}>
          <SocialItem BGColor = {"#c7c7c7"} BGDarkColor = {"#949494"} order = {"3"}>
            <SocialIcon className = "fa fa-link" aria-hidden="true"></SocialIcon>
          </SocialItem>
        </CopyToClipboard></SocialItemContainer>

      </ImageShareContainer>
    )
  }

}
