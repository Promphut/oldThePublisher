import React from 'react'
import PropTypes from 'prop-types'
import styled, {keyframes}  from 'styled-components'
import {Link} from 'react-router-dom'
import Avatar from 'material-ui/Avatar'
import {LogoLink, PrimaryButton, SecondaryButton, LeftMenu,
	ShareButtonTop, ShareDropdownTop, FbShareButton} from 'components'
import auth from '../../../services/auth'
//import utils from 'components/utils'
import FontIcon from 'material-ui/FontIcon'
import { withRouter } from 'react-router'
import utils from '../../../services/utils'

const Wrapper = styled.div`
	.transparent {
		transition: background 0.2s ease;
		transition: border 0.2s ease;
  	background: none;
		border: none;
	}
`

const Container = styled.div`
	margin: 0;
	padding: 0;
  background: ${props => props.theme.barTone=='light'?'white':props.theme.primaryColor};
	color: ${props => props.theme.barTone=='light'?'#222':'white'};
  height: 60px;
  border-bottom: ${props => props.theme.barTone=='light'?'1px solid #e2e2e2':'none'};
	width: 100%;
	transition: .1s;
	position: absolute;


  animation: ${props=> props.open ? slideIn : slideOut} 0.1s forwards;
	display: flex;

	flex-flow: row nowrap;
	justify-content: space-between;

	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
`

const slideOut = keyframes`
	from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0%);
  }
`

const slideIn = keyframes`
	from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(-100%);
  }
`

const Left = styled.div`
	justify-content: flex-start;
	display: inline-block;
`

const HamburgerWrapper = styled.a`
	display: inline-block;
  float: left;
  text-align: center;
  color: ${props => props.theme.barTone=='light'?'#222':'white'};
  padding: 11px 22px 13px;
  cursor: pointer;
`

const Hamburger = styled.i`
	color: ${props => props.theme.barTone=='light'?'#222':'white'};
	padding-top:5px;
`

const LogoWrapper = styled.div`
	display: flex;
	float: left;
	height: 60px;
`

const Logo = styled.img`
	height: 60px;
	width: 60px;
	cursor: pointer
`

const Center = styled.div`
	opacity: 1;
	transparent .1s;
	cursor: default;
	justify-content: center;

	@media (max-width: 960px) {
		display: none;
	}
`

const Right = styled.div`
	justify-content: flex-end;
	display: inline-block;
`

const HideOnTablet = styled.div`
	float: left;

	@media (max-width: 640px) {
		display: none;
	}
`

const NotLogin = styled.div`
	width: 180px;
	display: inline-block;
	font-size: 15px;
	margin: 9px 20px;

	& * {
		color: ${props => props.theme.barTone=='light'?'#222':'white'};
	}

	& a:hover {
		text-decoration: underline;
	}
`

const Edit = styled(Link)`
	font-size:18px;
	float:left;
	text-decoration:underline;
	padding:7px;
	margin:10px 20px 0 0;
	&:hover{
		cursor:pointer;
	}
`

class TopBarWithShare extends React.Component {
	static propTypes = {
		onScroll: PropTypes.func,
		scrolling: PropTypes.bool,
		status: PropTypes.string,
		editButton:PropTypes.string,
		title: PropTypes.string,

		menu: PropTypes.object,
		user: PropTypes.object
	}

	static contextTypes = {
		setting: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			alertLeft: false,
			alertRight: false,
			scroll: 0,
			topOpacity: 1,
			open: false,
			lock: false
		}
	}

	handleScroll = (e) => {
		this.props.onScroll(e)

		const prevTop = this.state.scroll
		const nowTop = e.srcElement.body.scrollTop
		const diff = nowTop - prevTop
		//const speed = 120
		//console.log(nowTop,prevTop,diff)
		// const prevTop = this.state.scroll
		// const nowTop = e.srcElement.body.scrollTop
		// const diff = nowTop - prevTop
		//
		// let topOpacity = this.state.topOpacity - (diff / speed)
		// if (topOpacity > 1.5) topOpacity = 1.5
		// if (topOpacity < -1) topOpacity = -1

		// this.setState({ scroll: nowTop})
		// this.setState({scroll: nowTop})
		if(Math.abs(diff)>5){
			if (nowTop<120&&!diff > 0) {this.setState({open: true,  scroll: nowTop})
			}else if (diff > 0) {this.setState({open: true,  scroll: nowTop})
			}else this.setState({open: false, scroll: nowTop})
		}

	}

	openPop = (side) => {
		if (side === 'left') {
			this.setState({alertLeft: true})
		} else if (side === 'right') {
			this.setState({alertRight: true})
		}
	}

	handleRequestClose = (side) => {
		if (side === 'left') {
			this.setState({alertLeft: false})
		} else if (side === 'right') {
			this.setState({alertRight: false})
		}
	}

	close = (e,to,side) => {
		e.preventDefault()
		//console.log(e,to,side)
		if (side === 'left') {
			this.setState({alertLeft: false})
		} else if (side === 'right') {
			this.setState({alertRight: false})
		}
		if(this.props.location.pathname != to) this.props.history.push(to)
	}

	// signup(){
	// 	this.props.history.push('/signup')
	// }

	componentWillMount(){
		this.role = auth.hasRoles(["ADMIN","EDITOR","WRITER"])
	}

	componentWillUnmount() {
		if(this.props.onScroll) window.removeEventListener('scroll', this.handleScroll)

	}

	componentDidMount() {
		if(this.props.onScroll) window.addEventListener('scroll', this.handleScroll)
			//console.log(this.role)
	}

	render () {
		let {theme} = this.context.setting.publisher
		let {alertLeft, alertRight, topOpacity, open} = this.state
		let status = this.props.status || 'UNLOGGEDIN',
			{scrolling, user, menu, transparent, editButton, hasCover,share}  = this.props

	  const logoStyleBase = {
	    display: 'inline-block',
	    float: 'left',
	    margin: 'auto'
	  }
		const logoStyle = utils.isMobile() ? {
			...logoStyleBase,
			display: 'none'
		} : {
			...logoStyleBase
		}
		const logoStyleMobile = utils.isMobile() ? {
			...logoStyleBase
		} : {
			...logoStyleBase,
			display: 'none'
		}

		const moreStyle = {
			color: (theme.barTone == 'light' && ((scrolling && transparent) || !hasCover)) ? '#222' : '#FFF',
			padding: '16px 13px'
		}

	  return (
	    <Wrapper >
				<Container className={'menu-font ' + ((!scrolling && transparent && hasCover) ? 'transparent' : '')}  open={open}>
					<Left>
			      <HamburgerWrapper onClick={() => this.openPop('left')}>
			        <Hamburger className="material-icons" style={!scrolling && transparent && hasCover ? {color:'#FFF'} : {}}>menu</Hamburger>
			      </HamburgerWrapper>
						<LogoWrapper>
			      	<LogoLink to="/" src={theme.slogo} title={this.props.title} style={logoStyleMobile} />
						</LogoWrapper>
					</Left>

					<Right>
						<FbShareButton style={{float: 'left'}} button={<ShareButtonTop number={share&&share.fb} barTone={theme.barTone} scrolling={scrolling} hasCover={hasCover}/>} />
						<ShareDropdownTop>
							<FontIcon style={moreStyle} className="material-icons" >more_vert</FontIcon>
						</ShareDropdownTop>
					</Right>
				</Container>

				<LeftMenu
					menu={menu}
					open={alertLeft}
					close={() => this.handleRequestClose('left')}
					closeAndLink={(e,to) => this.close(e,to,'left')}
				/>
	    </Wrapper>
	  )
	}
}

export default withRouter(TopBarWithShare);
