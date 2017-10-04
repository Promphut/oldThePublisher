import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'
import {LogoLink} from 'components'

const Wrapper = styled.div`
	background: #F4F4F4;
	width: 100vw;
	height: 100vh;
	padding: 17px;

	a {
		color: ${props=>props.theme.primaryColor};

		&:hover {
			color: #999;
		}
	}
`

const Center = styled.div`
	background: #FFF;
	border: 2px dashed #D1D1D1;
	text-align: center;
	margin: 20vh auto;
	height: 400px;
	box-shadow: 0px 35px 42px -35px #C2C2C2;
`

const ErrorNumber = styled.div`
	margin-top: ${props => props.smallSize ? '40px' : '10px'};
	font-size: ${props => props.smallSize ? '48px' : '128px'};
	font-weight: bold;
	font-family: 'Nunito', 'Mitr';

  background: -webkit-linear-gradient(${props=>props.theme.primaryColor},${props=>props.theme.primaryColor} 30%, #CEF1B7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

	@media (min-width: 1388px) {
  	margin-top: ${props => props.smallSize ? '80px' : '10px'};
		font-size: ${props => props.smallSize ? '60px' : '128px'};
	}
`

const ErrorText = styled.div`
	margin-top: 18px;
	font-size: 1.8rem;
	font-family: 'Nunito', 'Mitr';

	@media (max-width: 480px) {
		font-size: 1.4rem;
	}
`

let buttonStyle = {
	marginTop: '45px',
	borderRadius: '20px',
	boxShadow: '0px 3px 0px 0px #008687'
}

let buttonLabelStyle = {
	textTransform: 'none',
	fontSize: '1.2rem',
	fontFamily: "'Nunito', 'Mitr'",
	color: '#FFF',
	margin: '0px 10px 0px 5px'
}

const ErrorAndNotFound = ({style, smallSize, title, children}, context) => {
	let {theme} = context.setting.publisher

    return (
		<Wrapper style={style}>
			<LogoLink to="/" />

			<Center className="col-sm-10 col-md-6">
				<ErrorNumber smallSize={smallSize}>
					{title}
				</ErrorNumber>
				<ErrorText>
					{children}
				</ErrorText>
  				<a href="/">
					<FlatButton
						backgroundColor={theme.accentColor} 
						label="Go Home"
						labelPosition="before"
						labelStyle={buttonLabelStyle}
						style={buttonStyle}
						hoverColor={theme.accentColor}
						icon={
	            			<FontIcon
								className="material-icons"
								style={{color: '#FFF'}}
							>
				            	chevron_right
				            </FontIcon>
	          			}
					/>
			  </a>
			</Center>
		</Wrapper>
    )
}

ErrorAndNotFound.contextTypes = {
	setting: PropTypes.object
};


export default ErrorAndNotFound;
