import React from 'react'
import { SignIn, SignInFb, LogoLink, BackButton, CloseButton } from 'components'
import FlatButton from 'material-ui/FlatButton'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Wrapper = styled.div`
	width:100%;
  height:100%;
  position:absolute;
  background: ${props => props.theme.primaryColor};
  background: -moz-linear-gradient(-45deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  background: -webkit-gradient(left top, right bottom, color-stop(0%, ${props => props.theme.primaryColor}), color-stop(100%, ${props => props.theme.secondaryColor} ));
  background: -webkit-linear-gradient(-45deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  background: -o-linear-gradient(-45deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  background: -ms-linear-gradient(-45deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  background: linear-gradient(135deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00b2b4', endColorstr='#cef1b7', GradientType=1 );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00b2b4', endColorstr='#cef1b7', GradientType=1 );
  @media (max-width:480px) {
    max-width: 100vw;
		max-height: 100vh;
		background:white;
  }
`

const Modal = styled.div`
  width:100%;
  height:100%;
  position:absolute;
  background:rgba(0,0,0,0.6)
`

const Container = styled.div`
  margin:7% auto 0 auto;
  width:477px;
  @media (max-width:480px) {
    max-width: 100vw;
		max-height: 100vh;
  }
`

const BoxButton = styled.div`
  overflow:hidden;
  width:100%;
`

class SignInPage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			statePage: true,
			visible: props.visible
		}
	}

	changeStatePage = e => {
		e.preventDefault()

		this.setState({
			statePage: !this.state.statePage
		})
	}

	checkBack = e => {
		e.preventDefault()

		if (this.state.statePage) {
			this.props.history.goBack()
		} else {
			this.setState({
				statePage: !this.state.statePage
			})
		}
	}

	closeModal = e => {
		this.setState({
			visible: !this.state.visible
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible != this.props.visible) {
			this.setState({
				visible: nextProps.visible
			})
		}
	}

	render() {
		let state = this.props.location.state, nextPathname = '/'
		if (state && state.nextPathname) nextPathname = state.nextPathname

		let styles = {}
		if (!this.state.visible) {
			styles = { display: 'none' }
		}

		if (!this.props.modal) {
			return (
				<Wrapper style={{ ...styles }}>
					<Container>
						<BoxButton>
							<a href="#" onClick={this.checkBack}>
								<BackButton style={{ float: 'left' }} />
							</a>
						</BoxButton>
						{this.state.statePage
							? <SignInFb
									emailSignIn={this.changeStatePage}
									nextPathname={nextPathname}
								/>
							: <SignIn nextPathname={nextPathname} />}
					</Container>
				</Wrapper>
			)
		} else {
			return (
				<Modal style={{ ...styles }}>
					<Container>
						<div style={{ margin: '0 auto 30px auto', width: '146px' }}>
							<LogoLink fill="#E2E2E2" />
						</div>
						<BoxButton>
							<a href="#" onClick={this.checkBack}>
								<BackButton style={{ float: 'left' }} />
							</a>
							<CloseButton style={{ float: 'right', paddingTop: '0px' }} />
						</BoxButton>
						{this.state.statePage
							? <SignInFb
									emailSignIn={this.changeStatePage}
									nextPathname={nextPathname}
								/>
							: <SignIn nextPathname={nextPathname} />}
					</Container>
				</Modal>
			)
		}
	}
}

export default SignInPage
