import React from 'react'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'

import utils from '../../../services/utils'

const SocialButtonContainer = styled.div `
	display: flex;
	flex-direction: row;
	margin-bottom: 0px;
`

const SocialButton = styled.a `
	flex: 0;
	font-size: 20px;
  margin-right: 29px;
  cursor: ${props => props.enabled ? 'pointer' : 'default'};
  color: ${props =>
    utils.isMobile() ? 
    props.enabled && props.colorPack === 'light' ? '#F4F4F4' :
    props.enabled && props.colorPack === 'dark' ? '#8E8E8E' :
    !props.enabled && props.colorPack === 'light' ? '#ffffff' :
    !props.enabled && props.colorPack === 'dark' ? '#F4F4F4' : '#F4F4F4'
    :
    props.enabled ? '#8E8E8E' : '#F4F4F4'};
	text-decoration: none;
	opacity: ${props => !props.enabled && props.colorPack === 'light' ? '0.5' : '1'};

	&:last-child {
			margin-right: 0px;
	}

	&:hover {
    color: ${props => 
    !utils.isMobile() ? props.enabled? props.theme.accentColor: '#F4F4F4' :
    props.enabled && props.colorPack === 'light' ? '#F4F4F4' :
    props.enabled && props.colorPack === 'dark' ? '#8E8E8E' :
    !props.enabled && props.colorPack === 'light' ? '#ffffff' :
    !props.enabled && props.colorPack === 'dark' ? '#F4F4F4' : '#F4F4F4'};} !important;
	}
`

export default class UserSocialBar extends React.Component {

  render () {
    let { channels, colorPack } = this.props

    return (
      <SocialButtonContainer>
        {channels && 
        <div>
          <SocialButton colorPack = {colorPack} href = {!isEmpty(channels.fb) ? utils.getFbUrl(channels.fb): "#"} target="_blank" enabled={!isEmpty(channels.fb) ? true : false}>
            <i className="fa fa-facebook" aria-hidden="true" />
          </SocialButton>

          <SocialButton colorPack = {colorPack} href = {!isEmpty(channels.ig) ? utils.getIgUrl(channels.ig): "#"} target="_blank" enabled={!isEmpty(channels.ig) ? true : false}>
            <i className="fa fa-instagram" aria-hidden="true" />
          </SocialButton>

          <SocialButton colorPack = {colorPack} href = {!isEmpty(channels.twt) ? utils.getTwtUrl(channels.twt): "#"} target="_blank" enabled={!isEmpty(channels.twt) ? true : false}>
            <i className="fa fa-twitter" aria-hidden="true" />
          </SocialButton>

          <SocialButton colorPack = {colorPack} href = {!isEmpty(channels.yt) ? utils.getYtUrl(channels.yt): "#"} target="_blank" enabled={!isEmpty(channels.yt) ? true : false}>
            <i className="fa fa-youtube-play" aria-hidden="true" />
          </SocialButton>
        </div>
        }
      </SocialButtonContainer>
    )
  }
}
