import React from 'react'
import PropTypes from 'prop-types'
import {
	OverlayImg,
	Pagination,
	Alert,
	EditMenu,
	BoxMenu,
	MenuList,
	DropdownWithIcon,
	StoriesTable,
	Filter,
	PrimaryButton,
	SecondaryButton
} from 'components'
import FontIcon from 'material-ui/FontIcon'
import styled from 'styled-components'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
//import {Link} from 'react-router-dom'
import auth from '../../../services/auth'
import Snackbar from 'material-ui/Snackbar'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import CircularProgress from 'material-ui/CircularProgress'
import moment from 'moment'
import api from '../../../services/api'
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'
import AutoComplete from 'material-ui/AutoComplete'
import utils from '../../../services/utils'
import config from '../../../config'

const Container = styled.div`
  width:100%;
`

const Section1 = styled.div`
  display:flex;
`

const TabHead = styled.div`
  padding:0 15px 0 15px;
  display:inline;
  font-size:16px;
  &:hover{
    color:#222;
    cursor:pointer;
    text-decoration:underline;
  }
`
const Section2 = styled.div`
  width:100%;
  padding:15px;
  border-bottom:1px solid #E2E2E2;
`

const Col3 = styled.div`
  padding:0 5px 0 5px;
`

const Icon = styled.div`
  color:#222;
  font-size:32px;
  overflow:hidden;
  &:hover{
    cursor:pointer;
  }
`

const Primary = styled.div`
  background-color:${props => props.theme.primaryColor};
  color:white;
  text-align:center;
  padding:15px 5px 15px 5px;
  font-size:16px;
  border:2px solid ${props => props.theme.primaryColor};
`

const Second = styled.div`
  background-color:white;
  color:${props => props.theme.primaryColor};
  text-align:center;
  padding:15px 5px 15px 5px;
  font-size:16px;
  border:2px solid ${props => props.theme.primaryColor};
`

const Cont = styled.div`
  width:100%;
`

// const TitleLink = styled(Link)`
//   color:#222;
//   font-size:15px;
//   font-weight:bold;
//   float:left;
//   height:52px;
//   word-wrap: break-word;
//   white-space: pre-wrap;      /* Webkit */
//   white-space: -moz-pre-wrap; /* Firefox */
//   white-space: -pre-wrap;     /* Opera <7 */
//   white-space: -o-pre-wrap;   /* Opera 7 */
//   word-wrap: break-word;      /* IE */
//   padding-right:5px;
//   overflow: hidden;
//   max-width:220px;
//   margin:0 0 0 15px;
// `

// const IconEdit = styled(Link)`
//   background-color:${props=> props.theme.primaryColor};
//   color:white;
//   border-radius:12px;
//   padding:5px 8px 5px 8px;
//   height: 35px;
//   width:40px;
//   margin:8px 12px 0 0;
//   &:hover{
//     cursor:pointer;
//   }
// `

const Page = styled.div`
  display: flex;
	flex-flow: row wrap;
	justify-content: center;
  padding:30px 0 30px 0;
`

const Header = styled.div`
	margin: 0;
	padding: 0;
  height: 80px;
	width: 100%;
  background: #F4F4F4;
  display: flex;
`

const Title = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  font-family: 'Nunito', 'Mitr';
  font-size: 22px;
  font-weight: bold;
  padding-left: 32px;
`
const Line = styled.div`
  position:relative;
  top:-2px;
  z-index:0;
  width:320px;
  margin-left:20px;
  height:1px;
  background-color:#C4C4C4;
`
const AutoCompleteBox = styled.div`
  display:flex;
  border:1px solid #c4c4c4;
  float:right;
  margin:30px;
  padding:5px 20px;
`

const DescEditor = styled.div`
  display:flex;
  flex-flow: row wrap;
  margin:20px 30px;
	width:100%;
`

const Desc = styled.div`
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

const TextStatus = styled.div`
  color:${props => props.theme.primaryColor};
  font-size:15px;
  font-style:italic;
  margin:10px 20px 0 15px;
`

const STATUS = {
	DRAFTED: 0,
	PUBLISHED: 1
}

const dataSource = [
	{ text: 'text0', value: 0, id: 0 },
	{ text: 'text1', value: 1, id: 1 },
	{ text: 'text2', value: 2, id: 2 }
]

class PublisherStoryPage extends React.Component {
	state = {
		selectColumn: 'all',
		selectStatus: STATUS.PUBLISHED,

		stories: [],
		storiesCount: 0,
		selectStoryId: 0,

		columns: [],
		columnArray: [],

		currentPage: 0,
		totalPages: 0,

		sort: 'latest',

		alert: false,
		alertConfirm: function() {},
		alertLoading: false,
		onLoad: false,
		snackbar: false,
		snackbarMS: '',
		editStory: false,
		selectTab: 0,
		searchText: '',
		sortBy: '',
		sortByState: 0,
		desc: '',
		descErr: '',
		descStatus: '',
		newsPage: false
	}

	FEED_LIMIT = config.FEED_LIMIT

	static contextTypes = {
		setting: PropTypes.object
	}

	removeColumn = () => {
		let cid = this.state.selectColumn

		api.removeColumn(cid).then(res => {
			this.setState(
				{
					alert: false,
					alertDesc: '',
					snackbar: true,
					snackbarMS: 'Delete Column Complete !',

					// when col removed, select the default 'all' columns
					selectColumn: 'all',
					selectStatus: STATUS.PUBLISHED
				},
				() => {
					this.getColumns()
					this.getStories()
				}
			)
		})
	}

	getCurrentFilter = () => {
		var { id, value, searchText } = this.refs.filter.state
		if (!searchText) {
			value = ''
		}
		return {
			writer: value == 'Writer' ? parseInt(id) : null,
			column: value == 'Column' ? parseInt(id) : null,
			status: this.state.selectStatus
		}
	}

	getStories = () => {
		this.setState({ onLoad: true })
		let { currentPage, sort, sortBy, sortByState } = this.state
		var { id, value, searchText } = this.refs.filter.state
		if (sortBy == 'stats') {
			sortBy = 'popular'
		} else if (sortBy == 'drafted') {
			sortBy = 'published'
		}
		var sb = sortBy ? [sortBy, parseInt(sortByState)] : null
		if (value == 'Title' && searchText) {
			api.filterStoryByTitle(searchText, sb).then(s => {
				//console.log('HAHAHA', s, utils.getTotalPages(this.FEED_LIMIT, s.length))
				this.setState({
					stories: s,
					storiesCount: s.length,
					onLoad: false,
					totalPages: utils.getTotalPages(this.FEED_LIMIT, s.length)
				})
			})
		} else {
			let type

			if (this.props.match.path == '/editor/manage/news') {
				type = 'news'
			} else if (this.props.match.path == '/editor/manage/stories') {
				type = 'article'
			}

			api
				.getFeed(
					type,
					this.getCurrentFilter(),
					null,
					[sb],
					currentPage,
					this.FEED_LIMIT,
					{ onlyAuthorized: true }
				)
				.then(result => {
					// console.log(result)

					this.setState({
						stories: result.feed,
						storiesCount: result.count,
						onLoad: false,
						totalPages: utils.getTotalPages(
							this.FEED_LIMIT,
							result.count[this.state.selectStatus]
						)
					})
				})
		}
	}

	filterPublished = () => {
		this.setState({ selectStatus: STATUS.PUBLISHED }, () => {
			this.getStories()
		})
	}

	filterDrafted = () => {
		this.setState({ selectStatus: STATUS.DRAFTED }, () => {
			this.getStories()
		})
	}

	recent = () => {
		this.setState({ sort: 'latest' }, () => {
			this.getStories()
		})
	}

	popular = () => {
		this.setState({ sort: 'popular' }, () => {
			this.getStories()
		})
	}

	changePage = e => {
		this.setState({ currentPage: e - 1 }, () => {
			this.getStories()
		})
	}

	handleTouchTap = e => {
		e.preventDefault()

		this.setState({
			alert: true,
			alertWhere: e.currentTarget
		})
	}

	handleRequestClose = () => {
		this.setState({
			alert: false,
			alertDesc: ''
		})
	}

	goEditPage = () => {
		this.props.history.push(
			'/editor/columns/' + this.state.selectColumn + '/settings'
		)
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
			this.getColumns().then(() => {
				this.setState({
					alertLoading: false,
					alert: false,
					snackbar: true,
					snackbarMS: 'Create New Column Complete!',

					selectColumn: col.id,
					selectStatus: STATUS.PUBLISHED
				})

				this.getStories()
			})
		})
	}

	closeSnackbar = () => {
		this.setState({ snackbar: false })
	}

	closeEditStory = () => {
		this.setState({ editStory: false })
	}

	editStory = (e, data) => {
		//console.log(data)
		this.setState({
			editStory: true,
			editStoryWhere: e.currentTarget,
			selectStoryId: data
		})
	}

	alertDeleteStory = e => {
		this.setState({
			alert: true,
			alertWhere: e.currentTarget,
			alertChild: '',
			alertDesc: 'Are you sure to delete this story?',
			alertConfirm: this.deleteStory
		})
	}

	alertUnpublishStory = e => {
		this.setState({
			alert: true,
			alertWhere: e.currentTarget,
			alertChild: '',
			alertDesc: 'Are you sure to unpublish this story?',
			alertConfirm: this.unpublishStory
		})
	}

	alertPublishStory = e => {
		this.setState({
			alert: true,
			alertWhere: e.currentTarget,
			alertChild: '',
			alertDesc: 'Are you sure to publish this story?',
			alertConfirm: this.publishStory
		})
	}

	deleteStory = () => {
		this.setState({ editStory: false, alert: false })

		api.deleteStory(this.state.selectStoryId).then(res => {
			this.getStories()
		})
	}

	unpublishStory = () => {
		this.setState({ editStory: false, alert: false })

		api.setStoryStatus(this.state.selectStoryId, 0).then(res => {
			this.getStories()
		})
	}

	publishStory = () => {
		this.setState({ editStory: false, alert: false })

		api.setStoryStatus(this.state.selectStoryId, 1).then(res => {
			this.getStories()
		})
	}

	goEditStory = () => {
		this.props.history.push('/me/stories/' + this.state.selectStoryId + '/edit')
	}

	handleChangeTab = e => {
		this.setState({ selectTab: e }, () => {
			if (!e) {
				this.filterPublished()
			} else {
				this.filterDrafted()
			}
		})
	}

	sortBy = (e, val) => {
		e.preventDefault()
		var { sortBy, sortByState } = this.state
		if (sortByState == 0) {
			this.setState(
				{
					sortBy: val,
					sortByState: 1
				},
				() => {
					this.getStories()
				}
			)
		} else if (sortByState == 1 && sortBy == val) {
			this.setState(
				{
					sortByState: -1
				},
				() => {
					this.getStories()
				}
			)
		} else if (sortByState == 1 && sortBy != val) {
			this.setState(
				{
					sortBy: val,
					sortByState: 1
				},
				() => {
					this.getStories()
				}
			)
		} else if (sortByState == -1 && sortBy == val) {
			this.setState(
				{
					sortByState: 1
				},
				() => {
					this.getStories()
				}
			)
		} else if (sortByState == -1 && sortBy != val) {
			this.setState(
				{
					sortBy: val,
					sortByState: 1
				},
				() => {
					this.getStories()
				}
			)
		}
	}

	componentDidMount() {
		this.getStories()

		const newsPath = ['/editor/manage/news', '/editor/manage/news/']
		if (newsPath.indexOf(this.props.location.pathname) != -1) {
			this.setState({
				newsPage: true
			})
		}
	}

	saveDesc = () => {
		api
			.getColumnFromSlug('news')
			.then(res => {
				api.updateColumn(res.id, { shortDesc: this.state.desc })
			})
			.then(() => {
				this.setState({
					descStatus: 'Saved successfully'
				})
			})
			.catch(err => {
				this.setState({
					descStatus: res.body.error.message
				})
			})
	}

	resetDesc = () => {
		this.setState({
			desc: '',
			descStatus: 'Unsave'
		})
	}

	changeDesc = e => {
		const value = e.target.value
		if (value == 'shortDesc') {
			var val = e.target.value.split('')
			if (val.length >= 140) {
				this.setState({
					descErr: 'Maximun characters'
				})
			}
			return
		} else {
			this.setState({
				desc: value,
				descErr: ''
			})
		}
	}

	render() {
		//console.log('theme',theme)
		let {
			sort,
			totalPages,
			storiesCount,
			editStory,
			editStoryWhere,
			selectStatus,
			snackbar,
			snackbarMS,
			currentPage,
			stories,
			columns,
			selectColumn,
			alert,
			alertDesc,
			alertWhere,
			alertLoading,
			alertChild,
			alertConfirm,
			columnArray,
			onLoad,
			selectTab,
			searchText,
			sortBy,
			sortByState,
			desc,
			descErr,
			descStatus,
			newsPage
		} = this.state
		//console.log('storiesCount',storiesCount)
		let { theme } = this.context.setting.publisher

		const styles = {
			label: {
				fontSize: '30px'
			},
			underline: {
				background: 'none',
				border: 'none'
			},
			selected: {
				backgroundColor: theme.primaryColor,
				color: '#ffffff',
				fill: '#ffffff'
			},
			menuItem: {
				padding: '15px 40px 15px 15px'
			},
			newColumn: {
				color: theme.primaryColor,
				fontWeight: 'bold'
			},
			showInactive: {
				textDecoration: 'underline',
				color: '#8f8f8f'
			},
			headline: {
				fontSize: 24,
				paddingTop: 16,
				marginBottom: 12,
				fontWeight: 400
			},
			tabs: {
				background: 'none',
				height: '50px',
				color: '#222222'
			},
			tab: {
				fontFamily: "'Nunito', 'Mitr'",
				fontSize: '16px',
				fontWeight: 'bold',
				textTransform: 'none'
			}
		}

		const dataSourceConfig = { text: 'text', value: 'value', id: 'id' }
		return (
			<Container>
				<Snackbar
					open={snackbar}
					message={snackbarMS}
					autoHideDuration={4000}
					onRequestClose={this.closeSnackbar}
					style={{ backgroundColor: theme.primaryColor }}
					bodyStyle={{
						backgroundColor: theme.primaryColor,
						textAlign: 'center'
					}}
					className="nunito-font"
				/>
				<Popover
					open={editStory}
					anchorEl={editStoryWhere}
					anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
					targetOrigin={{ horizontal: 'left', vertical: 'top' }}
					style={{ border: '2px solid ' + theme.primaryColor }}
					onRequestClose={this.closeEditStory}>
					<MenuItem
						onClick={this.goEditStory}
						style={{ color: theme.primaryColor, fontSize: '17px' }}
						className="nunito-font"
						leftIcon={
							<FontIcon
								className="material-icons"
								style={{ color: theme.primaryColor }}>
								edit
							</FontIcon>
						}>
						Edit Story
					</MenuItem>
					<MenuItem
						onClick={this.alertDeleteStory}
						style={{ color: theme.primaryColor, fontSize: '17px' }}
						className="nunito-font"
						leftIcon={
							<FontIcon
								className="material-icons"
								style={{ color: theme.primaryColor }}>
								delete
							</FontIcon>
						}>
						Delete
					</MenuItem>
					{selectStatus === STATUS.PUBLISHED
						? <MenuItem
								onClick={this.alertUnpublishStory}
								style={{ color: theme.primaryColor, fontSize: '17px' }}
								className="nunito-font"
								leftIcon={
									<FontIcon
										className="material-icons"
										style={{ color: theme.primaryColor }}>
										drafts
									</FontIcon>
								}>
								Unpublish
							</MenuItem>
						: <MenuItem
								onClick={this.alertPublishStory}
								style={{ color: theme.primaryColor, fontSize: '17px' }}
								className="nunito-font"
								leftIcon={
									<FontIcon
										className="material-icons"
										style={{ color: theme.primaryColor }}>
										assignment_turned_in
									</FontIcon>
								}>
								Publish
							</MenuItem>}
				</Popover>
				<Alert
					open={alert}
					anchorEl={alertWhere}
					onRequestClose={this.handleRequestClose}
					description={alertDesc}
					child={alertChild}
					loading={alertLoading}
					confirm={alertConfirm}
				/>

				<Header>
					<Title>{newsPage ? 'Manage News' : 'Manage Stories'}</Title>
				</Header>
				{newsPage &&
					<DescEditor>
						<Desc>
							<div className="sans-font">Description</div>
						</Desc>
						<Edit>
							<TextField
								multiLine={true}
								fullWidth={true}
								floatingLabelText="140 characters"
								floatingLabelFixed={true}
								rows={1}
								rowsMax={6}
								errorText={descErr}
								id="shortDesc"
								name="shortDesc"
								value={desc}
								onChange={this.changeDesc}
							/>
						</Edit>
					</DescEditor>}
				{newsPage &&
					<div
						className="sans-font"
						style={{ marginTop: '35px', overflow: 'hidden' }}>
						<PrimaryButton
							label="Save"
							style={{ float: 'right', margin: '0 40px 0 0' }}
							onClick={this.saveDesc}
						/>
						<SecondaryButton
							label="Reset"
							style={{ float: 'right', margin: '0 20px 0 0' }}
							onClick={this.resetDesc}
						/>
						<TextStatus
							style={{
								color: descErr ? '#D8000C' : theme.accentColor,
								float: 'right'
							}}>
							{descStatus}
						</TextStatus>
					</div>}

				<Section1>
					<div style={{ flex: 1 }}>
						<Tabs
							style={{ width: 320, margin: '20px', marginBottom: '0' }}
							tabItemContainerStyle={{ ...styles.tabs }}
							inkBarStyle={{
								background: theme.accentColor,
								height: 3,
								zIndex: 2
							}}
							onChange={this.handleChangeTab}
							value={selectTab}>
							<Tab
								buttonStyle={{
									...styles.tab,
									color: selectTab == 0 ? theme.accentColor : '#C4C4C4'
								}}
								label={(storiesCount[STATUS.PUBLISHED] || ' 0 ') + ' Published'}
								value={0}
							/>
							<Tab
								buttonStyle={{
									...styles.tab,
									color: selectTab == 1 ? theme.accentColor : '#C4C4C4'
								}}
								label={(storiesCount[STATUS.DRAFTED] || ' 0 ') + ' Draft'}
								value={1}
							/>
						</Tabs>
						<Line />
					</div>
					<div style={{ flex: 1, overflow: 'hidden' }}>
						<Filter ref="filter" search={this.getStories} />
					</div>
				</Section1>

				<Section2>
					<SwipeableViews
						index={selectTab}
						onChangeIndex={this.handleChangeTab}>
						<div>
							<StoriesTable
								stories={stories}
								selectStatus={selectStatus}
								onload={onLoad}
								editStory={this.editStory}
								sortBy={this.sortBy}
								sort={sortBy}
								sortState={sortByState}
							/>
						</div>
						<div>
							<StoriesTable
								stories={stories}
								selectStatus={selectStatus}
								editStory={this.editStory}
								sortBy={this.sortBy}
								sort={sortBy}
								sortState={sortByState}
							/>
						</div>
					</SwipeableViews>
				</Section2>
				{/*<div className='row' style={{padding:'30px 15px 20px 30px'}}>
          <DropdownWithIcon
            onChange={this.changeColumn}
            menuItem={!columnArray ? null : columnArray}
            value={selectColumn}
            editMenu={
              [<MenuList onClick={this.goEditPage} key="edit">Edit</MenuList>,
               <MenuList onClick={this.alertDelete} key='delete'>Delete</MenuList>,
               <MenuList onClick={this.alertNew} key='new'>+ New Column</MenuList>]}
            />
        </div>
        <div className='row'>
          <div className='col-6'>
            <Section1 className="sans-font">
              <TabHead onClick={this.filterPublished} style={selectStatus===STATUS.PUBLISHED ? {fontWeight:'bold',color:'#222'} : {}}>{storiesCount[STATUS.PUBLISHED+''] || '0 '} Published</TabHead>
              <TabHead onClick={this.filterDrafted} style={selectStatus===STATUS.DRAFTED ? {fontWeight:'bold',color:'#222'} : {}}>{storiesCount[STATUS.DRAFTED+''] || '0 '} Drafted</TabHead>
            </Section1>
          </div>
          <div className='col-6'>
            <Section1 className="sans-font">
              <TabHead onClick={this.recent} style={sort=='latest'?{fontWeight:'bold',color:'#222'}:{}}>Recent</TabHead>
              <TabHead onClick={this.popular} style={sort=='popular'?{fontWeight:'bold',color:'#222'}:{}}>Most Popular</TabHead>
            </Section1>
          </div>
        </div>*/}
				{totalPages > 0 &&
					<Page>
						<Pagination
							currentPage={currentPage + 1}
							totalPages={totalPages}
							onChange={this.changePage}
						/>
					</Page>}
			</Container>
		)
	}
}

export default PublisherStoryPage
