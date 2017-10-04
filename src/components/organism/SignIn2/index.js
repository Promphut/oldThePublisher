import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Avatar from 'material-ui/Avatar'
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router-dom'
import api from '../../../services/api'
import TextField from 'material-ui/TextField';
import auth from '../../../services/auth'
import {withRouter} from 'react-router'

const Box = styled.div`
  width:600px;
  background-color:#fff;
  padding:10px 0 20px 0;
  @media (max-width:480px) {
    background:none;
    width:100vw;
    padding:80px 0 80px 0;
    height:auto;
  } 
`
const Head = styled.div`
  margin:35px auto 0px auto;
  text-align:center;
  font-size:32px;
  color:${props=> props.theme.primaryColor};
  font-family:'Nunito';
  @media (max-width:480px) {
    margin:0px auto 10px auto;
    font-weight:bold;

  } 
`
const Text = styled.div`
  color:#8f8f8f;
  font-size:18px;
  text-align:center;
  margin:5px 0 5px 0;
  line-height:1.5;
`
const LinkUnderLine = styled(Link)`
  color:${props=> props.theme.primaryColor};
  font-size:18px;
  text-decoration:underline; 
`
const InputBox = styled.form`
  width:350px;
  margin:0 auto 0 auto;
`
const NewLink = styled(Link)`
  color:#C2C2C2;
  font-size:14px;
  font-family:'Nunito';
`

class SignIn2 extends React.Component {
  static contextTypes = {
    setting: PropTypes.object
  }

  state = {
    password:'',
    pub:{},
    errText:''
  }

  getPublisher = () => {
    var id = this.props.user.memberOfs[0]
    api.getOtherPublisher(id).then((p)=>{
      //console.log(p)
      this.setState({pub:p})
    })
  }

  onChangeText = (e) => {
    this.setState({password:e.target.value})
  }

  signin = (e) => {
    e.preventDefault()
    var {email} = this.props.user
    var {password} = this.state
    var data = { username:email,password }
    api.signin(data)
      .then(res => {
        //console.log('SIGN IN', res)
        auth.setCookieAndToken(res)
        this.props.history.push('/')
      }, err => {
        if(err.errors){
          this.setState({
            errText: err.errors.password && err.errors.password.message
          })
        }
        else{
          this.setState({
            errText: err.message
          })
        }
      })
  }

  componentDidMount(){
    this.getPublisher()
  }

  render(){
    var { theme } = this.context.setting.publisher
    var {user} = this.props
    var {pub,password,errText} = this.state

    var styles={
      button:{
        background:theme.accentColor,
        borderRadius:'24px',
        height:'40px',
        width:'350px',
        marginTop:'25px'
      },
      btn:{
        background:theme.accentColor,
        borderRadius:'24px',
      },
      btnCon:{
        width:'350px',
        margin:'0px auto 20px auto'
      },
      labelBtn:{
        top:'10px',
        fontWeight:'bold'
      }
    }
    return(
      <Box>
        <Head >You already have an account</Head>
        <Text className='sans-font' style={{marginBottom:'0px'}}>
          <span style={{color:'#222'}}>{user.email} </span>is signed up<br/>
          with {pub.name} by Email.<br/>
          Do you want to continue log in with this account?
        </Text>
        <div style={{width:'70px',margin:'40px auto 20px auto'}}><Avatar src={user.pic.medium} size={70}/></div>
        <Text className='sans-font' style={{color:"#222",margin:'30px',marginBottom:'0px'}}>{user.display}</Text>
        <InputBox onSubmit={this.signin}>
          <TextField
            floatingLabelText="Password"
            type="password"
            fullWidth={true}
            name='password'
            inputStyle={{color:'#222'}}
            value={password}
            onChange={this.onChangeText}
            errorText={errText}
            autoFocus
          />
          <NewLink to="/forget" style={{float:'left'}}>Forget Password?</NewLink>
          <div style={{...styles.btnCon}}>
            <RaisedButton
              id="ContinueSignUpButton"
              label="Next"
              labelPosition="after"
              labelColor='white'
              labelStyle={{...styles.labelBtn}}
              style={{...styles.button}}
              buttonStyle={{...styles.btn}}
              type='submit'
            />
          </div>
        </InputBox>
      </Box>
    )
  }
}

export default withRouter(SignIn2) 