import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { PrimaryButton, SecondaryButton, Alert } from 'components'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import AutoComplete from 'material-ui/AutoComplete'
import Chip from 'material-ui/Chip'
import api from '../../../services/api'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { findDOMNode as dom } from 'react-dom'
import reject from 'lodash/reject'
import filter from 'lodash/filter'

const Container = styled.div`
  width:100%;
  .textTitle{
    color:#C2C2C2;
    font-family:'PT Sas';
    font-size:17px;
  }
  .head{
    color:#C2C2C2;
    font-family:'Nunito';
    font-size:18px;
  }
`

const Flex = styled.div`
  display:flex;
  align-items: center;
  items-align: center;
  flex-flow: row wrap;
  margin: 80px;
`

const Header = styled.div`
	margin: 0;
	padding: 0;
  height: 80px;
	width: 100%;
  background: #F4F4F4;
  display: flex;
`

const Title2 = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  font-family: 'Nunito', 'Mitr';
  font-size: 22px;
  font-weight: bold;
  padding-left: 32px;
`

const Title = styled.div`
  flex:2 150px;
  max-width:150px;
  color:#C2C2C2;
  font-size:17px;
  padding-top:15px;
`

const Edit = styled.div`
  flex:6 480px;
  max-width:480px;
`

const AddTag1 = styled.div`
  color:#8F8F8F;
  font-size:16px;
  overflow:hidden;
  margin-top:20px;
  &:hover{
    cursor:pointer;
  }
`
const AddTag2 = styled.div`
  color:#8F8F8F;
  font-size:16px;
  overflow:hidden;
  margin-top:20px;
  &:hover{
    cursor:${props => (props.selected ? 'pointer' : 'not-allowed')};
  }
`

const style = {
	display: 'inline-block',
	margin: '16px 40px 16px 0',
	overflowY: 'auto',
	overflowX: 'hidden',
	width: '240px',
	height: '233px'
}

const Desc = styled.div`
  color:#C2C2C2;
  font-size:14px;
  font-style:italic;
`

const TextStatus = styled.div`
  color:${props => props.theme.primaryColor};
  font-size:15px;
  font-style:italic;
  float:left;
  margin:10px 20px 0 15px;
`

const Admin = styled.div`
  color:#8F8F8F;
  font-size:18px;
  display:inline;
  height:25px;
  margin:8px 0 0 10px;
  border-bottom:1px solid #8F8F8F;
  &:hover{
    cursor:pointer;
    text-decoration:underline;
    text-shadow: 0 0 1px #C2C2C2;
  }
`

// const dataSource3 = [
//   {textKey: 'Some Text', valueKey: 'someFirstValue'},
//   {textKey: 'Some Text', valueKey: 'someSecondValue'},
// ];

class PublisherPublishingSetting extends React.Component {
	state = {
		admins: [],
		adminToRemove: {},
		adminSearchText: '',
		alert: false,
		dialog: false,
		userToAdmin: [],
		selectedTag: '',
		autoState: false,
		tags: [],
		initTags: [],
		textStatus: 'Unsave',
		error: false,
		newTagName: ''
	}
	static contextTypes = {
		setting: PropTypes.object
	}

	deleteAdmin = () => {
		let { admins, adminToRemove } = this.state
		//const chipToDelete = admins.map((data, index) => data.id).indexOf(adminRemoveName.id);
		//admins.splice(chipToDelete, 1);
		admins = reject(admins, { value: adminToRemove.value })

		this.setState({ alert: false })

		api
			.removeAdmin(adminToRemove.value)
			.then(result => {
				this.setState({
					dialog: false,
					adminToRemove: {},
					admins
				})
			})
			.catch(err => {
				// this.setState({
				//   error: true,
				//   textStatus: 'Cannot remove this admin.'
				// })
			})
	}

	handleOpen = (e, admin) => {
		//console.log(admin)
		this.setState({
			alert: true,
			alertDesc: 'Are you sure to remove this person from admin role ?',
			alertConfirm: this.deleteAdmin,
			alertWhere: e.currentTarget,
			alertChild: '',
			adminToRemove: admin
		})
	}

	handleClose = () => {
		this.setState({ alert: false })
	}

	getAdmin = () => {
		api.getAdmins().then(admins => {
			admins = admins.map(admin => {
				return { text: admin.username, value: admin.id }
			})

			this.setState({ admins: admins })
		})
	}

	getTag = () => {
		api.getTags().then(res => {
			//console.log(res)
			this.setState({ tags: res, initTags: res })
			//console.log(res)
		})
	}

	addAdmin = (item, index) => {
		//console.log('addAdmin', item, index)
		if (typeof item === 'object') {
			api
				.addAdmin(parseInt(item.value))
				.then(result => {
					// set admins state
					let admins = this.state.admins.slice()
					admins.push(item)

					//console.log(dom(this.refs.text).searchText, dom(this.refs.text).value)
					this.setState({
						admins: admins,
						adminSearchText: ''
					})
				})
				.catch(err => {
					// this.setState({
					//   error: true,
					//   textStatus: 'Cannot add this admin.'
					// })
				})
		}
	}

	handleUpdateInput = keyword => {
		this.setState({ adminSearchText: keyword })

		let inp = keyword.split('').length, a = []
		//this.setState({userToAdmin:[text,text+text]})
		if (inp == 3) {
			api.getUsers(keyword).then(users => {
				users.map((user, index) => {
					a[index] = { text: user.username, value: user.id }
				})

				this.setState(
					{
						userToAdmin: a,
						autoState: true
					},
					() => {
						dom(this.refs.text).focus()
					}
				)
			})
		}
	}

	filterTags = (event, searchText) => {
		this.setState(
			{
				tags: filter(
					this.state.initTags,
					tag => tag.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
				)
			},
			() => {
				this.refs.searchText.focus()
			}
		)
	}

	changeItem = (event, menuItem, index) => {
		//console.log(menuItem.props.value)
		this.setState({
			selectedTag: menuItem.props.value
		})
	}

	newTag = () => {
		this.setState({ alert: false, newTagName: '' })
		api.addTag(this.state.newTagName).then(res => {
			this.getTag()
		})
	}

	removeTag = () => {
		this.setState({ alert: false, selectedTag: '' })
		//console.log(this.state.selectedTag)
		api.removeTag(this.state.selectedTag).then(res => {
			this.getTag()
		})
	}

	alertRemoveTag = e => {
		this.setState({
			alert: true,
			alertDesc: 'Are you sure to remove this tag ?',
			alertConfirm: this.removeTag,
			alertWhere: e.currentTarget,
			alertChild: ''
		})
	}

	alertNewTag = e => {
		this.setState({
			alert: true,
			alertDesc: '',
			alertConfirm: this.newTag,
			alertWhere: e.currentTarget,
			alertChild: (
				<div className="row">
					<TextField
						hintText="New Tag Name"
						value={this.state.value}
						onChange={this.changeTagName}
						style={{ width: '170px', margin: '10px 15px 0 15px' }}
					/>
				</div>
			)
		})
	}

	changeTagName = e => {
		this.setState({ newTagName: e.target.value })
	}

	componentWillMount() {
		this.getTag()
		this.getAdmin()
	}

	render() {
		let { theme } = this.context.setting.publisher
		let {
			alert,
			alertWhere,
			alertChild,
			alertDesc,
			alertConfirm,
			admins,
			textStatus,
			error,
			adminToRemove,
			userToAdmin,
			adminSearchText,
			selectedTag,
			autoState,
			tags
		} = this.state
		let tag = []

		for (let i = 0; i < tags.length; i++) {
			tag.push(
				<MenuItem key={i} value={tags[i]._id} primaryText={tags[i].name} />
			)
		}
		//console.log('userToAdmin', userToAdmin, admins)
		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.handleClose}
			/>,
			<FlatButton
				label="Confirm"
				secondary={true}
				onTouchTap={this.deleteAdmin}
			/>
		]

		return (
			<Container>
				<Header>
					<Title2>Publishing</Title2>
				</Header>
				<Alert
					open={alert}
					anchorEl={alertWhere}
					onRequestClose={this.handleClose}
					description={alertDesc}
					child={alertChild}
					confirm={alertConfirm}
				/>

				<Flex>
					<Title>
						<div className="sans-font">Allowed Tags</div>
					</Title>
					<Edit>
						<div className="row">
							<TextField
								hintText="Search Tags ..."
								onChange={this.filterTags}
								ref="searchText"
							/>
							<i
								className="fa  fa-search"
								style={{
									float: 'left',
									margin: '20px 10px 0 0',
									color: '#8f8f8f'
								}}
								aria-hidden="true"
							/>
						</div>
						<div className="row">
							<Paper style={style} className="col-7">
								<Menu
									selectedMenuItemStyle={{
										backgroundColor: theme.accentColor,
										color: 'white'
									}}
									value={selectedTag}
									onItemTouchTap={this.changeItem}
									disableAutoFocus={true}
									ref="menu">
									{tag}
								</Menu>
							</Paper>
							<div className="col-4">
								<AddTag1 onClick={this.alertNewTag}>
									<i
										className="fa fa-plus"
										style={{ float: 'left', margin: '20px 10px 0 0' }}
										aria-hidden="true"
									/>
									<div style={{ float: 'left', margin: '20px 20px 0 0' }}>
										New
									</div>
								</AddTag1>
								<AddTag2
									onClick={selectedTag != '' ? this.alertRemoveTag : () => {}}
									selected={selectedTag != '' ? true : false}>
									<i
										className="fa fa-trash"
										style={
											selectedTag != ''
												? { float: 'left', margin: '20px 10px 0 0' }
												: {
														float: 'left',
														margin: '20px 10px 0 0',
														opacity: 0.5
													}
										}
										aria-hidden="true"
									/>
									<div
										style={
											selectedTag != ''
												? { float: 'left', margin: '20px 20px 0 0' }
												: {
														float: 'left',
														margin: '20px 20px 0 0',
														opacity: 0.5
													}
										}>
										Delete Selected
									</div>
								</AddTag2>
							</div>
						</div>
						<Desc className="sans-font">
							Used by a writer to tag a story. Adding a relevant tag help discovering your publiser better on search website.
							{' '}
						</Desc>
					</Edit>
				</Flex>

				<Flex>
					<Title>
						<div className="sans-font">Admins</div>
					</Title>
					<Edit>
						<div className="row" style={{ marginTop: '15px' }}>
							{admins.map((admin, index) => (
								<Chip
									key={admin.value}
									onRequestDelete={e => this.handleOpen(e, admin)}
									style={{ margin: '4px' }}>
									{admin.text}
								</Chip>
							))}
							<AutoComplete
								key="editor1"
								hintText="Add an admin..."
								dataSource={userToAdmin}
								onUpdateInput={this.handleUpdateInput}
								openOnFocus={true}
								open={autoState}
								searchText={adminSearchText}
								menuCloseDelay={0}
								onNewRequest={this.addAdmin}
								ref="text"
								style={{ marginLeft: '10px', height: '32px' }}
							/>
						</div>
					</Edit>
				</Flex>
				{/*<div className='sans-font' style={{marginTop:'30px',overflow:'hidden'}}>
          <PrimaryButton label='Save' style={{float:'right',margin:'0 20px 0 0'}}/>
          <SecondaryButton label='Reset' style={{float:'right',margin:'0 20px 0 0'}}/>
          <TextStatus style={{color:error?'#D8000C':'#00B2B4',float:'right'}}>{this.state.textStatus}</TextStatus>
        </div>*/}
			</Container>
		)
	}
}

export default PublisherPublishingSetting
