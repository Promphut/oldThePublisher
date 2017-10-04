import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {PrimaryButton,SecondaryButton,UploadPicture} from 'components'
import TextField from 'material-ui/TextField';
import auth from '../../../services/auth'
import {findDOMNode as dom} from 'react-dom';
import api from '../../../services/api'
import utils from '../../../services/utils'

const Container = styled.form`
  width:100%;
  padding:80px;
  border-bottom:1px solid #E2E2E2;
  .textTitle{
    color:#C2C2C2;
    font-family:'PT Sas';
    font-size:17px;
  }
  .head{
    color:#C2C2C2;
    font-family:'Nunito';
    font-size:18px;
  }
  .btn-row{
    margin-top:50px;
    overflow:hidden;
  }
  @media(max-width:480px){
    max-width: 100%;
    padding:30px;
    .btn-row{
      margin-top:5px;
    }
    &.marginTop{
      margin-top:60px;
    }
    .marginMob{
      margin-left:20px;
    }
  }
`

const Flex = styled.div`
  display:flex;
  items-align:center;
  flex-flow: row wrap;
  margin:50px 0 0 50px;
  @media(max-width:480px){
    margin:20px 0 0 0;
  }
`

const Title = styled.div`
  flex:2 150px;
  max-width:150px;
  color:#C2C2C2;
  font-size:17px;
  padding-top:15px;
`

const Edit = styled.div`
  flex:6 450px;
  max-width:450px;

`

const Social = styled.div`
  color:#8F8F8F;
  font-size:19px;
  overflow:hidden;
`

const TextStatus = styled.div`
  color:${props=> props.theme.primaryColor};
  font-size:15px;
  font-style:italic;
  float:left;
  margin:10px 0 0 15px;
`

class UserSettingProfile extends React.Component {
  state = {
    error:false,
    textStatus:'Unsave',
    errText:'',
    user: {
      display: '',
      shortDesc: '',
      city: '',
      channels: {
        fb:'',
        twt: '',
        ig: '',
        yt: ''
      },
      pic: {
        medium: ''
      }
    }
  }
  static contextTypes = {
    setting: PropTypes.object
  }

  maximumCharacter = 1200

  fetchUser = (e) => {
    if(e) e.preventDefault()

    api.getUser()
    .then(user => {
      this.setState({
        user: user
      })
    })
  }

  updateCookie = () => {
    // * If user object is editted, we must reset the local cookie user as well.
    let token = auth.getToken()
    // 1. Fetch menu, user, and roles information
    api.getCookieAndToken(token)
    .then(result => {
      // 2. Update newly fetch cookie
      auth.setCookieAndToken(result)
    })
  }

  updateData = (e) => {
    e.preventDefault()

    let user = this.state.user
    api.updateUser(user)
    .then(u => {
      if(!u) {
        return this.setState({
          textStatus: 'Cannot save the user, try again.',
          error:true
        })
      }

      this.setState({
        textStatus:'Saved successfully',
        error:false
      })

      //console.log('USER', this.state.user)

      this.updateCookie()
    })
    .catch(err => {
      this.setState({
        textStatus: err.message,
        error:true
      })
    })
  }

  userChanged = (e) => {
    const name = e.target.name
    if(name=='shortDesc'){
      var val = e.target.value.split('')
      if(val.length>=this.maximumCharacter){
        this.setState({
          errText:'Maximun characters'
        })
        return
      }else{
        this.setState({
          errText:''
        })
      }
    }
    let user = {...this.state.user}
    utils.dotToObj(user, name, e.target.value)

    this.setState({
      user: user
    })
  }

  componentDidMount(){
    this.fetchUser()
  }

  render(){
    let {theme} = this.context.setting.publisher
    let {textStatus, error, user,errText} = this.state
    //console.log('user.pic.medium', user.pic.medium)
    return(
      <Container onSubmit={this.updateData} ref='userProfile' className='marginTop'>
        <div  className="head sans-font">PROFILE</div>
        <Flex>
          <Title className='hidden-mob'>
            <div className="sans-font">Display name</div>
          </Title>
          <Edit className='hidden-mob'>
            <TextField name='display' value={user.display} onChange={this.userChanged} ref={input => {this.display = input}}/>
          </Edit>
          <Edit className='hidden-des'>
            <TextField name='display' value={user.display} onChange={this.userChanged}
            ref={input => {this.display = input}}
            hintText='Display name'
            floatingLabelText='Display'/>
          </Edit>
        </Flex>
        <Flex>
          <Title >
            <div className="sans-font">Profile picture</div>
          </Title>
          <Edit>
            <UploadPicture src={user&&user.pic.medium} ratio={1} path={'/users/'+user._id+'/photo'} size='500x500' type='photo' width={140} height={140}/>
          </Edit>
        </Flex>
        <Flex>
          <Title className='hidden-mob'>
            <div className="sans-font">Tell people about me</div>
          </Title>
          <Edit className='hidden-mob'>
            <TextField
              multiLine={true}
              fullWidth={true}
              floatingLabelText={`${this.maximumCharacter} characters`}
              hintText={`Your description max to ${this.maximumCharacter} characters`}
              floatingLabelFixed={true}
              rows={1}
              rowsMax={20}
              name='shortDesc'
              errorText={errText}
              value={user.shortDesc}
              onChange={this.userChanged}/>
          </Edit>
          <Edit className='hidden-des'>
            <TextField
              multiLine={true}
              fullWidth={true}
              hintText={`Your description max to ${this.maximumCharacter} characters`}
              floatingLabelText="Description"
              floatingLabelFixed={true}
              rows={1}
              rowsMax={20}
              name='shortDesc'
              errorText={errText}
              value={user.shortDesc}
              onChange={this.userChanged}/>
          </Edit>
        </Flex>
        <Flex>
          <Title className='hidden-mob'>
            <div className="sans-font">Current living city</div>
          </Title>
          <Edit className='hidden-mob'>
            <TextField defaultValue="Bangkok, Thailand" name='city' value={user.city} onChange={this.userChanged}/>
          </Edit>
          <Edit className='hidden-des'>
            <TextField
            hintText='Current living city'
            floatingLabelText='Living city'
            name='city' value={user.city} onChange={this.userChanged}/>
          </Edit>
        </Flex>
        <Flex>
          <Title>
            <div className="sans-font">Social Channels</div>
          </Title>
          <Edit className='marginMob'>
            <Social className="sans-font hidden-mob" >
              <i className="fa fa-facebook hidden-mob" style={{float:'left',margin:'20px 20px 0 0'}} aria-hidden="true"></i>
              <div className='hidden-mob' style={{float:'left',margin:'15px 20px 0 0'}}>facebook.com/</div>
              <TextField style={{float:'left',margin:'5px 0 0 0'}} name='channels.fb' value={user.channels && user.channels.fb} onChange={this.userChanged}/>
            </Social>
            <Social className="sans-font hidden-des" >
              <TextField
              hintText='facebook.com/Your-path'
              floatingLabelText="Facebook"
              style={{float:'left',margin:'5px 0 0 0'}} name='channels.fb' value={user.channels && user.channels.fb} onChange={this.userChanged}/>
            </Social>
            <Social className="sans-font hidden-mob">
              <i className="fa fa-twitter hidden-mob" style={{float:'left',margin:'20px 20px 0 0'}} aria-hidden="true"></i>
              <div className='hidden-mob' style={{float:'left',margin:'15px 20px 0 0'}}>twitter.com/</div>
              <TextField style={{float:'left',margin:'5px 0 0 0'}} name='channels.twt' value={user.channels && user.channels.twt} onChange={this.userChanged}/>
            </Social>
            <Social className="sans-font hidden-des">
              <TextField
              hintText='twitter.com/Your-path'
              floatingLabelText="Twitter"
              style={{float:'left',margin:'5px 0 0 0'}} name='channels.twt' value={user.channels && user.channels.twt} onChange={this.userChanged}/>
            </Social>
            <Social className="sans-font hidden-mob">
              <i className="fa fa-instagram hidden-mob" style={{float:'left',margin:'20px 20px 0 0'}} aria-hidden="true"></i>
              <div className='hidden-mob' style={{float:'left',margin:'15px 20px 0 0'}}>instagram.com/</div>
              <TextField style={{float:'left',margin:'5px 0 0 0'}} name='channels.ig' value={user.channels && user.channels.ig} onChange={this.userChanged}/>
            </Social>
            <Social className="sans-font hidden-des">
              <TextField
              hintText='instagram.com/Your-path'
              floatingLabelText="Instagram"
              style={{float:'left',margin:'5px 0 0 0'}} name='channels.ig' value={user.channels && user.channels.ig} onChange={this.userChanged}/>
            </Social>
            <Social className="sans-font hidden-mob">
              <i className="fa fa-youtube-play hidden-mob" style={{float:'left',margin:'20px 20px 0 0'}} aria-hidden="true"></i>
              <div className='hidden-mob' style={{float:'left',margin:'15px 20px 0 0'}}>youtube.com/</div>
              <TextField style={{float:'left',margin:'5px 0 0 0'}} name='channels.yt' value={user.channels && user.channels.yt} onChange={this.userChanged}/>
            </Social>
            <Social className="sans-font hidden-des">
              <TextField
              hintText='youtube.com/Your-path'
              floatingLabelText="Youtube"
              style={{float:'left',margin:'5px 0 0 0'}} name='channels.yt' value={user.channels && user.channels.yt} onChange={this.userChanged}/>
            </Social>
          </Edit>
        </Flex>
        <div className='row hidden-des'>
          <TextStatus style={{color:error?'#D8000C':theme.accentColor,margin:'30px 0 0 15px'}} className='hidden-des'>{textStatus}</TextStatus>
        </div>
        <div className='sans-font' style={{overflow:'hidden',marginTop:'30px'}}>
          <PrimaryButton label='Save' type='submit' style={{float:'left',margin:'0 20px 0 0'}}/>
          <SecondaryButton label='Reset' onClick={this.fetchUser} style={{float:'left',margin:'0 20px 0 0'}}/>
          <TextStatus style={{color:error?'#D8000C':theme.accentColor}} className='hidden-mob'>{textStatus}</TextStatus>
        </div>
      </Container>
    )
  }
}

export default UserSettingProfile
