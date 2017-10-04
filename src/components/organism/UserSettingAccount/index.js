import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {PrimaryButton,SecondaryButton} from 'components'
import TextField from 'material-ui/TextField';
import Request from 'superagent'
import auth from '../../../services/auth'
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon'
import {findDOMNode as dom}from 'react-dom'
import api from '../../../services/api'
import utils from '../../../services/utils'
import config from '../../../config'

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
  }
`

const Flex = styled.div`
  display:flex;
  items-align:center;
  flex-flow: row wrap;
  margin:40px 0 0 50px;

  @media(max-width:480px){
    margin:20px 0 0 0 !important;
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

let styles = {
  button: {
    margin: 12,
    borderRadius:'10px',
  },
  btn:{
    borderRadius:'10px',
    backgroundColor:'#3a589b'
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

class UserSettingAccount extends React.Component {
  state = {
    user:{
      username:'',
      email: ''
    },
    error1:false,
    error2:false,
    textStatus1:'Unsave',
    textStatus2:'Unsave',
    errText0:null,
    errText1:null,
    errText2:null,
    isMobile:false
  }
  static contextTypes = {
    setting: PropTypes.object
  }

  fetechUser = (e) => {
    if(e) e.preventDefault()

    api.getUser(null, auth.getToken())
    .then(user => {
      //console.log('user', user)
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
          textStatus1: 'Cannot save the user, try again.',
          error1:true
        })
      }

      this.setState({
        textStatus1:'Saved successfully',
        error1:false
      })

      this.updateCookie()
    })
    .catch(err => {
      this.setState({
        textStatus1: err.message,
        error1:true
      })
    })
  }

  signFB = (e) => {
    e.preventDefault()

    Request
    .get(config.BACKURL+'/auth/facebook?publisher='+config.PID)
    .set('Accept','application/json')
    .end((err,res)=>{
      if(err) this.setState({textStatus2:'Connect with Facebook fail',
          error2:true
        })
      else
        this.setState({
          textStatus2:'Connect with Facebook successfully',
          error2:false,
        })
    })
  }

  changePWD = (e) => {
    e.preventDefault()

    var data = {}
    var input = e.target.getElementsByTagName("input")
    var er = 0
    input = [].slice.call(input)
    input.forEach((field,index)=>{
      if(field.value!=''){
        //console.log(field.name+':'+field.value)
        data[field.name] = field.value
      } else {
        er+=1
        this.state['errText'+index] = 'This field is required'
        this.setState({})
      }
    })

    var send = {
      oldPassword:data.oldPassword,
      newPassword:data.newPassword
    }

    if(er!=0){
      return
    } else {
      if(data.newPassword===data.newPassword2){
        api.changePassword(send)
        .then(res => {
          // force to relogin
          this.props.history.push('/logout')
        })
        .catch(err => {
          if(err.errors)
            this.setState({
              errText0:err.errors.password && err.errors.password.message
            })
          else 
            this.setState({
              errText0:err.message
            })
        })
      } else {
        this.setState({errText2:'Wrong Password'})
      }
    }
  }

  checkPWD = (e) => {
    //console.log(e.target.value)
    var pass1 = e.target.value
    //console.log(pass1)
    if(e.target.value!==pass1) this.setState({errText2:'Wrong Password'})
    else this.setState({errText2:''})
  }

  userChanged = (e) => {
    const name = e.target.name
    let user = {...this.state.user}
    utils.dotToObj(user, name, e.target.value)

    this.setState({
      user: user
    })
  }

  componentDidMount(){
    this.fetechUser()
    this.setState({isMobile:utils.isMobile()})
  }

  render(){
    let {textStatus1,error1,textStatus2,error2,errText0,errText2,errText1,user,isMobile} = this.state
    let {theme} = this.context.setting.publisher

    return(
      <div>
        <Container onSubmit={this.updateData} className='marginTop'>
          <div  className="head sans-font">ACCOUNT</div>
          <Flex>
            <Title className='hidden-mob'>
              <div className="sans-font">Username</div>
            </Title>
            <Edit>
              <TextField name='username' value={user.username} onChange={this.userChanged}
               hintText='Change your Username'
              floatingLabelText={isMobile?'Username':''}/>
            </Edit>
          </Flex>
          <Flex>
            <Title>
              <div className="sans-font" className='hidden-mob'>Email</div>
            </Title>
            <Edit>
              <TextField
              name='email' value={user.email}
              onChange={this.userChanged}
              hintText='Change your Email'
              floatingLabelText={isMobile?'Email':''}
              />
            </Edit>
          </Flex>
          {/*<Flex>
            <Title>
              <div className="sans-font">Social Connect </div>
            </Title>
            <Edit>
              <Social className="sans-font">
                <RaisedButton
                  onClick={this.signFB}
                  label="Connect"
                  labelStyle={{color:'white'}}
                  style={{...styles.button}}
                  buttonStyle={{...styles.btn}}
                  icon={<i className="fa fa-facebook" style={{color:'white',margin:'0 5px 0 14px'}} aria-hidden="true"></i>}
                />
              </Social>
            </Edit>
          </Flex>*/}
          <div className='row hidden-des'>
            <TextStatus style={{color:error2?'#D8000C':theme.accentColor,margin:'30px 0 0 15px'}} className='hidden-des'>{textStatus1}</TextStatus>
          </div>
          <div className='sans-font btn-row' >
            <PrimaryButton label='Save' type='submit' style={{float:'left',margin:'0 20px 0 0'}}/>
            <SecondaryButton label='Reset' onClick={this.fetechUser} style={{float:'left',margin:'0 20px 0 0'}}/>
            <TextStatus style={{color:error2?'#D8000C':theme.accentColor}} className='hidden-mob'>{textStatus1}</TextStatus>
          </div>
        </Container>

        <Container onSubmit={this.changePWD} autoComplete="off">
          <div  className="head sans-font">CHANGE PASSWORD</div>
          <Flex>
            <Title className='hidden-mob'>
              <div className="sans-font">Old Password</div>
            </Title>
            <Edit>
              <TextField
                hintText="Old Password"
                type="password"
                name='oldPassword'
                errorText={errText0}
                autoComplete="off"
                hintText='Your old password'
                floatingLabelText={isMobile?'Old Password':''}
              />
            </Edit>
          </Flex>
          <Flex>
            <Title className='hidden-mob'>
              <div className="sans-font">New Password</div>
            </Title>
            <Edit>
              <TextField
                type="password"
                name='newPassword'
                errorText={errText1}
                autoComplete="off"
                hintText='Your new password'
                floatingLabelText={isMobile?'New Password':''}
              />
            </Edit>
          </Flex>
          <Flex>
            <Title className='hidden-mob'>
              <div className="sans-font">Retype Again</div>
            </Title>
            <Edit>
              <TextField
                type="password"
                name='newPassword2'
                errorText={errText2}
                autoComplete="off"
                onBlur={this.checkPWD}
                hintText='Your new password Again'
                floatingLabelText={isMobile?'New Password':''}
              />
            </Edit>
          </Flex>
          <div className='row hidden-des'>
            <TextStatus style={{color:error2?'#D8000C':theme.accentColor,margin:'30px 0 0 15px'}} className='hidden-des'>{textStatus2}</TextStatus>
          </div>
          <div className='sans-font btn-row'>
            <PrimaryButton label='Save' type='submit' style={{float:'left',margin:'0 20px 0 0'}}/>
            <SecondaryButton label='Reset' onClick={this.setData} style={{float:'left',margin:'0 20px 0 0'}}/>
            <TextStatus style={{color:error2?'#D8000C':theme.accentColor}} className='hidden-mob'>{textStatus2}</TextStatus>
          </div>
        </Container>
      </div>
    )
  }
}

export default UserSettingAccount
