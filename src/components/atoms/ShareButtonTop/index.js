import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FlatButton from 'material-ui/FlatButton';

const styles = {
  btn (barTone, scrolling, hasCover) {
    return {
      float:'left',
      margin: '11px 0px',
      borderRadius: '20px',
      border: (barTone == 'light' && (scrolling || !hasCover)) ? '1px solid #222' : '1px solid #FFF',
      height: '34px',
      lineHeight: '28px',
      minWidth: '72px'
    }
  },
  labelStyle (barTone, scrolling, hasCover) {
    return {
      fontSize: '15px',
      color: (barTone == 'light' && (scrolling || !hasCover)) ? '#222' : '#FFF',
      textTransform: 'none',
      padding: '0px 0px 0px 0px'
    }
  },
  iconStyle (barTone, scrolling, hasCover) {
    return {
      fontSize: '11px',
      color: (barTone == 'light' && (scrolling || !hasCover)) ? '#222' : '#FFF',
      margin: '0px',
      padding: '3px 14px 0px 14px'
    }
  }
}

const label = (number, barTone, scrolling, hasCover) => {
  return (
    <span>
      <span style={{
        borderLeft: (barTone == 'light' && (scrolling || !hasCover)) ? '1px solid #222' : '1px solid #FFF',
        padding: '5px 14px 4px 14px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>{number}</span>
    </span>
  )
}

const ShareButtonTop = ({className, number, barTone, scrolling, style, onClick, hasCover}) => {
  return (
    <FlatButton
      onClick={onClick}
      label = {label(number, barTone, scrolling, hasCover)}
      labelStyle = {styles.labelStyle(barTone, scrolling, hasCover)}
      backgroundColor='rgba(0, 0, 0, 0)'
      icon = {<i className='fa fa-facebook' style={styles.iconStyle(barTone, scrolling, hasCover)} aria-hidden="true"></i>}
      style = {{...styles.btn(barTone, scrolling, hasCover), ...style}}
    />
  )
}

ShareButtonTop.contextTypes = {
	setting: PropTypes.object
};

export default ShareButtonTop
