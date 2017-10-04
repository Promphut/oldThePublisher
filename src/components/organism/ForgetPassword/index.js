import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import {PrimaryButton} from 'components'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const Box = styled.div`
  width:600px;
  background-color:#fff;
  padding:10px 0 10px 0;
  @media (max-width:480px){
    margin:50px 0 20px 0;
    width:100%;
  }
  .centerMob{
    width:100px;
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

const InputBox = styled.div`
  width:350px;
  margin:0 auto 0 auto;
`

class ForgetPassword extends React.Component {
  static contextTypes = {
    setting: PropTypes.object
  }

  state = {
    email:''
  }

  onChangeText = (e) => {
    this.setState({email:e.target.value})
  }

  render(){
    var { theme } = this.context.setting.publisher
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

    return (
      <Box>
        <Head >Forget Password?</Head>
        <Text className="sans-font">We’ll send you an email to reset the password</Text>
        <InputBox  onSubmit={(e)=>this.props.onSubmit(e,this.state.email)}>
          <TextField
            hintText="Your account email"
            floatingLabelText="Your account email"
            type="email"
            fullWidth={true}
            style={{marginTop:'15px'}}
            autoFocus
          /><br />
          <div style={styles.btnCon}>
            <RaisedButton
              label="Confirm"
              labelPosition="after"
              labelColor='white'
              labelStyle={styles.labelBtn}
              style={styles.button}
              buttonStyle={styles.btn}
              type='submit'
            />
          </div>
        </InputBox>
      </Box>
    )
  }
}

export default ForgetPassword