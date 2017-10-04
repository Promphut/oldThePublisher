import React from 'react'
import styled, {css} from 'styled-components'
import Popover from 'material-ui/Popover'
import {PrimaryButton } from 'components'
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon'
import Menu from 'material-ui/Menu'

//children={<Inner child={child} description={description} confirm={confirm}></Inner>}

const EditMenu = ({style,className,child,confirm,description,open,anchorEl,onRequestClose, children}) => {
  return (
    <Popover
      style={{...style}} 
      className={className}
      open={open}
      anchorOrigin={{horizontal:"left",vertical:"center"}}
      targetOrigin={{horizontal:"left",vertical:"center"}}
      anchorEl={anchorEl}
      onRequestClose={onRequestClose}
    > 
     {children}
    </Popover>  
  )
}
	
export default EditMenu;