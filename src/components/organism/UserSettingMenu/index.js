import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {PrimaryButton,SecondaryButton} from 'components'
import {List, ListItem, makeSelectable} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon'
import {Link} from 'react-router-dom'
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar'
import { withRouter } from 'react-router'

let styles = {
  list:{
    color:'#ffffff'
  },
  listItem:{
    padding:'20px',
    color:"#ffffff",
    fontWeight:'bold'
  }
}

const User = styled(Link)`
  padding-left: 20px;
  &:hover { color: white; }
`

const Card = styled.div`
  display: flex;
  align-items: center;
  padding: 30px 30px 30px 30px;
  font-size: 20px;

  & > * {
    vertical-align: top;
    display: inline-block;
    color: white;
    margin: 0;
  }
`

const Item = styled(ListItem)`
  padding: 20px;
  color: white;

  & div div {
    font-family: 'Nunito', 'Mitr', sans-serif;
    font-size: 17px;
    font-weight: bold;
    padding-left: 10px;
  }
`

const SelectableList = makeSelectable(List);

class UserSettingMenu extends React.Component {
  static propTypes = {
    user: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedIndex: props.pathname
    }
  }

  changePath = (path) => {
    this.props.history.push(path)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps!=this.props){
      this.setState({
        selectedIndex: nextProps.pathname,
      });
    }
  }

  render(){
    let {display, pic, url} = this.props.user

    return (
      <div>
        <Card>
          {pic && <Avatar src={pic.medium} style={{marginTop:'12px'}} size={50}/>}
          {display && <User to={url}>{display}</User>}
        </Card>

        <SelectableList value={this.state.selectedIndex} style={{padding:1}}>
          <Divider />
          <ListItem style={{...styles.listItem, padding:'35px 20px 35px 20px'}} onClick={()=>this.changePath('/me/stories')} value='/me/stories' primaryText="My Stories" leftIcon={<FontIcon className="material-icons" style={{color:'white'}}>description</FontIcon>} />
          <Divider />
          <ListItem style={{...styles.listItem}} onClick={()=>this.changePath('/me/settings')} value='/me/settings' primaryText="Profile" leftIcon={<FontIcon className="material-icons" style={{color:'white'}}>person</FontIcon>} />
          <ListItem style={{...styles.listItem}} onClick={()=>this.changePath('/me/settings/account')} value='/me/settings/account' primaryText="Account" leftIcon={<FontIcon className="material-icons" style={{color:'white'}}>settings</FontIcon>} />
        </SelectableList>
      </div>
    )
  }
}

export default withRouter(UserSettingMenu)
