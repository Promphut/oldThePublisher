import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import Divider from 'material-ui/Divider'
import { findDOMNode as dom } from 'react-dom'
import Avatar from 'material-ui/Avatar'
import auth from '../../../services/auth'
import utils from '../../../services/utils'

const Container = styled.div`
  text-align: left;
  position:fixed;
  width:100%;
  height:100%;
  top:0;
  left:0;
	z-index:100;
	animation: ${props => (props.open ? displayBlock : displayNone)} 0.3s forwards;
  @media (max-width:480px){
    width: 100vw;
    .mobile{
      margin:20px;
    }
  }
	@media (min-width: 768px) and (max-width: 992px) {
		.hidden-mob{
			display:none;
		}
  }
`

const Container2 = styled.div`
  position:absolute;
  width:100%;
  height:100%;
  top:0;
  left:0;
	z-index:101;
  background:rgba(0,0,0,0.8);
  animation: ${props => (props.open ? fadeOut : fadeIn)} 0.3s forwards;
  @media (max-width:480px){
    width: 100vw;
  }
`

const displayNone = keyframes`
  from {
    opacity:1;
  }
  to {
    opacity:0;
  }
`
const displayBlock = keyframes`
  from {
    opacity:0;
  }
  to {
    opacity:1;
  }
`
const slideOut = keyframes`
	from {
    transform: translateX(100%);
    opacity:0;
  }
  to {
    transform: translateX(0%);
    opacity:1;
  }
`
const slideIn = keyframes`
	from {
    transform: translateX(0%);
    opacity:1;
  }
  to {
    transform: translateX(100%);
    opacity:0;
  }
`

const fadeIn = keyframes`
  from {
    opacity:0;
  }
  to {
    opacity:1;
  }
`
const fadeOut = keyframes`
  from {
    opacity:1;
  }
  to {
    opacity:0;
  }
`

const Nav = styled.nav`
	position: relative;
	top: 0;
  float: right;
	height: 100%;
	width: 400px;
	overflow-x: hidden;
	overflow-y: auto;
	z-index:102;
  animation: ${props => (props.open ? slideOut : slideIn)} 0.4s forwards;
  background: rgba(255, 255, 255, 0.85);

	& hr {
		background-color: #c1c1c1 !important;
    margin: 15px 0px !important;
	}

	& ul {
		list-style-type:none;
		font-size: 24px;
    margin: 0px;

    @media(max-width: 480px){
      padding: 0px 40px;
    }
	}
	& ul li a {
		display: block;
    padding: 15px 10px;
		color: #222;
    transition: .2s;

    &:hover {
  		color: ${props => props.theme.accentColor};
    }
	}

  @media(max-width:480px){
    width: 85vw;
    & ul {
      font-size: 20px;
    }
  }	
	@media (min-width: 768px) and (max-width: 992px) {
		width:370px;
		& ul {
      font-size: 20px;
    }
  }
`

const CloseBtn = styled(IconButton)`
	top: 15px;
	left: 15px;
	position: relative !important;

	& .material-icons {
		width: 30px;
		height: 30px;

    &:hover {
      color: ${props => props.theme.accentColor} !important;
    }
	}

  @media(max-width: 480px){
    float: right;
    margin: 0px 30px !important;
  }
`

const Profile = styled.div`
	padding: 40px 40px 0 40px;
	& > * {
		vertical-align: middle;
		display: inline-block;
	}
	& > div {
		width: 240px;
		font-size: 15px;
		color: #8f8f8f;
		padding-left: 20px;
	}

	& > div a h3 {
    color: #222;
    transition: .2s;

    &:hover {
      color: ${props => props.theme.accentColor};
    }
	}
  @media (max-width:480px){
    & > div {
      font-size: 12px;
    }
    & > * {
      display: block;
    }
    padding: 0px 20px 0 20px;
  }	
	@media (min-width: 768px) and (max-width: 992px) {
		padding: 20px 20px 0 20px;
    & > div {
      font-size: 12px;
    }
		& > div a h3 {
			font-size: 14px;
		}
  }

`

const EditMode = styled.div`
  background-color:#222;
  color:#fff;
  position:relative;
  top:0;
  left:0;
  width:100%;
  height:60px;
  padding:12px;
  font-size:20px;
  transition: .2s;

  &:hover {
    background-color: ${props => props.theme.accentColor}
  }

  @media(max-width:480px){
    font-size: 18px;
  }
`

class RightMenu extends React.Component {
	static contextTypes = {
		setting: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			open: this.props.open,
			display:'none'
		}
	}

	componentWillReceiveProps(nextProps) {
		var self = this
		if(nextProps.open!=this.props.open){
			if(!nextProps.open){
				setTimeout(function() {
					self.setState({display:'none'})
					document.getElementsByTagName('body')[0].style.overflow = 'auto'
				}, 300);
			}else{
					this.setState({display:'block'})
					document.getElementsByTagName('body')[0].style.overflow = 'hidden'
			}
		}
	}

	render() {
		let { theme } = this.context.setting.publisher
		let isMobile = false
		let { open, close } = this.props, user = this.props.user
		//console.log(user)
		var {display} = this.state

		let displayStyle, AvatarSize, introStyle
		let hiddenMobile = {}
		let AvatarStyle = {}
		let linkStyle = {}

		if (utils.isMobile()) {
			isMobile = true
			hiddenMobile = {
				display: 'none'
			}
			AvatarStyle = {
				border: '1px solid #FFF',
				marginTop: '70px'
			}
			AvatarSize = 55
			displayStyle = {
				fontSize: '18px',
				margin: '0px',
				color: '#222',
				fontWeight: 'bold',
				position: 'absolute',
				top: '70px',
				left: '115px'
			}
			introStyle = {
				position: 'absolute',
				top: '95px',
				left: '115px',
				maxWidth: '225px'
			}
			linkStyle = {
				display: 'inline-flex'
			}
		} else {
			displayStyle = {
				fontSize: '22px',
				margin: '0px',
				fontWeight: 'bold'
			}
			introStyle = {}
			AvatarSize = 70
		}
		//console.log('USER', user)
		return (
			<Container open={open} style={{display:display}}>
				<Container2 onClick={close} />
				<Nav open={open}>
					<div className="menu menu-font">
						{auth.hasRoles(['ADMIN', 'EDITOR']) &&
							<Link id="EditorModeButton" to={'/editor'} className='hidden-mob'>
								<EditMode className="nunito-font">
									<FontIcon
										className="material-icons"
										style={{
											color: '#fff',
											margin: '0 25px 0 20px',
											top: '4px'
										}}>
										edit
									</FontIcon>
									Editor Mode
								</EditMode>
							</Link>}
						<CloseBtn onClick={close}>
							<FontIcon
								className="material-icons"
								style={{ color: '#222', fill: '#222' }}>
								close
							</FontIcon>
						</CloseBtn>

						<Profile className="content-font">
							<Link to={user.url}>
								<Avatar
									style={AvatarStyle}
									src={user.pic.medium}
									size={AvatarSize}
									className="mobile"
								/>
							</Link>
							<div style={{ marginTop: '-15px' }}>
								<Link to={user.url}>
									<h3 style={displayStyle}>{user.display}</h3>
								</Link>
								<div style={introStyle}>
									{user.intro}
								</div>
							</div>
						</Profile>
						<Divider />
						<ul>
							<li>
								<Link id="MyStoriesButton" style={hiddenMobile} to="/me/stories" onClick={close}>
									My Stories
								</Link>
							</li>
							<li>
								<Link id="EditProfileButton" style={linkStyle} to="/me/settings" onClick={close}>
									{isMobile
										? <FontIcon
												style={{ paddingRight: '25px' }}
												className="material-icons">
												account_circle
											</FontIcon>
										: ''}
									Edit Profile
								</Link>
							</li>
						</ul>
						<Divider style={hiddenMobile} />
						<ul>
							<li>
								<Link
								  id="SettingsButton"
									style={linkStyle}
									to="/me/settings/account"
									onClick={close}>
									{isMobile
										? <FontIcon
												style={{ paddingRight: '25px' }}
												className="material-icons">
												settings
											</FontIcon>
										: ''}
									Settings
								</Link>
							</li>
							<li>
								<Link id="LogOutButton" style={linkStyle} to="/logout">
									{isMobile
										? <FontIcon
												style={{ paddingRight: '25px' }}
												className="material-icons">
												exit_to_app
											</FontIcon>
										: ''}
									Log Out
								</Link>
							</li>
						</ul>
					</div>
				</Nav>
			</Container>
		)
	}
}

export default RightMenu
