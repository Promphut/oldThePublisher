import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { PrimaryButton, SecondaryButton } from 'components'
import { List, ListItem, makeSelectable } from 'material-ui/List'
import FontIcon from 'material-ui/FontIcon'
import { Link } from 'react-router-dom'
import auth from '../../../services/auth'
import { withRouter } from 'react-router'

const Wrapper = styled.div`
  .open {
    transform: rotate(180deg);
    transition-duration: 1s;
  }
`

let styles = {
	list: {
		color: '#ffffff'
	},

	listItem: {
		padding: '16px 20px',
		color: '#FFFFFF',
		fontFamily: "'Nunito', 'Mitr', sans-serif",
		fontWeight: 'bold'
	},

	listNestedItem: {
		padding: '5px 20px',
		color: '#FFFFFF',
		fontFamily: "'Nunito', 'Mitr', sans-serif",
		fontWeight: 'bold'
	}
}

const SelectableList = makeSelectable(List)

class PublisherSettingMenu extends React.Component {
	static contextTypes = {
		setting: PropTypes.object
	}
	constructor(props) {
		super(props)
		//console.log(props.pathname+'/')
		this.state = {
			selectedIndex: props.pathname,
			openInsights: false,
			openManage: false,
			openSettings: false
		}
	}

	changePath = path => {
		this.props.history.push(path)
	}

	toggleNested = menu => {
		if (menu == 'insight') {
			this.setState({ openInsights: !this.state.openInsights })
		} else if (menu == 'manage') {
			this.setState({ openManage: !this.state.openManage })
		} else if (menu == 'setting') {
			this.setState({ openSettings: !this.state.openSettings })
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.pathname != this.props.pathname) {
			this.setState({
				selectedIndex: nextProps.pathname
			})
		}
	}

	componentDidMount() {
		this.setState({ selectedIndex: this.props.pathname })

		const openInsights = [
			'/editor',
			'/editor/',
			'/editor/stories',
			'/editor/stories/',
			'/editor/columns',
			'/editor/columns/',
			'/editor/writers',
			'/editor/writers/'
		]
		const openManage = [
			'/editor/manage/news',
			'/editor/manage/news/',
			'/editor/manage/stories',
			'/editor/manage/stories/'
		]
		const openSettings = [
			'/editor/settings',
			'/editor/settings/',
			'/editor/settings/contact',
			'/editor/settings/contact/',
			'/editor/settings/publishing',
			'/editor/settings/publishing/',
			'/editor/settings/columns',
			'/editor/settings/columns/'
		]

		if (openInsights.indexOf(this.props.pathname) != -1) {
			this.setState({
				openInsights: true
			})
		} else if (openManage.indexOf(this.props.pathname) != -1) {
			this.setState({
				openManage: true
			})
		} else if (openSettings.indexOf(this.props.pathname) != -1) {
			this.setState({
				openSettings: true
			})
		}
	}

	componentWillMount() {
		this.isAdmin = auth.hasRoles(['ADMIN'])
	}

	render() {
		//console.log(this.props.match)

		let { theme } = this.context.setting.publisher
		let { selectedIndex, openInsights, openManage, openSettings } = this.state

		return (
			<Wrapper>
				<SelectableList style={{ padding: 0 }}>
					<ListItem
						style={{
							...styles.listItem,
							backgroundColor: (selectedIndex == '/editor' &&
								theme.accentColor) ||
								(this.props.pathname == '/editor/' &&
								theme.accentColor) ||
								(this.props.pathname == '/editor/stories' &&
									theme.accentColor) ||
								(this.props.pathname == '/editor/columns' &&
									theme.accentColor) ||
								(this.props.pathname == '/editor/writers' && theme.accentColor)
						}}
						onClick={() => this.toggleNested('insight')}
						value={
							(this.props.pathname == '/editor/' && this.props.pathname) ||
								(this.props.pathname == '/editor/stories' &&
									this.props.pathname) ||
								(this.props.pathname == '/editor/columns' &&
									this.props.pathname) ||
								(this.props.pathname == '/editor/writers' &&
									this.props.pathname)
						}
						primaryTogglesNestedList={true}
						className="nunito-font"
						primaryText="Insights"
						open={openInsights}
						rightIcon={
							<FontIcon
								className={'material-icons ' + (openInsights ? 'open' : '')}
								style={{ color: 'white' }}>
								keyboard_arrow_down
							</FontIcon>
						}
						nestedItems={[
							<ListItem
								onClick={() => this.changePath('/editor/')}
								value="/editor/"
								style={{
									...styles.listNestedItem,
									color: selectedIndex == '/editor/'||selectedIndex == '/editor'
										? theme.accentColor
										: 'white'
								}}
								primaryText="Overview"
							/>,
							<ListItem
								onClick={() => this.changePath('/editor/stories')}
								value="/editor/stories"
								style={{
									...styles.listNestedItem,
									color: selectedIndex == '/editor/stories'
										? theme.accentColor
										: 'white'
								}}
								primaryText="Stories"
							/>,
							<ListItem
								onClick={() => this.changePath('/editor/columns')}
								value="/editor/columns"
								style={{
									...styles.listNestedItem,
									color: selectedIndex == '/editor/columns'
										? theme.accentColor
										: 'white'
								}}
								primaryText="Columns"
							/>,
							<ListItem
								onClick={() => this.changePath('/editor/writers')}
								value="/editor/writers"
								style={{
									...styles.listNestedItem,
									color: selectedIndex == '/editor/writers'
										? theme.accentColor
										: 'white'
								}}
								primaryText="Writers"
							/>
						]}
						nestedListStyle={{
							background: 'rgba(255,255,255,0.2)',
							padding: '0px'
						}}
					/>

					<ListItem
						style={{
							...styles.listItem,
							backgroundColor: (selectedIndex == '/editor/manage/news' &&
								theme.accentColor) ||
								(this.props.pathname == '/editor/manage/news' &&
									theme.accentColor) ||
								(this.props.pathname == '/editor/manage/stories' &&
									theme.accentColor)
						}}
						onClick={() => this.toggleNested('manage')}
						value={
							(this.props.pathname == '/editor/manage/news' &&
								this.props.pathname) ||
								(this.props.pathname == '/editor/manage/news' &&
									this.props.pathname) ||
								(this.props.pathname == '/editor/manage/stories' &&
									this.props.pathname)
						}
						primaryTogglesNestedList={true}
						className="nunito-font"
						primaryText="Manage"
						open={openManage}
						rightIcon={
							<FontIcon
								className={'material-icons ' + (openManage ? 'open' : '')}
								style={{ color: 'white' }}>
								keyboard_arrow_down
							</FontIcon>
						}
						nestedItems={[
							<ListItem
								onClick={() => this.changePath('/editor/manage/news')}
								value="/editor/manage/news"
								style={{
									...styles.listNestedItem,
									color: selectedIndex == '/editor/manage/news'
										? theme.accentColor
										: 'white'
								}}
								primaryText="News"
							/>,
							<ListItem
								onClick={() => this.changePath('/editor/manage/stories')}
								value="/editor/manage/column"
								style={{
									...styles.listNestedItem,
									color: selectedIndex == '/editor/manage/stories'
										? theme.accentColor
										: 'white'
								}}
								primaryText="Stories"
							/>
						]}
						nestedListStyle={{
							background: 'rgba(255,255,255,0.2)',
							padding: '0px'
						}}
					/>

					<ListItem
						style={{
							...styles.listItem,
							backgroundColor: (selectedIndex == '/editor/settings/' &&
								theme.accentColor) ||
								(this.props.pathname == '/editor/settings/columns' &&
									theme.accentColor) ||
								(this.props.pathname == '/editor/settings/contact' &&
									theme.accentColor) ||
								(this.props.pathname == '/editor/settings/publishing' &&
									theme.accentColor)
						}}
						onClick={() => this.toggleNested('setting')}
						value={
							(this.props.pathname == '/editor/settings/' &&
								this.props.pathname) ||
								(this.props.pathname == '/editor/settings/columns' &&
									this.props.pathname) ||
								(this.props.pathname == '/editor/settings/contact' &&
									this.props.pathname) ||
								(this.props.pathname == '/editor/settings/publishing' &&
									this.props.pathname)
						}
						primaryTogglesNestedList={true}
						className="nunito-font"
						primaryText="Settings"
						open={openSettings}
						rightIcon={
							<FontIcon
								className={'material-icons ' + (openSettings ? 'open' : '')}
								style={{ color: 'white' }}>
								keyboard_arrow_down
							</FontIcon>
						}
						nestedItems={[
							
								<ListItem
									onClick={() => this.changePath('/editor/settings/')}
									value="/editor/settings"
									style={{
										...styles.listNestedItem,
										color: selectedIndex == '/editor/settings/'
											? theme.accentColor
											: 'white',
											display:this.isAdmin?'block':'none'
									}}
									primaryText="Profile & Theme"
								/>,
							
								<ListItem
									onClick={() => this.changePath('/editor/settings/contact')}
									value="/editor/settings/contact"
									style={{
										...styles.listNestedItem,
										color: selectedIndex == '/editor/settings/contact'
											? theme.accentColor
											: 'white',
											display:this.isAdmin?'block':'none'
									}}
									primaryText="Contact & About"
								/>,
							
								<ListItem
									onClick={() => this.changePath('/editor/settings/publishing')}
									value="/editor/settings/publishing"
									style={{
										...styles.listNestedItem,
										color: selectedIndex == '/editor/settings/publishing'
											? theme.accentColor
											: 'white',
											display:this.isAdmin?'block':'none'
									}}
									primaryText="Publishing"
								/>,
							<ListItem
								onClick={() => this.changePath('/editor/settings/columns')}
								value="/editor/settings/columns"
								style={{
									...styles.listNestedItem,
									color: selectedIndex == '/editor/settings/columns'
										? theme.accentColor
										: 'white'
								}}
								primaryText="Column"
							/>
						]}
						nestedListStyle={{
							background: 'rgba(255,255,255,0.2)',
							padding: '0px'
						}}
					/>
				</SelectableList>
			</Wrapper>
		)
	}
}

export default withRouter(PublisherSettingMenu)
