import React from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import {GradientOverlay} from 'components'

const Img = styled.div`
  display:block;
  background-position:center;
  background-size:cover;
  overflow:auto;
`

const Filter = styled(GradientOverlay)`
  position:relative;
  display:block;
  overflow:auto;
  top:0;
  left:0;
  width:100%;
  height:100%;
`

const OverlayImg = ({style,className,src,alt,opacity,child}) => {
	return (
			<Img style={{...style,backgroundImage:'url('+src+')'}}
        className={className} alt={alt}>
        <Filter opacity={opacity} >
          {child}
        </Filter>
      </Img>
	)
}

// OverlayImg.propTypes = {
// 	// Mandatory
// 	src: PropTypes.string.isRequired,

// 	// Non mandatory
// 	style: PropTypes.object,
// 	orientedBy: PropTypes.string,
// 	imgStyle: PropTypes.object,
// 	opacity: PropTypes.number
// }

export default OverlayImg;
