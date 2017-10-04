import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {BGImg} from 'components'
import config from '../../../config'

const BG = styled(BGImg)`
	width:100%;
	height:350px;
	display:flex !important;
	align-items:center !important;
	justify-content:center !important;
@media (min-width: 768px) and (max-width: 992px) {
    height:200px;
  }
`
const Tagline = styled.div`
	font-size:20px;
  font-weight:normal;
	margin:0 auto 0 auto;
	width:600px;
	text-align:center;
	color:white;
@media (min-width: 768px) and (max-width: 992px) {
    width:350px;
  }
`
const Img = styled.img`
	width:749px;
	height:100px;
@media (min-width: 768px) and (max-width: 992px) {
    width:350px;
    height:36px;
  }
`
const BgWithLogo = ({data})=> {
  let pub = data
  var {theme} = data 
  return (
    <BG
      src={pub.cover && pub.cover.medium}
      opacity={-1}
      className="hidden-mob"
      alt={pub && pub.name}>
      <div>
        {theme.llogo!=config.BACKURL + '/imgs/brand_display.png'&&<Img alt={ (pub+'_logo') && (pub.name+'_logo')}src={theme.llogo} id='Largelogo'/>}
        <Tagline className="nunito-font">{pub ? pub.tagline:'NEXT EMPIRE'}</Tagline>
      </div>
    </BG>
  )
}

export default BgWithLogo
