import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components'
import {TagBox} from 'components'
import {findDOMNode as dom} from 'react-dom'
//import Request from 'superagent'
import api from '../../../services/api'

const Container = styled.div`
  width:100%; 
`

const Head = styled.div`
  color:#8F8F8F;
  font-size:20px;
  width:201px;
  text-align:center;
  margin:20px auto 15px auto;
  border:1px solid #E2E2E2;
  background:white;
  padding:2px;
  font-family:'Nunito'

	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	cursor: default;
`

const Divider =styled.div`
  height:1px;
  width:100%;
  background-color:#E2E2E2;
  top:35px;
  z-index:-5;
  position:relative;
`
const FlexBox = styled.div`
  margin:30px 0 30px 0;
  display:flex;
  flex-wrap:wrap;
  justify-content: flex-start;
`

class TagSideBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      popular:[],
      tags:[]
    }
  }

  getTags = () => {
    api.getTags().then((tags)=>{
      this.setState({tags})
      //console.log(tags)
    })
  }

  componentDidMount(){
    this.getTags()
  }

  render(){
    let {style} = this.props
    let {tags} = this.state

    return (
      <Container style={{...style}} >
        <Divider/>
        <Head>SUGGESTED TAGS</Head>
        <FlexBox>
          {tags.length!=0&&tags.map((tag,index)=>(
            <Link to={tag.url} key={index}>
              <TagBox style={{margin:'0 10px 10px 0'}}>{tag.name}</TagBox>
            </Link>
          ))}
        </FlexBox>
      </Container>
    )
  }
}

export default TagSideBar;
