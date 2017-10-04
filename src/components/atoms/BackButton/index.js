import React from 'react'
import styled from 'styled-components'
import FlatButton from 'material-ui/FlatButton';

let styles={
  btn:{
    //float:'left',
  },
  labelBtn:{
    color:'#E2E2E2',
    fontWeight:'bold'
  }
}

const BackButton = ({id,style,labelStyle,className})=>{
  return(
    <FlatButton
      id={id}
      className={'bakBTN '+className}
      label='Back'
      labelStyle={{...styles.labelBtn,...labelStyle}}
      labelPosition='after'
      style={{...styles.btn,...style}}
      icon={<i className="fa fa-chevron-left" style={{color:'#E2E2E2',...labelStyle}} aria-hidden="true"></i>}
    />
  )
}

export default BackButton