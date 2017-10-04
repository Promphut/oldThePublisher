import React from 'react'
import styled from 'styled-components'

/* Props:
	opacity e.g. 0.3
*/
const GradientOverlay = styled.div`
	background: -moz-linear-gradient(135deg,
		rgba(${props => (props.gradient == 'black' ? '0,0,0' : '202,130,172')}, ${props => props.opacity || 0.15}) 0%,
		rgba(${props => (props.gradient == 'black' ? '0,0,0' : '49,77,170')}, ${props => props.opacity || 0.15})
		100%);
	background: -webkit-linear-gradient(135deg,
		rgba(${props => (props.gradient == 'black' ? '0,0,0' : '202,130,172')}, ${props => props.opacity || 0.15}) 0%,
		rgba(${props => (props.gradient == 'black' ? '0,0,0' : '49,77,170')}, ${props => props.opacity || 0.15})
		100%);
	background: linear-gradient(135deg,
		rgba(${props => (props.gradient == 'black' ? '0,0,0' : '202,130,172')}, ${props => props.opacity || 0.15}) 0%,
		rgba(${props => (props.gradient == 'black' ? '0,0,0' : '49,77,170')}, ${props => props.opacity || 0.15})
		100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4dca82ac', endColorstr='#4d314daa',GradientType=1 );

	bottom:0;
	top:0;
	left:0;
	right:0;
	position:absolute;
	z-index:0;
`

export default GradientOverlay
