import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn
} from 'material-ui/Table'
import { ScoreBar } from 'components'
import FontIcon from 'material-ui/FontIcon'
import DatePicker from 'react-datepicker'
import Popover from 'material-ui/Popover'
import FlatButton from 'material-ui/FlatButton'
import moment from 'moment'
import api from '../../../services/api'
import isObject from 'lodash/isObject'

const Container = styled.div`
`

const Bold = styled(Link)`
	font-weight: bold;
	color:#222;
	display:block;
	&:hover{
		cursor:pointer;
	}
`

const Text = styled.div`
	color: ${props => props.color};
	font-weight: ${props => props.weight};
	margin: auto;
	text-align: center;
	fontSize: 16px;
`

const DateSelect = styled.div`
	float: right;
	marginBottom: 13px;
`

const Date = styled.div`
	display: inline-block;
	marginRight: 10px;
`

const Line = styled.div`
	white-space: nowrap;
`

const SortText = styled.div`
`

let styles = {
	tableTextHeader(opacity = '1', paddingRight = 'auto') {
		return {
			fontSize: '14px',
			fontWeight: 'bold',
			color: '#222',
			textAlign: 'center',
			cursor: 'pointer',
			paddingLeft: 'auto',
			paddingRight,
			opacity
		}
	},
	tableTotalName: {
		fontSize: '16px',
		height: '36px',
		width: '30%'
	},
	tableTotal: {
		fontSize: '16px',
		height: '36px',
		textAlign: 'center'
	},
	tableTextBodyName: {
		fontSize: '16px',
		whiteSpace: 'initial',
		padding: '12px 24px',
		lineHeight: '25px',
		width: '30%'
	},
	tableTextBody: {
		fontSize: '16px',
		textAlign: 'center'
	},
	arrow: {
		fontSize: '12px',
		color: '#C4C4C4',
		padding: '0px 5px 0px 0px'
	},
	dropup(color, right = 0) {
		return {
			fontSize: '16px',
			position: 'absolute',
			top: '31%',
			cursor: 'pointer',
			transition: '.2s',
			right,
			color
		}
	},
	dropdown(color, right = 0) {
		return {
			fontSize: '16px',
			position: 'absolute',
			top: '42%',
			cursor: 'pointer',
			transition: '.2s',
			right,
			color
		}
	}
}

class PublisherInsightGrowth extends React.Component {
	state = {
		data: {},
		open: false,
		startDate: moment().utcOffset('+07:00').subtract(6, 'days'),
		endDate: moment().utcOffset('+07:00'),
		hover: -1,
		sortNumber: 1
	}

	static contextTypes = {
		setting: PropTypes.object
	}

	getGrowthInsight = (current, sort, subaction, filter, limit) => {
		api
		.getGrowthInsight(
			this.props.insigth,
			subaction,
			filter,
			sort,
			limit,
			current
		)
		.then(data => {
			this.setState({ data })
		})
	}	

	openDatePicker = (e) => {
		this.setState({
			open: true,
			anchorEl: e.currentTarget
		})
	}

	handleRequestClose = () => {
		this.setState({
			open: false
		})
	}

	handleChangeDate = (e) => {
		this.setState(
			{
				startDate: moment(e).subtract(6, 'days'),
				endDate: e,
				open: false
			},
			() => {
				this.getGrowthInsight(moment(e).format('YYYYMMDD'))
			}
		)
	}

	sortBy = (sort, number, forceChange = false) => {
		if (forceChange) {
			number = number
		} else {
			number = number === this.state.sortNumber ? -number : number
		}
		this.setState({
			sortNumber: number
		})

		this.getGrowthInsight(moment(this.state.endDate).format('YYYYMMDD'), {
			[sort]: number < 0 ? 1 : -1
		})
	}

	renderHeader = (text, sort, index, paddingRight, right) => {
		const { endDate, hover, sortNumber } = this.state
		const { theme } = this.context.setting.publisher

		return (
			<TableHeaderColumn
				style={
					hover == index
						? styles.tableTextHeader('.8', paddingRight + 'px')
						: styles.tableTextHeader('1', paddingRight + 'px')
				}>
				<SortText
					onClick={() => this.sortBy(sort, index)}
					onMouseOver={() => this.setState({ hover: index })}
					onMouseLeave={() => this.setState({ hover: -1 })}>
					<Line>
						{text} {text == 'Week of' ? moment(endDate).format('DD/MM/YY') : ''}
					</Line>
				</SortText>
				<FontIcon
					className="material-icons"
					style={
						sortNumber === index
							? styles.dropup(theme.accentColor, right)
							: styles.dropup('#C4C4C4', right)
					}
					onClick={() => this.sortBy(sort, index, true)}>
					arrow_drop_up
				</FontIcon>
				<FontIcon
					className="material-icons"
					style={
						sortNumber === -index
							? styles.dropdown(theme.accentColor, right)
							: styles.dropdown('#C4C4C4', right)
					}
					onClick={() => this.sortBy(sort, -index, true)}>
					arrow_drop_down
				</FontIcon>
			</TableHeaderColumn>
		)
	}

	renderTableRowColumnAvr = (rate) => {
		let color
		let fontWeight
		if (rate > 9) {
			color = '#27AE60'
		} else if (rate < 3) {
			color = '#EB5757'
		} else {
			color = '#222222'
		}

		return (
			<TableRowColumn style={{ ...styles.tableTotal, color }}>
				{rate}
			</TableRowColumn>
		)
	}

	renderTableRowColumn = (rate) => {
		let color
		let weight
		if (rate > 9) {
			color = '#27AE60'
			weight = 'bold'
		} else if (rate < 3) {
			color = '#EB5757'
			weight = 'bold'
		} else {
			color = '#222222'
			weight = 'regular'
		}

		return (
			<TableRowColumn>
				<Text color={color} weight={weight}>
					{rate || rate === 0 ? rate : '-'}
				</Text>
			</TableRowColumn>
		)
	}

	componentDidMount() {
		this.getGrowthInsight()
	}

	render() {
		// const { avr, stories } = this.state.data
		const { entries, summary } = this.state.data
		const { startDate, endDate, anchorEl, open, hover } = this.state
		const { insigth } = this.props
		const { theme } = this.context.setting.publisher

		return (
			<Container>
				<Popover
					open={open}
					anchorEl={anchorEl}
					onRequestClose={this.handleRequestClose}
					style={{ background: 'none', boxShadow: 'none' }}>
					<DatePicker
						selected={endDate}
						startDate={startDate}
						endDate={endDate}
						onChange={this.handleChangeDate}
						inline
					/>
				</Popover>
				<DateSelect>
					<Date className="sans-font">Date:</Date>
					<FlatButton
						onClick={this.openDatePicker}
						style={{
							border: '1px solid #C4C4C4',
							borderRadius: '20px',
							padding: '0px 10px 0px 12px',
							fontSize: '14px',
							height: '28px',
							lineHeight: '28px'
						}}
						icon={
							<FontIcon
								className="material-icons"
								style={{
									color: '#C4C4C4',
									fontSize: '18px',
									marginLeft: '8px'
								}}>
								keyboard_arrow_down
							</FontIcon>
						}>
						{moment(startDate).format('MM/DD/YYYY') +
							' - ' +
							moment(endDate).format('MM/DD/YYYY')}
					</FlatButton>
				</DateSelect>
				<ScoreBar style={{ float: 'right', margin: '2px 18px 10px 0px' }} />
				<Table selectable={false} wrapperStyle={{ clear: 'both' }}>
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						<TableRow className="sans-font">
							<TableHeaderColumn style={{ width: '30%' }} />
							{this.renderHeader('Week of', 'pastSevenDays', 1, 6, 0)}
							{this.renderHeader('Previous Week', 'aWeekAgo', 2, 0, 7)}
							{this.renderHeader('Previous 2 Weeks', 'twoWeeksAgo', 3, 5, 0)}
							{this.renderHeader('Overall', 'overall', 4, 0, 30)}
						</TableRow>
					</TableHeader>

					<TableBody displayRowCheckbox={false}>
						<TableRow
							className="sans-font"
							style={{ height: '36px', background: '#F4F4F4' }}>
							<TableRowColumn style={styles.tableTotalName}>
								Average Engagement
							</TableRowColumn>

							{summary
								? this.renderTableRowColumnAvr(summary.pastSevenDays)
								: <TableRowColumn style={styles.tableTotal}>-</TableRowColumn>}
							{summary
								? this.renderTableRowColumnAvr(summary.aWeekAgo)
								: <TableRowColumn style={styles.tableTotal}>-</TableRowColumn>}
							{summary
								? this.renderTableRowColumnAvr(summary.twoWeeksAgo)
								: <TableRowColumn style={styles.tableTotal}>-</TableRowColumn>}
							{summary
								? this.renderTableRowColumnAvr(summary.overall)
								: <TableRowColumn style={styles.tableTotal}>-</TableRowColumn>}
						</TableRow>

						{ entries && entries.map((entry, index) => (
							( insigth == 'topstories' && isObject(entry.story) || 
							insigth == 'topcolumns' && isObject(entry.column) || 
							insigth == 'topwriters' && isObject(entry.writer) )

							&& <TableRow className="sans-font" key={index}>
								{insigth == 'topstories' 
									&& <TableRowColumn style={styles.tableTextBodyName}>
										<Bold to={entry.story?entry.story.url:'/'}>{index + 1}. {entry.story.title}</Bold>
										{entry.story.writer && entry.story.writer.display}
									</TableRowColumn>
								}
								{
									insigth == 'topcolumns'
									&& <TableRowColumn style={styles.tableTextBodyName}>
										<Bold to={entry.column?entry.column.url:'/'}>{index + 1}. {entry.column.name}</Bold>
									</TableRowColumn>
								}
								{
									insigth == 'topwriters'
									&& <TableRowColumn style={styles.tableTextBodyName}>
										<Bold to={entry.writer?entry.writer.url:'/'}>{index + 1}. {entry.writer.display}</Bold>
									</TableRowColumn>
								}

								{this.renderTableRowColumn(entry.pastSevenDays)}
								{this.renderTableRowColumn(entry.aWeekAgo)}
								{this.renderTableRowColumn(entry.twoWeeksAgo)}
								{this.renderTableRowColumn(entry.overall)}
							</TableRow>
						)) }
					</TableBody>
				</Table>
			</Container>
		)
	}
}

export default PublisherInsightGrowth
