import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import utils from '../../../services/utils'
import api from '../../../services/api'
import truncate from 'lodash/truncate'
import isEmpty from 'lodash/isEmpty'

const Container = styled.div `
  width: 100%;
  padding: 24px 16px 24px 16px;
  background-color: ${props => props.theme.primaryColor};
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
`

const NextStoryHeader = styled.h4 `
  color:white;
  font-size: 20px;
  font-family: 'Nunito', 'Mitr';
  margin: 0;
`

const Dash = styled.div`
  margin:5px 0 0 0;
  width:30px;
  height:4px;
  background-color:${props=>props.theme.accentColor};
`

const Thumbnail = styled.img `
  margin-top: 16px;
  width: 100%;
  height: auto;
`

const Title = styled.h5 `
  color: white;
  font-family: 'Nunito', 'Mitr';
  font-size: 22px;
  margin-top: 8px;
  margin-bottom: 0px;
`

const Subtitle = Title.extend `
  font-size: 18px;
  margin-top: 5px;
  margin-bottom: 0px;
`

const WriterLink = styled.span `
  font-size: 18px;
  color: white;
`

const ColumnLink = styled.span `
  font-size: 18px;
  color: ${props => props.theme.accentColor};
`

export default class NextStoryMobile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nextStory: {},
    }
  }

  getNextStory = (sid,cid,format) => {
    api.getFeed(format, { status: 1, column: cid }, 'popular', null, null, null,{'omit' : [sid],'next':true})
    .then(result => {
      //console.log(result)
      this.setState({nextStory: result.feed})
    })
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

  render () {
    if(!isEmpty(this.state.nextStory))
    {
      let {ptitle, cover, url, writer, column} = this.state.nextStory

      return (
        <Container>
          <Link to = {url}>
            <NextStoryHeader>NEXT STORY</NextStoryHeader>
            <Dash/>
            <Thumbnail src ={cover.medium}/>
          </Link>

          <Title>{ptitle && truncate(ptitle, {length: 40, seperator: ''})}</Title>
          <Subtitle>by <Link to={writer.url}><WriterLink>{writer.display}</WriterLink></Link> in <Link to = {column.url}><ColumnLink>{column.name}</ColumnLink></Link> </Subtitle>
        </Container>
      )
    }
    else {
      return <div style={{display:'none'}}></div>
    }
  }
}
