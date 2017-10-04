import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import Avatar from 'material-ui/Avatar'
import {
	LogoLink,
	PrimaryButton,
	SecondaryButton,
	LeftMenu,
	RightMenu,
	BGImg,
	SearchButton
} from 'components'
import auth from '../../../services/auth'
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton'
import utils from '../../../services/utils'
import { withRouter } from 'react-router'
import config from '../../../config'

const Wrapper = styled.div`
	.transparent {
		background: none;
		border: none;
	}

	.hide {
		opacity: ${props => props.scroll};
		overflow: hidden;
	}
	@media (max-width: 480px) {
		.signin{
			font-size:12px;
		}
	}

`
const rot = keyframes`
	from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const rot2 = keyframes`

`
const Rotate = styled.div`
	width:50px;
	height:50px;
	background:red;
	animation: ${props => (props.open ? rot : rot2)}  1s forwards;
`

const Container = styled.div`
	margin: 0;
	padding: 0;
  background: ${props => (props.theme.barTone == 'light' ? 'white' : props.theme.primaryColor)};
	color: ${props => (props.theme.barTone == 'light' ? '#222' : 'white')};
  height: 60px;
  border-bottom: ${props => (props.theme.barTone == 'light' ? '1px solid #e2e2e2' : 'none')};
	width: 100%;
	transition: .1s;
	position: absolute;
	
	display: inline;

	animation: ${props=> props.open ? slideIn : slideOut} 0.1s forwards;
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
	float: left;
	position: relative;
	display: flex;
	z-index:10;
`

const HamburgerWrapper = styled.a`
	display: inline-block;
  float: left;
  text-align: center;
  color: ${props => (props.theme.barTone == 'light' ? '#222' : 'white')};
  padding: 11px 22px 13px;
  cursor: pointer;
`

const Hamburger = styled.i`
	color: ${props => (props.theme.barTone == 'light' ? '#222' : 'white')};
	padding-top:5px;
	transition: .2s;

	&:hover {
		color: ${props => props.theme.accentColor}
	}
`

const LogoWrapper = styled.div`
	display: flex;
	float: left;
	height: 60px;
`

const Center = styled.div`
	max-width: 60%;
	white-space: nowrap;
	position: relative;
	top: -60px;

	@media (max-width: 960px) {
		display: none;
	}
`

const Right = styled.div`
	float: right;
	position: relative;
	top: -120px;
	padding:0 20px;
	z-index:10;
	display:flex;
	align-items:center;
	height:60px;
	@media (max-width: 480px) {
		padding:0 15px;
		display:flex;
		position:static;
	}
`

const HideOnTablet = styled.div`
	flex:0;
	min-width: 100px;

	@media (max-width: 640px) {
		display: none;
	}
`

const NotLogin = styled.div`
	width: 96px;

`

const Edit = styled(Link)`
	min-width: 105px;
	font-size:18px;
	float:left;
	text-decoration:underline;
	padding:7px;
	margin:0 20px 0 0;
	&:hover{
		cursor:pointer;
	}
	@media (max-width: 480px) {
		display:none;
	}
`
const LogoGif = styled(BGImg)`
	width:60px;
	height:60px;
	margin-right:12px;
	animation:${props => (props.onLoading ? fadeOut : fadeIn)} 1.25s linear;
`
const Logo = styled.img`
	height: 60px;
	@media (max-width: 640px) {
		display: none;
	}
	@media (min-width: 768px) and (max-width: 992px) {
		display:none;
  }
`
const ContainerCenter = styled.div`
	width:100%;
	height:100%;
	display:flex;
	justify-content: center;
	@media (max-width: 480px) {
		display:none;
	}
`
const fadeOut = keyframes`
  0% {
    opacity:1;
  }
	100%{
		opacity:0;
	}
`
const fadeIn = keyframes`
	0% {
    opacity:0;
  }
	100%{
		opacity:1;
	}
`

let logoStyleBase = {
	display: 'inline-block',
	float: 'left',
	margin: 'auto'
}
let buttonStyle = {
	display: 'inline-block',
	float: 'left',
	boxShadow: 'none',
	verticalAlign: 'middle',
	height: '30px',
	lineHeight: '30px'
}
let avatarStyle = {
	display: 'inline-block',
	float: 'left',
	textAlign: 'center',
	margin: '0 0 0 13px',
	cursor: 'pointer'
}

class TopBar extends React.Component {
	static propTypes = {
		onScroll: PropTypes.func,
		scrolling: PropTypes.bool,
		status: PropTypes.string,
		editButton: PropTypes.string,
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
			lock: false,
			nowTop:0
		}
	}

	componentWillMount() {
		this.role = auth.hasRoles(['ADMIN', 'EDITOR', 'WRITER'])
	}

	componentWillUnmount() {
		if (this.props.onScroll)
			window.removeEventListener('scroll', this.handleScroll)
	}

	componentDidMount() {
		if (this.props.onScroll){}
			window.addEventListener('scroll', this.handleScroll)

		//console.log(this.role)
	}

	handleScroll = e => {
		this.props.onScroll(e)

		let top = e.srcElement.body.scrollTop / 500
		this.setState({ scroll: top })
		
		if(this.props.article&&utils.isMobile()){
			const prevTop = this.state.nowTop
			const nowTop = e.srcElement.body.scrollTop
			const diff = nowTop - prevTop
			if(Math.abs(diff)>5){
				if (nowTop<120&&!diff > 0) {this.setState({open: true,  nowTop})
				}else if (diff > 0) {this.setState({open: true,  nowTop})
				}else this.setState({open: false, nowTop})
			}
		}
	}

	openPop = side => {
		if (side === 'left') {
			this.setState({ alertLeft: true })
		} else if (side === 'right') {
			this.setState({ alertRight: true })
		}
	}

	handleRequestClose = side => {
		if (side === 'left') {
			this.setState({ alertLeft: false })
		} else if (side === 'right') {
			this.setState({ alertRight: false })
		}
	}

	close = (e, to, side) => {
		e.preventDefault()
		//console.log(e,to,side)
		if (side === 'left') {
			this.setState({ alertLeft: false })
		} else if (side === 'right') {
			this.setState({ alertRight: false })
		}
		if (this.props.location.pathname != to) this.props.history.push(to)
	}

	signup = () => {
		this.props.history.push('/signin')
	}

	render() {
		let { theme } = this.context.setting.publisher
		let { alertLeft, alertRight, scroll } = this.state
		let status = this.props.status || 'UNLOGGEDIN',
			{ scrolling, user, menu, transparent, editButton, hasCover } = this.props
		var isMobile = utils.isMobile()

		let logoStyle = isMobile
			? {
					...logoStyleBase,
					display: 'none'
				}
			: {
					...logoStyleBase
				}
		let logoStyleMobile = isMobile
			? {
					...logoStyleBase
				}
			: {
					...logoStyleBase,
					margin: 'auto 12px auto auto'
				}

		//console.log(this.props.onLoading)
		//console.log(theme, theme.slogoGif)
		return (
			<Wrapper scroll={scroll}>
				<Container
					open={this.state.open}
					className={
						'menu-font ' +
							(!scrolling && transparent && hasCover? 'transparent' : '')
					}>
					<Left>
						<HamburgerWrapper onClick={() => this.openPop('left')}>
							<Hamburger
								className="material-icons"
								style={
									!scrolling && transparent && hasCover
										? { color: 'white' }
										: {}
								}>
								menu
							</Hamburger>
						</HamburgerWrapper>
						<LogoWrapper>
							<Link to="/">
								<LogoGif
									onLoading={this.props.onLoading}
									src={this.props.onLoading ? theme.slogoGif : theme.slogo}
									opacity={-1}
								/>
							</Link>

							<Link to="/">
								<Logo
									src={theme.logo}
								/>
							</Link>
						</LogoWrapper>
					</Left>

					{!isMobile&&<ContainerCenter>
						<Center className={transparent ? 'hide' : ''}>
							{this.props.children}
						</Center>
					</ContainerCenter>}

					{status == 'LOGGEDIN' &&
						<Right>
							<SearchButton scrolling={scrolling} transparent={transparent} hasCover={hasCover}/>
							{this.role &&
								editButton &&
								<Edit
									className="nunito-font"
									style={{
										color: (!scrolling && transparent && hasCover) ||
											theme.barTone != 'light'
											? '#FFF'
											: '#222'
									}}
									to={editButton}>
									Edit Story
								</Edit>}

							{this.role &&
								<HideOnTablet>
									<Link to="/me/stories/new">
										<PrimaryButton
											id="TopNewStoryButton"
											label="Story"
											labelStyle={{ textTransform: 'none'}}
											iconName="add"
											style={buttonStyle}
										/>
									</Link>
								</HideOnTablet>}

							<Avatar
								id="RightMenuButton"
								src={user.pic.medium}
								size={30}
								style={avatarStyle}
								onClick={() => this.openPop('right')}
							/>
						</Right>}
					{status == 'UNLOGGEDIN' &&
						<Right>
							<SearchButton />
							<NotLogin>
								<RaisedButton
									id="SignInPageButton"
									label=" Sign In"
									labelColor={theme.accentColor}
									labelStyle={{top:'-2px'}}
									onClick={this.signup}
									style={{display:'block',borderRadius:'20px',boxShadow:'none',background:'none'}}
									buttonStyle={{background:'none',border:'2px solid '+theme.accentColor,borderRadius:'20px'}}
								/>
							</NotLogin>
						</Right>}
				</Container>

				<LeftMenu
					menu={menu}
					open={alertLeft}
					close={() => this.handleRequestClose('left')}
					closeAndLink={(e, to) => this.close(e, to, 'left')}
				/>
				{status == 'LOGGEDIN' &&
					<RightMenu
						open={alertRight}
						user={user}
						close={() => this.handleRequestClose('right')}
					/>}
			</Wrapper>
		)
	}
}

export default withRouter(TopBar)
