import React from 'react'
import styled from 'styled-components'
import FlatButton from 'material-ui/FlatButton';

const styles = {
  btn: {
    float:'left',
    margin: '20px 0px',
    borderRadius: '20px'
  },
  labelStyle: {
    fontSize: '15px',
    color: '#ffffff',
    textTransform: 'none'
  },
  iconStyle: {
    fontSize: '14px',
    color: '#ffffff',
    padding: '0px 0px 0px 5px'
  }
}

const label = (text, number) => {
  return (
    <span>
      {text}
      <span style={{
        borderLeft: '1px solid rgba(0, 0, 0, .1)',
        padding: '10px 0px 10px 6px',
        marginLeft: '8px'
      }}>{number}</span>
    </span>
  )
}

const ShareButton = ({className, number, color, style, onClick}) => {
  return (
    <FlatButton
      onClick={onClick}
      label = {label('Share', number)}
      labelStyle = {styles.labelStyle}
      backgroundColor={'rgb(' + color + ')'}
      hoverColor={'rgba(' + color + ', .8)'}
      icon = {<i className={className} style={styles.iconStyle} aria-hidden="true"></i>}
      style = {{...styles.btn, ...style}}
    />
  )
}

export default ShareButton
