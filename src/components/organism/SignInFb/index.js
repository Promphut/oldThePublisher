import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Avatar from 'material-ui/Avatar'
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router-dom'
import TextField from 'material-ui/TextField';
import {findDOMNode as dom}from 'react-dom';
import api from '../../../services/api'
import auth from '../../../services/auth'
import config from '../../../config'
import { withRouter } from 'react-router'

const Box = styled.div`
  width:477px;
  background-color:#fff;
  padding:25px 0 25px 0;
  @media (max-width:480px){
    width:100vw;
    background:none;
    height:auto;
    padding:50px 0 50px 0;
  }
`
const Head = styled.div`
  margin:20px auto 20px auto;
  text-align:center;
  font-size:42px;
  font-family:'Nunito'
  color:${props=> props.theme.primaryColor};
`
const Text = styled.div`
  color:#8f8f8f;
  font-size:18px;
  text-align:center;
  font-family:'Mitr';

`
const LinkUnderLine = styled(Link)`
  text-decoration:underline;
`
const Div = styled.div`
  width:308px;
  border-top:1px solid #E2E2E2;
  padding-top:15px;
  margin:70px auto 0 auto;
`
const NewLink = styled(Link)`
  color:#C2C2C2;
  font-size:14px;
  font-family:'Nunito';
`
const InputBox = styled.form`
  width:308px;
  margin:0 auto 0 auto;
`

var styles={
  button:{
    background:'#3A579A',
    borderRadius:'24px',
    height:'48px',
    width:'307px'
  },
  btn:{
    background:'#3A579A',
    borderRadius:'24px',
  },
  btnCon:{
    width:'307px',
    margin:'0px auto 20px auto'
  },
  labelBtn:{
    top:'8px',
    fontWeight:'bold'
  }
}

class SignInFb extends React.Component {
  state = {
    errText0:'',
    errText1:'',
    email:'',
    password:''
  }
  static propTypes = {
    nextPathname: PropTypes.string.isRequired
  }
  static contextTypes = {
    setting: PropTypes.object
  }
  constructor(props) {
    super(props)
  }

  signin = (e) => {
    e.preventDefault()
    let self = this,
        data = {},
        i = 0,
        input = dom(this.refs.signinForm).getElementsByTagName("input")

    input = [].slice.call(input)

    input.forEach((field,index) => {
      if(field.value!=''){
        //console.log(field.name+':'+field.value)
        data[field.name] = field.value
        self.state['errText'+index] = ''
        self.setState({})
      } else {
        self.state['errText'+index] = 'This field is required'
        self.setState({})
        i++
      }
    })

    if(i==0){
      api.signin(data)
      .then(res => {
        auth.setCookieAndToken(res)
        
        this.props.history.push(self.props.nextPathname)
      }, err => {
        if(err.errors)
          self.setState({
            errText0: err.errors.username && err.errors.username.message,
            errText1: err.errors.password && err.errors.password.message
          })
        else
          self.setState({
            errText0: err.message,
            errText1: err.message
          })
      })
    }
  }

  onChangeEmail = (e)=>{
    this.setState({email:e.target.value})
  }
  onChangePass = (e)=>{
    this.setState({password:e.target.value})
  }

  render(){
    let {onClick, style} = this.props,
        {errText0, errText1, errText2,email,password} = this.state

    var {theme} = this.context.setting.publisher
    
    return(
      <Box>
        <Head className='hidden-mob'>Sign In</Head>
        <div style={styles.btnCon}>
          <a id="SignInFacebookButton" href={config.BACKURL+'/auth/facebook?publisher='+config.PID+'&nextpathname='+encodeURIComponent(this.props.nextPathname)}>
            <RaisedButton
              label=" Sign In with facebook"
              labelPosition="after"
              labelColor='white'
              labelStyle={styles.labelBtn}
              icon={<i className="fa fa-facebook" style={{color:'white',margin:'17px 10px 0 0'}} aria-hidden="true"></i>}
              style={styles.button}
              buttonStyle={styles.btn}
            />
          </a>
        </div>
        {/*<Text style={{marginTop:'20px',fontFamily:'Nunito'}}>Or <LinkUnderLine to="#" className='hidden-mob' onClick={this.props.emailSignIn}>Sign In with an E-mail</LinkUnderLine></Text>*/}
        <InputBox onSubmit={this.signin} ref='signinForm' >
          <TextField
            id="SignInEmailField"
            floatingLabelText="Email"
            type="email"
            value={email}
            onChange={this.onChangeEmail}
            fullWidth={true}
            name='username'
            errorText={errText0}
            inputStyle={{color:'#222'}}
            hintStyle={{color:'#222'}}
          /><br />
          <TextField
            id="SignInPasswordField"
            floatingLabelText="Password"
            type="password"
            value={password}
            onChange={this.onChangePass}
            fullWidth={true}
            name='password'
            errorText={errText1}
            inputStyle={{color:'#222'}}
            hintStyle={{color:'#222'}}
          /><br />
          <div style={{width:307,margin:'57px auto 0 auto'}}>
            <RaisedButton
              id="SignInButton"
              label=" Sign In"
              labelPosition="after"
              type='submit'
              labelColor={theme.accentColor}
              labelStyle={{color:theme.accentColor,top:'-2px'}}
              style={{borderRadius:'20px',boxShadow:'none',background:'none'}}
              buttonStyle={{background:'none',border:'2px solid '+theme.accentColor,borderRadius:'20px',width:'307px'}}
            />
          </div>
        </InputBox>
        <Div className='row' style={{display:'block',overflow:'auto'}}>
          <NewLink to="/forget" style={{float:'left'}}>Forget Password?</NewLink>
          <NewLink id="SignUpButton" to="/signup" style={{float:'right'}}>Sign Up</NewLink>
        </Div>
      </Box>
    )
  }
}

export default withRouter(SignInFb)