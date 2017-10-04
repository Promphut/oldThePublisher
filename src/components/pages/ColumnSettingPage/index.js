import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
	PrimaryButton,
	SecondaryButton,
	UploadPicture,
	DropdownWithIcon,
	MenuList,
	Alert
} from 'components'
import TextField from 'material-ui/TextField'
import Chip from 'material-ui/Chip'
import AutoComplete from 'material-ui/AutoComplete'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { findDOMNode as dom } from 'react-dom'
import cloneDeep from 'lodash/cloneDeep'
import reject from 'lodash/reject'
import api from '../../../services/api'
import utils from '../../../services/utils'
import config from '../../../config'
import Snackbar from 'material-ui/Snackbar'
import _ from 'lodash'

const Div = styled.div`
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
const Container = styled.form`
  width:100%;
  padding:40px;
  border-bottom:1px solid #E2E2E2;
`

const Flex = styled.div`
  display:flex;
  items-align:center;
  flex-flow: row wrap;
  margin:50px 0 0 50px;
`

const Title = styled.div`
  flex:2 150px;
  max-width:150px;
  color:#C2C2C2;
  font-size:17px;
  padding-top:15px;
`

const Edit = styled.div`
  flex:6 450px;
  max-width:450px;
`

const Social = styled.div`
  color:#8F8F8F;
  font-size:19px;
  overflow:hidden;
`

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
  margin:10px 0 0 15px;
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

const Divider = styled.div`
  width:100%;
  height:1px;
  background-color:#E2E2E2;
  margin:40px 0 40px 0;
`
/*const dataSource3 = [
  {textKey: 'Some Text', valueKey: 'someFirstValue'},
  {textKey: 'Some Text', valueKey: 'someSecondValue'},
];
*/
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

class ColumnSettingPage extends React.Component {
	state = {
		user: {},
		column: {
			name: '',
			url: '',
			desc: '',
			cover: {
				medium: ''
			},
			parent: ''
		},

		cover: {
			medium: ''
		},
		dialogText: '',

		parent: [],
		parentAutoComplete: [],
		parentSearchText: '',

		writers: [],
		writersAutoComplete: [],
		writerToRemove: {},
		writerSearchText: '',

		editors: [],
		editorsAutoComplete: [],
		editorToRemove: {},
		editorSearchText: '',

		switchTo: '',

		textStatus: '',
		error: false,
		dialog: false,
		errText: '',
		descText: '',
		alert: false,
		alertConfirm: function() {},
		columnArray: [],
		snackbar: false,
		snackbarMS: '',
		selectColumn: null
	}

	static contextTypes = {
		setting: PropTypes.object
	}

	getEditors = () => {
		let cid = this.state.selectColumn
		if (cid == null) return

		api.getEditors(cid).then(editors => {
			editors = editors.map(editor => {
				return { text: editor.username, value: editor.id }
			})

			this.setState({ editors: editors })
		})
	}

	getWriters = () => {
		let cid = this.state.selectColumn
		if (cid == null) return

		api.getColumnWriters(cid).then(writers => {
			writers = writers.map(writer => {
				return { text: writer.username, value: writer.id }
			})

			this.setState({ writers: writers })
		})
	}

	getColumn = () => {
		let cid = this.state.selectColumn
		if (cid == null) return

		api.getColumn(cid).then(col => {
			// console.log(col)
			this.column = col
			this.setState({ column: col })

			this.getParent(col.parent)
		})
	}

	getParent = cid => {
		if (cid && cid !== null) {
			api
				.getColumn(cid)
				.then(parentCol => {
					let column = this.state.column
					column.parent = parentCol._id

					this.setState({
						column,
						parentSearchText: parentCol.name
					})
				})
				.catch(err => {
					this.setState({ parentSearchText: '' })
				})
		} else {
			let column = this.state.column
			column.parent = null
			this.setState({
				column,
				parentSearchText: ''
			})
		}
	}

	deleteWriter = () => {
		let cid = this.state.selectColumn
		if (cid == null) return

		let { writers, writerToRemove } = this.state
		writers = reject(writers, { value: writerToRemove.value })

		api.removeWriter(writerToRemove.value, cid).then(result => {
			this.setState({
				dialog: false,
				writerToRemove: {},
				writers
			})
		})
	}

	deleteEditor = () => {
		let cid = this.state.selectColumn
		if (cid == null) return

		let { editors, editorToRemove } = this.state
		editors = reject(editors, { value: editorToRemove.value })

		api.removeEditor(editorToRemove.value, cid).then(result => {
			this.setState({
				dialog: false,
				editorToRemove: {},
				editors
			})
		})
	}

	handleClose = e => {
		this.setState({ dialog: false })
	}

	confirmDeleteEditor = editorToRemove => {
		this.setState({
			dialog: true,
			dialogText: 'Are you sure to delete ' + editorToRemove.text + ' ?',
			switchTo: 'editor',
			editorToRemove
		})
	}

	confirmDeleteWriter = writerToRemove => {
		this.setState({
			dialog: true,
			dialogText: 'Are you sure to delete ' + writerToRemove.text + ' ?',
			switchTo: 'writer',
			writerToRemove
		})
	}

	updateColumn = e => {
		e.preventDefault()

		let cid = this.state.selectColumn
		if (cid == null) return

		let data = {}
		// let input = dom(this.refs.columnForm).getElementsByTagName("input");
		// input = [].slice.call(input);
		// input.forEach((field, index) => {
		//   data[field.name] = field.value;
		// });
		// data["shortDesc"] = document.getElementById("shortDesc").value;

		let column = this.state.column
		if (column.parent === -1) {
			column.parent = null
		}
		api
			.updateColumn(cid, column)
			.then(col => {
				this.setState({
					textStatus: 'Saved successfully',
					error: false
				})
			})
			.catch(err => {
				this.setState({
					textStatus: err.message,
					error: true
				})
			})
	}

	fetchParentAutoComplete = keyword => {
		this.setState({ parentSearchText: keyword })

		let inp = keyword.split('').length, a = []
		api.getColumns().then(columns => {
			a[0] = { text: 'No column', value: -1 }
			columns.map((column, index) => {
				if (
					column._id !== this.state.selectColumn &&
					column.parent == null
				)
					a[index + 1] = { text: column.name, value: column._id }
			})

			this.setState({
				parentAutoComplete: a
			})
		})
	}

	fetchEditorsAutoComplete = keyword => {
		this.setState({ editorSearchText: keyword })

		let inp = keyword.split('').length, a = []
		//this.setState({userToAdmin:[text,text+text]})
		if (inp == 3) {
			api.getUsers(keyword).then(users => {
				users.map((user, index) => {
					a[index] = { text: user.username, value: user.id }
				})

				this.setState({
					editorsAutoComplete: a
				})
			})
		}
	}

	fetchWritersAutoComplete = keyword => {
		this.setState({ writerSearchText: keyword })

		let inp = keyword.split('').length, a = []
		//this.setState({userToAdmin:[text,text+text]})
		if (inp == 3) {
			api.getUsers(keyword).then(users => {
				users.map((user, index) => {
					a[index] = { text: user.username, value: user.id }
				})

				this.setState({
					writersAutoComplete: a
				})
			})
		}
	}

	addParent = (item, index) => {
		let cid = this.state.column._id
		if (cid == null) return

		if (typeof item === 'object') {
			const column = this.state.column
			column.parent = parseInt(item.value)
			this.setState({ column })
		}
	}

	addEditor = (item, index) => {
		let cid = this.state.column._id
		if (cid == null) return

		if (typeof item === 'object') {
			api
				.addEditorToColumn(parseInt(item.value), cid)
				.then(result => {
					let editors = this.state.editors.slice()
					editors.push(item)

					this.setState({
						editors: editors,
						editorSearchText: ''
					})
				})
				.catch(err => {})
		}
	}

	addWriter = (item, index) => {
		let cid = this.state.column._id
		if (cid == null) return

		if (typeof item === 'object') {
			api
				.addWriterToColumn(parseInt(item.value), cid)
				.then(result => {
					let writers = this.state.writers.slice()
					writers.push(item)

					this.setState({
						writers: writers,
						writerSearchText: ''
					})
				})
				.catch(err => {})
		}
	}

	editDesc = e => {
		var val = e.target.value.split('')
		if (val.length >= 140) {
			this.setState({
				errText: 'Maximun characters'
			})
			return
		} else {
			this.setState({
				descText: e.target.value,
				errText: ''
			})
		}
	}

	resetDate = e => {
		if (e) e.preventDefault()

		this.setState({
			column: this.column
		})
	}

	columnChanged = e => {
		const name = e.target.name
		if (name == 'shortDesc') {
			var val = e.target.value.split('')
			if (val.length >= 140) {
				this.setState({
					errText: 'Maximun characters'
				})
				return
			} else {
				this.setState({
					errText: ''
				})
			}
		}
		let col = cloneDeep(this.state.column)
		utils.dotToObj(col, name, e.target.value)
		this.setState({
			column: col
		})
	}

	removeColumn = () => {
		let cid = this.state.selectColumn

		api.removeColumn(cid).then(res => {
			this.getPublisherColumns()
			this.setState({
				alert: false,
				alertDesc: '',
				snackbar: true,
				snackbarMS: 'Delete Column Complete !'
			})
		})
	}

	alertDelete = e => {
		this.setState({
			alert: true,
			alertWhere: e.currentTarget,
			alertChild: '',
			alertDesc: 'Delete is permanent. Are you sure?',
			alertConfirm: this.removeColumn
		})
	}

	alertNew = e => {
		this.setState({
			alert: true,
			alertWhere: e.currentTarget,
			alertChild: (
				<div className="row">
					<TextField
						hintText="Column Name"
						id="newColName"
						style={{ width: '170px', margin: '10px 15px 0 15px' }}
					/>
				</div>
			),
			alertConfirm: this.newColumn
		})
	}

	newColumn = () => {
		this.setState({ alertLoading: true })

		let column = {
			name: document.getElementById('newColName').value,
			shortDesc: ''
		}

		api.newColumn(column).then(col => {
			this.getPublisherColumns()
			this.setState({
				alert: false,
				alertDesc: '',
				snackbar: true,
				snackbarMS: 'Added New Column Complete !'
			})
		})
	}

	handleRequestClose = () => {
		this.setState({
			alert: false,
			alertDesc: ''
		})
	}

	changeColumn = (e, val) => {
		//console.log(val)
		this.setState({ selectColumn: val }, () => {
			this.getWriters()
			this.getEditors()
			this.getColumn()
		})
	}

	getPublisherColumns = () => {
		api.getPublisherColumns().then(col => {
			var c = []
			col.map((val, index) => {
				c[index] = { text: val.name, value: val._id }
			})

			this.setState({ columnArray: c })
		})
	}

	closeSnackbar = () => {
		this.setState({ snackbar: false })
	}

	componentDidMount() {
		this.getPublisherColumns()
	}

	render() {
		let col = this.state.column
		//console.log(col);
		let { theme } = this.context.setting.publisher
		let {
			descText,
			errText,
			dialog,
			error,
			textStatus,
			dialogText,
			cover,
			parent,
			writers,
			editors,
			switchTo,
			parentAutoComplete,
			writersAutoComplete,
			editorsAutoComplete,
			parentSearchText,
			writerSearchText,
			editorSearchText,
			alert,
			alertDesc,
			alertWhere,
			alertChild,
			alertConfirm,
			selectColumn,
			columnArray,
			snackbar,
			snackbarMS
		} = this.state
		//console.log(col)
		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.handleClose}
			/>,
			<FlatButton
				label="Confirm"
				secondary={true}
				onTouchTap={
					switchTo == 'writer' ? this.deleteWriter : this.deleteEditor
				}
			/>
		]

		return (
			<Div>
				<Header>
					<Title2>Columns</Title2>
				</Header>
				<Container onSubmit={this.updateColumn} ref="columnForm">
					<Dialog
						actions={actions}
						modal={false}
						contentStyle={{ width: '600px' }}
						open={dialog}
						onRequestClose={this.handleClose}>
						<p style={{ fontSize: '20px' }}>{dialogText}</p>
					</Dialog>
					<Snackbar
						open={snackbar}
						message={snackbarMS}
						autoHideDuration={2000}
						onRequestClose={this.closeSnackbar}
						style={{ backgroundColor: theme.primaryColor }}
						bodyStyle={{
							backgroundColor: theme.primaryColor,
							textAlign: 'center'
						}}
						className="nunito-font"
					/>
					<Alert
						open={alert}
						anchorEl={alertWhere}
						onRequestClose={this.handleRequestClose}
						description={alertDesc}
						child={alertChild}
						confirm={alertConfirm}
					/>
					<DropdownWithIcon
						onChange={this.changeColumn}
						menuItem={!columnArray ? null : columnArray}
						value={selectColumn}
						editMenu={[
							<MenuList onClick={this.alertDelete} key="delete">
								Delete
							</MenuList>,
							<MenuList onClick={this.alertNew} key="new">
								+ New Column
							</MenuList>
						]}
					/>
					<Flex>
						<Title>
							<div className="sans-font">Name</div>
						</Title>
						<Edit>
							<TextField
								id="name"
								name="name"
								value={col.name}
								onChange={this.columnChanged}
							/>
						</Edit>
					</Flex>
					<Flex>
						<Title>
							<div className="sans-font">URL</div>
						</Title>
						<Edit>
							<Social className="sans-font">
								<TextField
									style={{ float: 'left', margin: '5px 0 0 0' }}
									id="url"
									name="url"
									value={col.url}
									onChange={this.columnChanged}
								/>
							</Social>
							<Desc className="sans-font">
								Note that changing slug will affect the whole URL structure of this publisher, meaning that previously used URLs won't be able to be accessed anymore. Are you sure to edit?
							</Desc>
						</Edit>
					</Flex>
					<Flex>
						<Title>
							<div className="sans-font">Description</div>
						</Title>
						<Edit>
							<TextField
								multiLine={true}
								fullWidth={true}
								floatingLabelText="140 characters"
								floatingLabelFixed={true}
								rows={3}
								rowsMax={6}
								errorText={errText}
								id="shortDesc"
								name="shortDesc"
								value={col.shortDesc}
								onChange={this.columnChanged}
							/>
						</Edit>
					</Flex>
					<Flex>
						<Title>
							<div className="sans-font">Cover picture</div>
						</Title>
						<Edit>
							<UploadPicture
								src={col.cover && col.cover.medium}
								path={
									'/publishers/' +
										config.PID +
										'/columns/' +
										this.state.selectColumn +
										'/cover'
								}
								ratio={1920 / 340}
								size="1920x340"
								height={90}
								width={480}
								type="cover"
							/>
						</Edit>
					</Flex>
					<Flex>
						<Title>
							<div className="sans-font">Icon</div>
						</Title>
						<Edit>
							<UploadPicture
								src={col.icon}
								path={
									'/publishers/' +
										config.PID +
										'/columns/' +
										this.state.selectColumn +
										'/icon'
								}
								ratio={120 / 120}
								size="120x120"
								height={120}
								width={120}
								type="icon"
							/>
						</Edit>
					</Flex>
					{/*<Divider/>*/}
					<Flex>
						<Title>
							<div className="sans-font">Parent column</div>
						</Title>
						<Edit>
							<div className="row" style={{ marginTop: '15px' }}>
								<AutoComplete
									hintText="Add an parent column..."
									filter={AutoComplete.noFilter}
									dataSource={parentAutoComplete}
									onUpdateInput={this.fetchParentAutoComplete}
									onNewRequest={this.addParent}
									searchText={parentSearchText}
									style={{ marginLeft: '10px', height: '32px' }}
								/>
							</div>
						</Edit>
					</Flex>
					<Flex>
						<Title>
							<div className="sans-font">Writers</div>
						</Title>
						<Edit>
							<div className="row" style={{ marginTop: '15px' }}>
								{writers.map((data, index) => (
									<Chip
										key={data.value}
										onRequestDelete={() => this.confirmDeleteWriter(data)}
										style={{ margin: '4px' }}>
										{data.text}
									</Chip>
								))}
								<AutoComplete
									hintText="Add an writer..."
									filter={AutoComplete.noFilter}
									dataSource={writersAutoComplete}
									onUpdateInput={this.fetchWritersAutoComplete}
									onNewRequest={this.addWriter}
									searchText={writerSearchText}
									style={{ marginLeft: '10px', height: '32px' }}
								/>
							</div>
						</Edit>
					</Flex>
					<Flex>
						<Title>
							<div className="sans-font">Editors</div>
						</Title>
						<Edit>
							<div className="row" style={{ marginTop: '15px' }}>
								{editors.map((data, index) => (
									<Chip
										key={data.value}
										onRequestDelete={() => this.confirmDeleteEditor(data)}
										style={{ margin: '4px' }}>
										{data.text}
									</Chip>
								))}
								<AutoComplete
									hintText="Add an editor..."
									filter={AutoComplete.noFilter}
									dataSource={editorsAutoComplete}
									onUpdateInput={this.fetchEditorsAutoComplete}
									onNewRequest={this.addEditor}
									searchText={editorSearchText}
									style={{ marginLeft: '10px', height: '32px' }}
								/>
							</div>
						</Edit>
					</Flex>
					<div
						className="sans-font"
						style={{ marginTop: '80px', overflow: 'hidden' }}>
						<PrimaryButton
							label="Save"
							type="submit"
							style={{ float: 'right', margin: '0 20px 0 0' }}
						/>
						<SecondaryButton
							label="Reset"
							onClick={this.resetDate}
							style={{ float: 'right', margin: '0 20px 0 0' }}
						/>
						<TextStatus
							style={{
								color: error ? '#D8000C' : theme.accentColor,
								float: 'right',
								marginRight: '30px'
							}}>
							{textStatus}
						</TextStatus>
					</div>
				</Container>
			</Div>
		)
	}
}

export default ColumnSettingPage
