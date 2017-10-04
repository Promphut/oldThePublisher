import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import TextField from 'material-ui/TextField'
import FontIcon from 'material-ui/FontIcon'
import FlatButton from 'material-ui/FlatButton'
import auth from '../../../services/auth'
import api from '../../../services/api'
import {ContactAndAboutContainer, PrimaryButton, SecondaryButton} from 'components'
import utils from '../../../services/utils'

const Wrapper = styled.div`
`

const Dropdown = styled.div`
  display: inline-block;
  height: 50px;
`

const DropdownContent = styled.div`
  // visibility: ${props => props.dropdown ? 'visible' : 'hidden'};
  // opacity: ${props => props.dropdown ? '1' : '0'};
  // transition: ${props => props.dropdown ? '.2s' : '0s'};
  display: ${props => props.dropdown ? 'block' : 'none'};
  position: absolute;
  margin: 5px;
  padding: 0px;
  border: 2px solid ${props=> props.theme.primaryColor};
  background: white;
  z-index: 1;
  max-width: 90%;
`

const Head = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 0px;
  @media (max-width: 480px) {
    font-size: 24px;
  }
`

const Subhead = styled.h4`
  font-size: 24px;
  font-weight: bold;
  margin-top: 0px;
  color: ${props=> props.theme.primaryColor};
  @media (max-width: 480px) {
    font-size: 16px;
  }
`

const Article = styled.div`
  font-size: 20px;
  margin: 40px 0px;
  @media (max-width: 480px){
    font-size: 16px;
    margin-top: 15px;
  }
`

const ButtonRow = styled.div`
  margin: 15px 0px;
  height: 20px;
`

const SuccessMessage = styled.em`
  font-size: 14px;
  margin-left: 25px;
  position: relative;
  top: 50%;
  color: ${props=> props.theme.primaryColor};
  transition: 0.2s;
  opacity: ${props=> props.saved ? 1 : 0};
  @media (max-width: 480px) {
    display: none;
  }
`

const SuccessMessageMobile = styled.em`
  display: none;

  @media (max-width: 480px) {
    display: ${props=> props.saved ? 'block' : 'none'};
    margin: 10px 0px 20px;
    font-size: 14px;
    color: ${props=> props.theme.primaryColor};
    transition: 0.2s;
    opacity: ${props=> props.saved ? 1 : 0};
  }
`

class ContactPage extends React.Component {
  static contextTypes = {
    setting: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      user: {},
      head: "Hi there!",
      message: {},
      problems: [],
      saved: false,
      dropdown: false,
      error: {},
      contactCat:{}
      // ,textarea: RichTextEditor.createEmptyValue()
    }
  }

  sendMessage = () => {
    const {username, email, tel, problem, textarea} = this.state.message
    const contactCat = this.state.contactCat
    const contact = {
      name: username,
      email,
      tel,
      detail: textarea
    }

    // if (username && email && problem) {
      api.sendContactEmail(contactCat, contact)
      .then(contact => {
        this.setState({
          saved: true
        })
      })
      .catch(err => {
        this.setState({
          saved: false,
          error: {
            username: err.errors.name ? err.errors.name.message : '',
            email: err.errors.email ? err.errors.email.message : '',
            textarea: err.errors.detail
          }
        })
      })
    // } else {
    //   //console.log('Please enter require value')
    //
    //   this.setState({
    //     saved: false
    //   })
    // }
  }

  resestMessage = () => {
    const problem = this.state.message.problem

    this.setState({
      message: {
        username: '',
        email: '',
        tel: '',
        problem,
        textarea: ''
      },
      error: {
        username: '',
        email: '',
        tel: '',
        textarea: ''
      },
      saved: false
    })
  }

  selectProblem = (problem) => {
    const message = this.state.message

    this.setState({
      message: {
        ...message,
        problem:problem.catName
      },
      dropdown: false,
      contactCat:problem
    })
  }

  openDropdown = () => {
    this.setState({
      dropdown: true
    })
  }
  closeDropdown = () => {
    this.setState({
      dropdown: false
    })
  }

  handleChangeUsername = () => {
    const username = this.refs.username.getValue()
    const message = this.state.message
    const error = this.state.error

    this.setState({
      message: {
        ...message,
        username
      },
      error: {
        ...error,
        username: ''
      }
    })
  }
  handleChangeEmail = () => {
    const email = this.refs.email.getValue()
    const message = this.state.message
    const error = this.state.error

    this.setState({
      message: {
        ...message,
        email
      },
      error: {
        ...error,
        email: ''
      }
    })
  }
  handleChangeTel = () => {
    const tel = this.refs.tel.getValue()
    const message = this.state.message

    this.setState({
      message: {
        ...message,
        tel
      }
    })
  }
  handleChangeTextarea = (event) => {
    const message = this.state.message
    const error = this.state.error

    this.setState({
      message: {
        ...message,
        textarea: event.target.value
      },
      error: {
        ...error,
        textarea: ''
      }
    })
  }

  // onChange(value) {
  //   //console.log(value)
  //   this.setState({textarea : value});
  // },

  componentDidMount(){
    api.getPublisherContactCats()
    .then(contactCats => {
      //console.log(contactCats)
      // if (contactCats.length === 0) {
      //   contactCats.push({catName: 'General'})
      // }
      contactCats.forEach((val) => {
        this.state.problems.push(val);
      })

      api.getUser(null, auth.getToken())
      .then(user => {
        this.setState({
          user,
          head: 'Hello ' + user.display + '!',
          message: {
            username: user.display,
            email: user.email,
            tel: '',
            problem: '',
            textarea: ''
          }
        })
      })
      .catch(() => {
        this.setState({
          user: {},
          head: 'Hi there!',
          message: {
            username: '',
            email: '',
            tel: '',
            problem: '',
            textarea: ''
          }
        })
      })
    })
  }

  render() {
    const {theme} = this.context.setting.publisher

    let {user, head, message, problems, saved, dropdown, error, contactCat} = this.state
    let {username, email, tel, problem, textarea} = this.state.message

    const floatingLabelText = (text) => {
      return (
        <span>
          <span style={{
            color: 'red',
            marginRight: '5px'
          }}>*</span>
          {text}
        </span>
      )
    }

    const textStyle = {
      fontSize: '18px'
    }

    let dropdownProblem
    let textArea
    let fullWidth
    if (utils.isMobile()) {
      dropdownProblem = {
        width: '90vw'
      }
      textArea = {
        borderColor: error.textarea ? '#F44336' : '#A9A9A9',
        width: '100%'
      }
      fullWidth = true
    } else {
      dropdownProblem = {
        width: '400px'
      }
      textArea = {
        borderColor: error.textarea ? '#F44336' : '#A9A9A9',
        width: '500px'
      }
      fullWidth = false
    }

    const problemSelect = (
      <span>{problem}
        <FontIcon className="material-icons" style={{color: theme.primaryColor, float: 'right', padding: '8px 8px 0px 0px', marginLeft: '-8px'}}>
          keyboard_arrow_down
        </FontIcon>
      </span>
    )

    let button = []
    for (let i = 0; i < problems.length; i++){
      button.push(
        <div key={i}>
          <FlatButton
            label={problems[i].catName}
            labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
            style={{width: '385px', textAlign: 'left', display: 'inline-block'}}
            onClick={() => this.selectProblem(problems[i])}
          /><br/>
        </div>
      )
    }

    return (
      <ContactAndAboutContainer onLoading={this.props.onLoading}>
        <Wrapper>
          <Head className='title-font'>{head}</Head>
          <Subhead className='title-font'>What do you want to contact us about?</Subhead>
          <Dropdown onMouseOver={this.openDropdown} onMouseLeave={this.closeDropdown}>
            <SecondaryButton
              label={problemSelect}
              labelColor={theme.primaryColor}
              labelStyle={{textTransform:'none',color:theme.primaryColor}}
              style={{...dropdownProblem,color:theme.primaryColor}}
              buttonStyle={{textAlign: 'left',border:'2px solid '+theme.primaryColor,color:theme.primaryColor}}
            />
            <DropdownContent dropdown={dropdown}>
              {button}
            </DropdownContent>
          </Dropdown>
          <Article className='content-font' style={{marginTop: '25px'}}>{contactCat.desc}</Article>
          <textarea
            rows="10"
            ref='textarea'
            value={textarea}
            onChange={this.handleChangeTextarea}
            style={textArea}
          ></textarea><br/>
          {/*<RichTextEditor
            value={this.state.textarea}
            onChange={this.onChange}
          />*/}
          <TextField
            ref='username'
            value={username || ''}
            onChange={this.handleChangeUsername}
            className='content-font'
            hintText={username ? '' : 'Your name'}
            hintStyle={textStyle}
            floatingLabelText={floatingLabelText('Contact by')}
            floatingLabelStyle={textStyle}
            floatingLabelFixed={true}
            inputStyle={textStyle}
            errorText={error.username || ''}
            fullWidth={fullWidth}
          /><br />
          <TextField
            ref='email'
            type="email"
            value={email || ''}
            onChange={this.handleChangeEmail}
            className='content-font'
            hintText={email ? '' : 'Email'}
            hintStyle={textStyle}
            floatingLabelText={floatingLabelText('Contact email')}
            floatingLabelStyle={textStyle}
            floatingLabelFixed={true}
            inputStyle={textStyle}
            errorText={error.email || ''}
            fullWidth={fullWidth}
          /><br />
          <TextField
            ref='tel'
            value={tel || ''}
            onChange={this.handleChangeTel}
            className='content-font'
            hintText={tel ? '' : 'Mobile Number'}
            hintStyle={textStyle}
            floatingLabelText="Contact Phone"
            floatingLabelStyle={textStyle}
            floatingLabelFixed={true}
            inputStyle={textStyle}
            fullWidth={fullWidth}
          /><br />
          <ButtonRow>
            <SuccessMessageMobile saved={saved}>Saved successfully</SuccessMessageMobile>
            <PrimaryButton label='Save' style={{float: 'left'}} buttonStyle='Flat' onClick={this.sendMessage} />
            <SecondaryButton label='Reset' style={{float: 'left', marginLeft: '25px'}} onClick={this.resestMessage}/>
            <SuccessMessage saved={saved}>Saved successfully</SuccessMessage>
          </ButtonRow>
        </Wrapper>
      </ContactAndAboutContainer>
    )
  }
}


export default ContactPage;
