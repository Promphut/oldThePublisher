import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Stick } from 'components'
import FontIcon from 'material-ui/FontIcon'

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

	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
`

const Left = styled.div`
`

const Center = styled.div`
	text-align: center;
`

const Title = styled.div`
	font-family: 'Nunito', 'Mitr';
	font-size: 18px;
	margin-top: 18px;
`

class TopBarWithBack extends React.Component {
	static contextTypes = {
		setting: PropTypes.object
	}

	checkBack = e => {
		e.preventDefault()

		if (window.history.length <= 2) {
			this.props.history.push('/')
		} else {
			this.props.history.goBack()
		}
	}

	render() {
		let { theme } = this.context.setting.publisher
		const backStyle = {
			color: theme.barTone == 'light' ? '#222' : '#FFF',
			fontSize: '40px',
			position: 'absolute',
			top: '10px',
			left: '5px'
		}

		return (
			<Stick>
				<Container>
					<Left>
						<a href="#" onClick={this.checkBack}>
							<FontIcon className="material-icons" style={backStyle}>
								chevron_left
							</FontIcon>
						</a>
					</Left>

					<Center>
						<Title>{this.props.title}</Title>
					</Center>
				</Container>
			</Stick>
		)
	}
}

export default TopBarWithBack
