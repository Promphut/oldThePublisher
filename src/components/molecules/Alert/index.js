import React from 'react'
import styled, {css} from 'styled-components'
import Popover from 'material-ui/Popover'
import { PrimaryButton } from 'components'
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon'
import Menu from 'material-ui/Menu'
import CircularProgress from 'material-ui/CircularProgress';

const Box = styled.div`
  width:224px;
  border:1px solid ${props=>props.theme.primaryColor};
  padding:10px;
  background:white;
`

const Desc = styled.div`
  font-size:18px;
  color:#222;
  padding:10px;
`

const Inner = ({description,child,confirm,close,loading})=>{
  return (
    <Box>
      <IconButton onClick={close}>
        <FontIcon className='material-icons'>close</FontIcon> 
      </IconButton>
      {description && <Desc className='sans-font'>{description}</Desc>}
      {child || ''}
      <PrimaryButton label={!loading?'Confirm':''} onClick={confirm} style={{margin:'15px 0 15px 0'}}>
        {loading && <CircularProgress />}
      </PrimaryButton>
    </Box>
  )
}

const Alert = ({style,className,child,confirm,description,open,anchorEl,onRequestClose,loading}) => {
	return (
    <Popover 
    style={{...style}} 
    className={className}
    open={open}
    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
    targetOrigin={{horizontal: 'left', vertical: 'top'}}
    anchorEl={anchorEl}
    onRequestClose={onRequestClose}
    children={<Inner child={child} description={description} confirm={confirm} close={onRequestClose}></Inner>}
    >

    </Popover>     
	)
}

export default Alert;