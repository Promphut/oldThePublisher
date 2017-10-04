import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import utils from '../../../services/utils'
import api from '../../../services/api'
import truncate from 'lodash/truncate'
import isEmpty from 'lodash/isEmpty'

const NextStoryContainer = styled.div `
  opacity: ${props => (props.scrollOpacity ? '1' : '0')};
  position: -webkit-sticky;
  position: sticky;
  display: block;
  float: right;
  bottom: 0px;
  right: 0px;
  border-color: #c6c6c6;
  border-width: 1px 1px 1px 1px;
  border-style: solid;
  background: url(${props=>props.imgSrc}) no-repeat center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height:auto;
  width: 240px;
  height: 120px;
  transition: .2s;
`

const ImgOverlay = styled.div `
  background-color: rgba(0,0,0,0.5);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
`

const NextStoryHeaderWarpper = styled.div `
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    top:-35px;
`

const NextStoryName = styled.p `
  color: white;
  text-align: center;
  padding-left: 15px;
  padding-right: 15px;
`

const NextStoryArrow = styled.span `
  margin-top: 5px;
  margin-right:5px;
  float: right;
  font-size: 24px;
  color:white;
  margin-bottom: 0px;
`

export default class NextStory extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      nextStory: {},
			scrollOpacity: false
    }
  }

  getNextStory = (sid,cid,format) => {
    api.getFeed(format, { status: 1, column: cid }, 'popular', null, null, null,{'omit' : [sid],'next':true})
    .then(result => {
      //console.log(result)
      this.setState({nextStory: result.feed})
    })
  }

  handleScroll = e => {
    if (!utils.isMobile()) {
      //var body = e.srcElement.body

      //var height = Math.max(body.scrollHeight, body.offsetHeight);

      const scrollOpacity = e.srcElement.body.scrollTop > e.srcElement.body.scrollHeight - window.innerHeight - 800
        ? true
        : false

      this.setState({
        scrollOpacity
      })
    }
  }

  componentWillMount() {
    this.getNextStory(this.props.currentID,this.props.cid,this.props.format)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentID != nextProps.currentID)
      {
        this.getNextStory(nextProps.currentID,nextProps.cid,nextProps.format)
      }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    if(!isEmpty(this.state.nextStory)){
      let {ptitle, cover, url} = this.state.nextStory
      return (
          <Link to = {url || "/"}>
            <NextStoryContainer scrollOpacity = {this.state.scrollOpacity} imgSrc = {cover && cover.medium}>
              <ImgOverlay></ImgOverlay>
              <NextStoryArrow><i className="material-icons">arrow_forward</i></NextStoryArrow>
              <NextStoryHeaderWarpper>
                <NextStoryName>{ptitle && truncate(ptitle, {length: 40, seperator: ''})}</NextStoryName>
              </NextStoryHeaderWarpper>
            </NextStoryContainer>
          </Link>
      )
    } 
    else
      return (<div style={{display:'none'}}></div>)
  }
}
