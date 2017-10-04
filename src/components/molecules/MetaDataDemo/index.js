import React from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'

const Container = styled.div`
  padding:20px;
  border:1px solid #c4c4c4;
  width:100%;
`

const Title = styled.h4`
  font-size:20px;
  margin:0px 0 10px 0;
  color:#1A0DAB;
`

const Desc = styled.div`
  font-size:18px;
  color:#545454;
`

const Url = styled.div`
  font-size:18px;
  margin:0px 0 5px 0;
  color:#006621;
`

const MetaDataDemo = ({style, className, title, description, keyword, tagline}) => {
	return (
  	<Container style={{...style}} className={className+' sans-font'}>
      <Title className='sans-font'>{title || ''} - {tagline || ''}</Title>
      {window && window.location && <Url className='sans-font'>{window.location.host}</Url>}
      <Desc className='sans-font'>{description || ''} {keyword || ''}</Desc>
    </Container>
	)
}

MetaDataDemo.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  keyword: PropTypes.string,
  tagline: PropTypes.string
}

export default MetaDataDemo;
