import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FontIcon from 'material-ui/FontIcon'
import FlatButton from 'material-ui/FlatButton'
import {Dropdown,TwtShareButton, FbShareButton, InShareButton, LineShareButton, LineIcon} from 'components'
import CopyToClipboard from 'react-copy-to-clipboard'
import api from '../../../services/api'
import config from '../../../config'
import utils from '../../../services/utils'

class ShareDropdown extends React.Component {
  static contextTypes = {
    setting: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      //copied: false,
      hover: -1
    }
  }

  onHover = (selected) => {
    this.setState({
      hover: selected
    })
  }

  onNotHover = () => {
    this.setState({
      hover: -1
    })
  }

  onStoryCopied = (val) => {
    //console.log('onStoryCopied', val)
    // get sid
    val = utils.getTrailingSid(val)
    //this.setState({copied: true})
    if(val!=null) api.incStoryInsight(val, 'share', 'share_dark')
  }

  render() {
    //console.log(this.props.url)
    let {theme} = this.context.setting.publisher
    const buttonStyle = {
      color: theme.primaryColor,
      fill: theme.primaryColor,
      fontSize: '18px',
      float: 'left',
      marginTop: '10px',
      paddingLeft: '10px',
      width: '28px',
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
    buttons.push(<span><i className="fa fa-facebook" aria-hidden="true" style={buttonStyle}></i>Share on Facebook</span>)
    buttons.push(<span><i className="fa fa-twitter" aria-hidden="true" style={buttonStyle}></i>Share on Twitter</span>)
    buttons.push(<span><i className="fa fa-linkedin" aria-hidden="true" style={buttonStyle}></i>Share on LinkedIn</span>)
    buttons.push(<span><LineIcon injectStyle = {LineIconPosController} width = {'28px'} height={'28px'} color = {theme.primaryColor} style = {LineIconStyle}/><span style={LineIconTextPosController}>Share on Line</span></span>)
    buttons.push(<span><FontIcon className="material-icons" style={buttonStyle}>link</FontIcon>Copy Link</span>)

    // for (let i = 0; i < buttons.length; i++){
      // button.push(
      //   <div key={i}>
      //     <FlatButton
      //       label={buttons[i]}
      //       labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
      //       style={{width: '130px', textAlign: 'left', display: 'inline-block'}}
      //       onTouchTap={() => this.select(i)}
      //       data-clipboard-text
      //     /><br/>
      //   </div>
      // )
    // }

    const button = (
      <div onMouseLeave={this.onNotHover}>
        <div onMouseEnter={() => this.onHover(0)}>
          <FbShareButton id= "dropdownFb" url={config.FRONTURL+this.props.url} button={
            <FlatButton
              label={buttons[0]}
              labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
              style={{width: '180px', textAlign: 'left', display: 'inline-block'}}
            />
          } />
          {/*<FlatButton
              label={buttons[0]}
              labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
              style={{width: '180px', textAlign: 'left', display: 'inline-block'}}
              onTouchTap={() => this.select('facebook')}
            />*/}
        </div>
        <div onMouseEnter={() => this.onHover(1)}>
          <TwtShareButton id= "dropdownTwt" url={config.FRONTURL+this.props.url} button={
            <FlatButton
              label={buttons[1]}
              labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
              style={{width: '180px', textAlign: 'left', display: 'inline-block'}}
            />
          } />
        </div>

        <div onMouseEnter={() => this.onHover(2)}>
          <InShareButton id= "dropdownIn" url={config.FRONTURL+this.props.url} button={
            <FlatButton
              label={buttons[2]}
              labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
              style={{width: '180px', textAlign: 'left', display: 'inline-block'}}
            />
          } />
        </div>

        <div onMouseEnter={() => this.onHover(3)} style={{marginTop:'-3px'}}>
          <LineShareButton id= "dropdownLine" url={config.FRONTURL+this.props.url} button={
            <FlatButton
              label={buttons[3]}
              labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
              style={{width: '180px', textAlign: 'left', display: 'inline-block'}}
            />
          } />
        </div>

        <div onMouseEnter={() => this.onHover(4)}>
          <CopyToClipboard id= "dropdownCopy" text={config.FRONTURL+this.props.url} onCopy={this.onStoryCopied}>
            <FlatButton
              label={buttons[4]}
              labelStyle={{fontWeight: 'bold', fontSize: '15px', color: theme.primaryColor, fontFamily:"'Nunito', 'Mitr'", textTransform:'none'}}
              style={{width: '180px', textAlign: 'left', display: 'inline-block'}}
            />
          </CopyToClipboard>
        </div>
      </div>
    )

    const buttonDropdown = (
      <FontIcon className="material-icons" style={{color:'#8f8f8f', fontSize: `${this.props.buttonSize}px`, paddingRight: utils.isMobile() ? '8px' : '0px'}}>
        keyboard_arrow_down
      </FontIcon>
    )

    return(
      <Dropdown id = {this.props.id} className={this.props.className} button={buttonDropdown} float='right' marginMobile='0px 0px 0px -160px' margin='0px 0px 0px -160px'>
        {button}
      </Dropdown>
    )
  }
}

export default ShareDropdown
