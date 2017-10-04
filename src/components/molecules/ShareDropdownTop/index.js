import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FontIcon from 'material-ui/FontIcon'
import FlatButton from 'material-ui/FlatButton'
import {Dropdown,TwtShareButton, LineShareButton, InShareButton, LineIcon} from 'components'
import CopyToClipboard from 'react-copy-to-clipboard'
import config from '../../../config'
import { withRouter } from 'react-router'
import api from '../../../services/api' 
import utils from '../../../services/utils'


class ShareDropdownTop extends React.Component {
  static contextTypes = {
    setting: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      copied: false
    }
  }

  onStoryCopied = (val) => {
    //console.log('onStoryCopied', val)
    // get sid
    this.setState({copied: true})
    val = utils.getTrailingSid(val)
    //this.setState({copied: true})
    if(val!=null) api.incStoryInsight(val, 'share', 'share_dark')
  }

  render() {
    let {theme} = this.context.setting.publisher
    
    const buttonStyle = {
      color: theme.primaryColor,
      fontSize: '18px',
      float: 'left',
      marginTop: '10px',
      paddingLeft: '10px',
      width: '28px'
    }

    const LineIconStyle = {
        height: '28px',
        width: '28px',
        marginTop:'5px !important',
        paddingLeft: '10px',
        fill: theme.primaryColor,
    }

    const LineIconPosController = {
      marginLeft: '-18px',
      position: 'relative',
      top: '4px',
    }

    const LineIconTextPosController = {
      marginLeft: '18px',   
      position: 'relative',
      bottom: '4px',
    }

    let buttons = []
    buttons.push(<span><i className="fa fa-twitter" aria-hidden="true" style={buttonStyle}></i>Twitter</span>)
    buttons.push(<span><i className="fa fa-linkedin" aria-hidden="true" style={buttonStyle}></i>LinkedIn</span>)
    buttons.push(<span><LineIcon injectStyle = {LineIconPosController} width = {'28px'} height={'28px'} color = {theme.primaryColor} style = {LineIconStyle}/><span style={LineIconTextPosController}>Line</span></span>)
    buttons.push(<span><FontIcon className="material-icons" style={buttonStyle}>link</FontIcon>Copy Link</span>)

    const button = (
      <div>
        <TwtShareButton button={
          <FlatButton
            label={buttons[0]}
            labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
            style={{width: '140px', textAlign: 'left', display: 'inline-block'}}
          />
        } />
        <InShareButton button={
          <FlatButton
            label={buttons[1]}
            labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
            style={{width: '140px', textAlign: 'left', display: 'inline-block'}}
          />
        } />
        <LineShareButton button={
            <FlatButton
              label={buttons[2]}
              labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
              style={{width: '140px', textAlign: 'left', display: 'inline-block'}}
            />
          } />
        <CopyToClipboard text={config.FRONTURL+this.props.location.pathname} onCopy={this.onStoryCopied}>
          <FlatButton
            label={buttons[3]}
            labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
            style={{width: '140px', textAlign: 'left', display: 'inline-block'}}
          />
        </CopyToClipboard>
      </div>
    )

    return(
      <Dropdown
        button={this.props.children}
        float='right'
        marginMobile='0px 0px 0px -100px'
        maxWidth='140px'
      >
        {button}
      </Dropdown>
    )
  }
}

export default withRouter(ShareDropdownTop)