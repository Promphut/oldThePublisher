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
import AutoComplete from 'material-ui/AutoComplete';
import api from '../../../services/api'

const Text = styled.div`
  font-size:14px;
  color:#8f8f8f;
  display:inline;
  width:70px;
`

const List = styled(MenuItem)`
  height:40px;
  font-size:22px;
  &:hover{
    background-color:${props=> props.theme.primaryColor};
  }
`
const AutoCompleteBox = styled.div`
  display:flex;
  border:1px solid #c4c4c4;
  float:right;
  margin:30px;
  padding:5px 5px 5px 20px;
`

class Filter extends React.Component {
  static contextTypes = {
    setting: PropTypes.object
  }
  static defaultProps = {
    menuItem:[]
  }
  state = {
    value:'Title',
    editState:false,
    editWhere:{},
    open:false,
    searchText:'',
    dataSource:[],
    id:''
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

  handleUpdateInput = (searchText) => {
    this.setState({
      searchText: searchText,
    });
  }

  selectRequest = (sel,index) => {
    //console.log(sel)
    this.setState({id:sel.id})
  }

  onChangeFilter = (e, selected) => {
    //console.log(selected)
    this.setState({value:selected,searchText:''},()=>{
      if(selected=='Title'){
        this.setState({
          dataSource:[]
        })
      }else if(selected=='Writer'){
        api.getPublisherWriters().then((res)=>{
          //console.log(res)
          var data = []
          res.map((val,ind)=>{
            data[ind] = {value:val.display,id:val.id,text:val.display}
          })
          this.setState({dataSource:data})
        })
      }else if(selected=='Column'){
        api.getPublisherColumns().then((res)=>{
          //console.log(res)
          var data = []
          res.map((val,ind)=>{
            data[ind] = {value:val.name,id:val.id,text:val.name}
          })
          this.setState({dataSource:data})
        })
      }
    })

  }

  render(){
    var {style,className,children,labelStyle,editMenu,value,onChange,menuItem} = this.props
    var {value,editState,editWhere,open,active,focus,anchorEl,searchText,dataSource} = this.state
    var {theme} = this.context.setting.publisher
    var pmc = theme.primaryColor
    const styles = {
      label:{
        fontSize:'12px'
      },
      underline:{
        background:'none',
        border:'none'
      },
      selected:{
        color:theme.accentColor,
      },
      menuItem:{
        fontSize:'14px',
        color:'#8f8f8f'
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
    const dataSourceConfig = {text: 'text', value: 'value', id:'id'};

    return(
      <AutoCompleteBox style={{...style}} className={className}>
        <AutoComplete
          hintText={"Filter"}
          dataSource={dataSource}
          style={{border:'none',height:'30px',width:'170px'}}
          textFieldStyle={{border:'none',height:'30px'}}
          filter={AutoComplete.fuzzyFilter}
          onNewRequest={this.selectRequest}
          onUpdateInput={this.handleUpdateInput}
          openOnFocus={true}
          searchText={searchText}
          dataSourceConfig={dataSourceConfig}
          underlineShow={false}
          hintStyle={{top:'5'}}
        />
        <FlatButton 
          className="hoverIcon"
          onClick={this.togglePopover}
          labelPosition="before"
          style={{textAlign:'left',width:'70px',height:'30px',border:'none'}}>
          <div style={{position:'relative',top:'-3px'}}>
            <Text className='sans-font' style={{...labelStyle}} >{value}</Text>
            <FontIcon className='material-icons' style={{fontSize:'20px',color:'#8f8f8f',float:'right',top:'8px'}}>keyboard_arrow_down</FontIcon>
          </div>
          <Popover
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
          >
            <Menu 
              style={{width:'70px',left:'-20px'}}
              onChange={this.onChangeFilter}
              maxHeight={400}
              selectedMenuItemStyle={{...styles.selected}}
              menuItemStyle={{...styles.menuItem}}
              onItemTouchTap={this.onFocus}
              value={value}
            >
              <MenuItem value={'Title'}>Title</MenuItem>
              <MenuItem value={'Writer'}>Writer</MenuItem>
              <MenuItem value={'Column'}>Column</MenuItem>
            </Menu>
          </Popover>
        </FlatButton>
        <div style={{width:'1px',height:'30px',background:'#e2e2e2',margin:'0 5px'}}></div>
        <IconButton style={{width:'30px',height:'30px',padding:'0px'}} iconStyle={{color:'#8f8f8f'}} onClick={this.props.search}>
          <FontIcon className="material-icons" style={{fontSize:'20px',color:'#8f8f8f'}}>search</FontIcon>
        </IconButton>  
      </AutoCompleteBox>
    )
  }
}

export default Filter