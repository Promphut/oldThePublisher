import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import {BoxMenu,EditMenu,MenuList} from 'components'
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'

const Text = styled.div`
  font-size:22px;
  color:#222;
  display:inline;
`

const List = styled(MenuItem)`
  height:60px;
  font-size:22px;
  &:hover{
    background-color:${props=> props.theme.primaryColor};
  }
`

class DropdownWithIcon extends React.Component {
  static contextTypes = {
    setting: PropTypes.object
  }
  constructor(props) {
    super(props)

    this.state = {
      value:props.value||'',
      editState:false,
      editWhere:{},
      open:false,
      menuItem:props.menuItem||[]
    }
  }

  handleChange = (e,int,val) => {
    this.setState({value:val})
  }

  handleRequestClose = () => {
    this.setState({
      open:false
    })
  }

  togglePopover = (e) => {
    this.setState({
      open:true,
      anchorEl:e.currentTarget
    })
  }

  // selected(e,val){
  //   //console.log(val)
  //   this.setState({value:val,open:false})
  //   //this.setState({value})
  // },

  onFocus = (e,item,ind) => {
    this.setState({open:false})
  }

  closeEdit = () => {
    this.setState({editState:false})
  }

  openEdit = (e) => {
    this.setState({editState:true,editWhere:e.currentTarget})
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.value!=this.props.value){
      this.setState({value:nextProps.value})
    }
    if(nextProps.menuItem!=this.props.menuItem){
      this.setState({menuItem:nextProps.menuItem})
    }
  }

  render(){
    let {style,className,children,labelStyle,editMenu,onChange} = this.props
    let {value,editState,editWhere,open,active,focus,anchorEl,menuItem} = this.state
    let {theme} = this.context.setting.publisher
    let pmc = theme.primaryColor
    
    const styles = {
      label:{
        fontSize:'30px'
      },
      underline:{
        background:'none',
        border:'none'
      },
      selected:{
        backgroundColor:theme.accentColor,
        color:'#ffffff',
        fill:'#ffffff'
      },
      menuItem:{
        fontSize:'22px',
        padding:'8px 40px 8px 15px',
      },
      newColumn:{
        color:pmc,
        fontWeight:'bold'
      },
      showInactive:{
        textDecoration:'underline',
        color:'#8f8f8f'
      }
    }

    return(
        <div className='row'>
          <FlatButton 
            className="hoverIcon"
            onClick={this.togglePopover}
            labelPosition="before"
            labelStyle={{fontSize:'22px'}}
            style={{textAlign:'left', paddingLeft: '30px', width:'330px',height:'60px',border:open || editState ? '1px solid #e2e2e2' : 'none'}}>
            <div>
              <Text className='nunito-font' style={{...labelStyle}} >{menuItem && menuItem.map((data, index) => {
                if(data.value==value){
                  return data.text
                }
                })}</Text>
              <FontIcon className='material-icons' style={{fontSize:'30px',color:'#8f8f8f',float:'right',top:'8px'}}>keyboard_arrow_down</FontIcon>
            </div>
            <Popover
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleRequestClose}
            >
              <Menu 
                style={{width:'300px'}}
                onChange={onChange}
                maxHeight={400}
                selectedMenuItemStyle={{...styles.selected}}
                menuItemStyle={{...styles.menuItem}}
                onItemTouchTap={this.onFocus}
                value={value}
              >
                {menuItem && menuItem.map((data,index)=>(
                  <MenuItem value={data.value} key={index}>{data.text}</MenuItem>
                ))}
              </Menu>
            </Popover>
          </FlatButton>
          <IconButton
            className='hoverIcon'
            style={{border:open||editState?'1px solid #e2e2e2':'none',width:'60px',height:'60px'}}
            iconStyle={{color:'#8f8f8f'}}
            onClick={this.openEdit}
          > 
            <FontIcon className='material-icons'>settings</FontIcon>
            <EditMenu
              open={editState}
              anchorEl={editWhere}
              onRequestClose={this.closeEdit}
              >
              <BoxMenu>
                {editMenu||''}
              </BoxMenu>
            </EditMenu>
          </IconButton>
        </div>
    )
  }
}

export default DropdownWithIcon