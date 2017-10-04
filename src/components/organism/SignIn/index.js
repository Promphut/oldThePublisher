import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import {PrimaryButton} from 'components'
import TextField from 'material-ui/TextField';
import {findDOMNode as dom}from 'react-dom';
import auth from '../../../services/auth'
import api from '../../../services/api'
import { withRouter } from 'react-router'

const Box = styled.div`
  width:477px;
  background-color:#fff;
  padding:10px 0 10px 0;
`

const Head = styled.div`
  margin:60px auto 10px auto;
  text-align:center;
  font-size:42px;
  color:${props=> props.theme.primaryColor};
  font-family:'Nunito';
`

const Text = styled.div`
  color:#8f8f8f;
  font-size:18px;
  text-align:center;
`

const Div = styled.div`
  width:308px;
  border-top:1px solid #E2E2E2;
  padding-top:15px;
  overflow:hidden;
  margin:50px auto 0 auto;
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

let styles={
  button:{
    background:'#3A579A',
    borderRadius:'24px',
    height:'48px',
    width:'167px'
  },
  btn:{
    background:'#3A579A',
    borderRadius:'24px',
  },
  btnCon:{
    margin:'50px auto 20px auto'
  },
}

class SignIn extends React.Component {
  state = {
    errText0:'',
    errText1:'',
  }
  static propTypes = {
    nextPathname: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
  }

  signin = (e) => {
    e.preventDefault()

    let data = {},
        i = 0,
        input = dom(this.refs.signinForm).getElementsByTagName("input")

    input = [].slice.call(input)

    input.forEach((field,index) => {
      if(field.value!=''){
        //console.log(field.name+':'+field.value)
        data[field.name] = field.value
        
        let state = {}
        state['errText'+index] = ''
        this.setState(state)

      } else {
        let state = {}
        state['errText'+index] = 'This field is required'
        this.setState(state)
        i++
      }
    })

    if(i==0){
      api.signin(data)
      .then(res => {
        //console.log('SIGN IN', res)
        auth.setCookieAndToken(res)
        
        this.props.history.push(this.props.nextPathname)
      }, err => {
        if(err.errors)
          this.setState({
            errText0: err.errors.username && err.errors.username.message,
            errText1: err.errors.password && err.errors.password.message
          })
        else
          this.setState({
            errText0: err.message,
            errText1: err.message
          })
      })
    }
  }

  render(){
    let {onClick, style} = this.props,
        {errText0, errText1, errText2} = this.state

    return (
      <Box>
        <Head>Email Sign In</Head>
        <InputBox onSubmit={this.signin} ref='signinForm'>
          <TextField
            id="SignInEmailField"
            autoFocus
            hintText="Email"
            floatingLabelText="Email"
            type="email"
            fullWidth={true}
            style={{marginTop:'20px'}}
            name='username'
            errorText={errText0}
          /><br />
          <TextField
            id="SignInPasswordField"
            hintText="Password Field"
            floatingLabelText="Password"
            type="password"
            fullWidth={true}
            style={{marginTop:'20px'}}
            name='password'
            errorText={errText1}
          /><br />
          <div id="SignInButton" style={styles.btnCon}><PrimaryButton label='Sign In' type='submit'/></div>
        </InputBox>
        <Div style={{marginBottom:'20px'}}>
          <NewLink to="/forget" style={{float:'left'}}>Forget Password?</NewLink>
          <NewLink to="/signup" style={{float:'right'}}>Sign Up</NewLink>
        </Div>
      </Box>
    )
  }
}

export default withRouter(SignIn)