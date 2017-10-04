import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

const SecondaryButton = (props, context) => {
	let opt, defaultStyle;
	let {theme} = context.setting.publisher
	
	if(props.size==='large'){
		// default is medium size
		opt = {
			className: 'secondary-btn secondary-large-btn',
			label: props.label,
			labelColor: theme.accentColor,
			onClick:props.onClick,
			type:props.type,
			labelPosition:props.labelPosition,
			rippleStyle:{borderRadius: '24px'},
			overlayStyle:{borderRadius: '24px'},
			labelStyle: {fontWeight:'bold', fontSize:18, top:-2, fontFamily:"Nunito Mitr", ...props.labelStyle},
			style: {borderRadius:'24px', height:'48px', lineHeight:'48px', background:'none', boxShadow:'none', ...props.style},
	    buttonStyle: {borderRadius: '24px', background: 'none', border:'2px solid '+theme.accentColor, padding:'0 5px', ...props.buttonStyle}
		}

		defaultStyle = {
			icon: {
				color: theme.accentColor,
				margin:'-8px 0px 0 15px',
				fontSize: '18px',
				width: 18
			},
			fontIcon: {
				fontSize:"22px",
				marginTop:-8
			}
		}
	} else if(props.size==='small'){
		opt = {
			className: 'secondary-btn secondary-small-btn',
			label: props.label,
			labelColor: theme.accentColor,
			labelPosition:props.labelPosition,
			onClick:props.onClick,
			type:props.type,
			rippleStyle:{borderRadius:'17px'},
			overlayStyle:{borderRadius:'17px'},
			labelStyle: {fontWeight:'bold', fontSize:15, top:-2, fontFamily:"'Nunito', 'Mitr'", ...props.labelStyle},
			style: {borderRadius:'17px', height:'35px', lineHeight:'35px', background:'none', boxShadow:'none', ...props.style},
	    buttonStyle: {borderRadius: '17px', background: 'none', border:'2px solid '+theme.accentColor, padding:'0', ...props.buttonStyle}
		}

		defaultStyle = {
			icon: {
				color: theme.accentColor,
				margin:'-4px 0px 0 14px',
				fontSize: '13px',
				width: 13
			},
			fontIcon: {
				fontSize:"16px",
				marginTop:-5
			}
		}
	} else {
		// default is medium size
		opt = {
			className: 'secondary-btn',
			label: props.label,
			labelColor: props.labelColor||theme.accentColor,
			onClick:props.onClick,
			labelPosition:props.labelPosition,
			type:props.type,
			overlayStyle:{borderRadius: '20px'},
			rippleStyle:{borderRadius: '20px'},
			labelStyle: {fontWeight:'bold', fontSize:15, top:-2, fontFamily:"'Nunito', 'Mitr'", ...props.labelStyle},
			style: {borderRadius:'20px', height:'40px', lineHeight:'40px', background:'none', boxShadow:'none', ...props.style},
	    buttonStyle: {borderRadius: '20px', background: 'none', border:'2px solid '+theme.accentColor, padding:'0 2px', ...props.buttonStyle}
		}

		defaultStyle = {
			icon: {
				color: theme.accentColor,
				margin:'-6px 0px 0 15px',
				fontSize: '15px',
				width: 15
			},
			fontIcon: {
				fontSize:"18px",
				marginTop:-6
			}
		}
	}

	if(props.iconName) {
		opt.icon = <FontIcon className="material-icons" style={defaultStyle.fontIcon}>{props.iconName}</FontIcon>
	} else if(props.icon) {
		// Create react element from inputted icon, and copy all its props
		let newProps = {...props.icon.props, style:{...defaultStyle.icon ,...props.icon.props.style}}
		opt.icon = React.createElement('i', newProps, props.icon.children)
	}

	return React.createElement(RaisedButton, opt, null)
}

SecondaryButton.contextTypes = {
	setting: PropTypes.object
}

export default SecondaryButton
