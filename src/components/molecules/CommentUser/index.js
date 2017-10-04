import React from 'react';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom';
import styled from 'styled-components'
import Avatar from 'material-ui/Avatar'
import {UserTag} from 'components'
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon'

const Container = styled.div`
  width:100%;
  overflow:hidden;
  margin:10px 0 10px 0;
  display:flex;
  .text-detail{
    color:#222;
    font-size:17px;
  }
  @media(max-width:480px){
    .text-detail{
      color:#222;
      font-size:14px;
    }
  }
` 

const Name = styled.div`
  color:#222222;
  font-weight:bold;
  font-size:17px;
  @media(max-width:480px){
    font-size:14px
  }
`

const Time = styled.span`
  color:#8F8F8F;
  font-size:15px;
  @media(max-width:480px){
    font-size:12px;
  }
`

const TextBtn = styled.div`
  color:#C1C1C1;
  font-size:16px;
  float:left;
  margin:25px 15px 0 20px; 
  &:hover{
    text-decoration:underline;
    color:#222;
    cursor:pointer;
  }
  @media(max-width:480px){

  }
`

const TextBtn2 = styled.div`
  color:#C1C1C1;
  font-size:14px;
  float:left;
  margin:10px 10px 0 0;
  &:hover{
    text-decoration:underline;
    color:#222;
    cursor:pointer;
  }
  @media(min-width:481px){
    display:none;
  }
`

const Tag = styled(Link)`
  color:${props=> props.theme.primaryColor};
  font-weight:bold;
  font-style: italic;
  font-size:19px;
  &:hover{
    cursor:pointer;
    color:${props=> props.theme.primaryColor};
    opacity:0.5;
  }
  @media(max-width:480px){
    font-size:14px;
  }
`

const ReplyBox = styled.textarea`
  width:500px;
  height:60px;
  border: 1px solid #C1C1C1;
  float:left;
`

const DetBox = styled.div`
  float:left;
` 

const BtnBox = styled.div`
  @media(max-width:480px){
    display:none;
  }
`

let styles = {
  button:{
    borderRadius:'20px',
    margin:'15px 0 0 0px',
    background:'none',
    boxShadow:'none',
    float:'left'
  },
  btnStyle:{
    borderRadius:'20px',
    border:'2px solid #c1c1c1',
    background:'none',
  },
  cont:{
    overflow:'hidden',
    width:'100%'
  },  
  button2:{
    borderRadius:'20px',
    marginLeft:'15px',
    float:'left'
  },
  btnStyle2:{
    borderRadius:'20px',
  },
}

let replyBox = ''
const test = []

class CommentUser extends React.Component {
  constructor(props) {
    super(props)
  }

  static contextTypes = {
    setting: PropTypes.object
  }

  showReplyBox = () => {
    replyBox = (<div style={{...styles.cont,margin:'15px 0 15px 60px'}}>
        <ReplyBox/>
        <RaisedButton 
          onClick={this.reply}
          label="Reply" 
          target="_blank"
          labelColor="#fff"
          style={styles.button2}
          buttonStyle={styles.btnStyle2}
          backgroundColor={theme.primaryColor}/>
      </div>)

    this.setState({})
  }

  reply = () => {
    replyBox=''
    this.setState({})
  }

  render(){
    let {theme} = this.context.setting.publisher

    return (
      <Container>
        <div><Link to="#"><Avatar src='/tmp/avatar.png' size={49} style={{float:'left',marginRight:'15px',display:'block'}}/></Link></div>
        <DetBox>
          <Name className="sans-font">{this.props.data.name} <Time>{this.props.data.date}</Time></Name>
          <div className="sans-font text-detail" ><Tag>@{this.props.data.target}</Tag> {this.props.data.text}</div>
          <BtnBox>
            <RaisedButton 
              label="Upvote | 18" 
              target="_blank"
              labelColor="#C1C1C1"
              labelStyle={{fontSize:'12px',top:'-2px'}}
              style={styles.button}
              buttonStyle={styles.btnStyle}
              backgroundColor="none"/>
            <TextBtn>Downvote</TextBtn>
            <TextBtn onClick={this.showReplyBox}>Reply</TextBtn>
          </BtnBox>
          <TextBtn2><FontIcon className='material-icons' style={{color:'#C1C1C1',fontSize:'14px',marginRight:'10px'}}>favorite_border</FontIcon> 18 Votes</TextBtn2>
          {replyBox}
        </DetBox>
      </Container>
    )
  }
}


export default CommentUser;