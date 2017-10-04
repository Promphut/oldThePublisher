import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { GradientOverlay } from 'components'

// const ImgLink = styled(Link)`
//   display:block;
//   background-position:center;
//   background-size:cover;
//   overflow:auto;
// `

const Filter = styled(GradientOverlay)`
  position:relative;
  display:block;
  overflow: ${props => (props.hidden ? 'hidden' : 'auto')};
  top:0;
  left:0;
  width:100%;
  height:100%;
`
const Gra = styled.div`
	display: block;
	overflow: auto;
	background: linear-gradient(135deg,  ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
	background-position: center;
	background-size: cover;
`
const GraLink = styled(Link)`
  display: block;
	overflow: auto;
	background: linear-gradient(135deg,  ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
	background-position: center;
	background-size: cover;
`

const BGImg = ({
	style,
	className,
	src,
	url,
	alt,
	opacity,
	children,
	gradient
}) => {
	//console.log('URL', url, match)
	//if(!src) console.log('SRC', src)
	style = {
		...style
	}
	if (src) style.backgroundImage = 'url(' + src + ')'

	if (url)
		return (
			<GraLink to={url || '#'} style={style} className={className} title={alt}>
				{opacity === -1
					? <div>
							{children}
						</div>
					: <Filter opacity={opacity} gradient={gradient}>
							{children}
						</Filter>}
			</GraLink>
		)
	else
		return (
			<Gra style={{...style}} className={className} title={alt}>
				{opacity === -1
					? <div>
							{children}
						</div>
					: <Filter opacity={opacity} gradient={gradient}>
							{children}
						</Filter>}
			</Gra>
		)
}

export default BGImg
