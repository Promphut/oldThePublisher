import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn
} from 'material-ui/Table'
import FontIcon from 'material-ui/FontIcon'

const Container = styled.div``

const Bold = styled(Link)`
	font-weight: bold;
	color:#222;
	display:block;
	&:hover{
		cursor:pointer;
	}
`

const Trend = styled.div`
	font-size: 14px;
	color: #c4c4c4;
	margin-top: 7px;
`

const styles = {
	tableTextHeader: {
		fontSize: '14px',
		fontWeight: 'bold',
		color: '#222',
		textAlign: 'center'
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
		width: '30%',
		height: '72px'
	},
	tableTextBody: {
		fontSize: '16px',
		textAlign: 'center',
		height: '72px'
	},
	arrow: {
		fontSize: '12px',
		color: '#c4c4c4',
		padding: '0px 5px 0px 0px'
	}
}

class TopRank extends React.Component {
	toShortNumber = number => {
		if (number > 1000000000) {
			number = Math.floor(number / 1000000000) + 'B'
		} else if (number > 1000000) {
			number = Math.floor(number / 1000000) + 'M'
		} else if (number > 1000) {
			number = Math.floor(number / 1000) + 'K'
		}

		return number
	}

	numberWithCommas = number => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	checkRateArrow = (now, prev) => {
		if (now > prev) {
			return 'arrow_upward'
		} else if (now < prev) {
			return 'arrow_downward'
		}
	}

	checkRateNumber = (now, prev) => {
		if (now > prev) {
			return Math.floor(now / prev * 100)
		} else if (now < prev) {
			return Math.floor((prev - now) * 100 / prev)
		} else {
			return 0
		}
	}

	renderTableRowColumn = (now, prev) => {
		return (
			<TableRowColumn style={styles.tableTextBody}>
				{now ? this.numberWithCommas(now) : '-'}
				{prev
					? <Trend>
							<FontIcon className="material-icons" style={styles.arrow}>
								{this.checkRateArrow(now, prev)}
							</FontIcon>
							{this.checkRateNumber(now, prev)}%
						</Trend>
					: <Trend>-</Trend>}
			</TableRowColumn>
		)
	}

	render() {
		const { insight } = this.props
		const { entries, summary } = this.props.data

		return (
			<Container>
				<Table selectable={false}>
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						<TableRow className="sans-font">
							<TableHeaderColumn style={{ width: '30%' }} />
							<TableHeaderColumn style={styles.tableTextHeader}>
								This Week
							</TableHeaderColumn>
							<TableHeaderColumn style={styles.tableTextHeader}>
								Previous Week
							</TableHeaderColumn>
							<TableHeaderColumn style={styles.tableTextHeader}>
								Previous 2 Weeks
							</TableHeaderColumn>
							<TableHeaderColumn style={styles.tableTextHeader}>
								Overall
							</TableHeaderColumn>
						</TableRow>
					</TableHeader>

					<TableBody displayRowCheckbox={false}>
						<TableRow
							className="sans-font"
							style={{ height: '36px', background: '#F4F4F4' }}
						>
							<TableRowColumn style={styles.tableTotalName}>
								Total View
							</TableRowColumn>
							<TableRowColumn style={styles.tableTotal}>
								{summary ? this.toShortNumber(summary.pastSevenDays) : '-'}
							</TableRowColumn>
							<TableRowColumn style={styles.tableTotal}>
								{summary ? this.toShortNumber(summary.aWeekAgo) : '-'}
							</TableRowColumn>
							<TableRowColumn style={styles.tableTotal}>
								{summary ? this.toShortNumber(summary.twoWeeksAgo) : '-'}
							</TableRowColumn>
							<TableRowColumn style={styles.tableTotal}>
								{summary ? this.toShortNumber(summary.overall) : '-'}
							</TableRowColumn>
						</TableRow>

						{entries &&
							entries.map((entry, index) =>
								<TableRow className="sans-font" key={index}>
									{insight == 'topstories' &&
										<TableRowColumn style={styles.tableTextBodyName}>
											<Bold to={entry.story.url ? entry.story.url : '/'}>
												{index + 1}. {entry.story && entry.story.title}
											</Bold>
											{entry.story.writer && entry.story.writer.display}
										</TableRowColumn>}
									{insight == 'topcolumns' &&
										<TableRowColumn style={styles.tableTextBodyName}>
											<Bold to={entry.column.url ? entry.column.url : '/'}>
												{index + 1}. {entry.column && entry.column.name}
											</Bold>
										</TableRowColumn>}
									{insight == 'topwriters' &&
										<TableRowColumn style={styles.tableTextBodyName}>
											<Bold to={entry.writer.url ? entry.writer.url : '/'}>
												{index + 1}. {entry.writer && entry.writer.display}
											</Bold>
										</TableRowColumn>}

									{this.renderTableRowColumn(
										entry.pastSevenDays,
										entry.aWeekAgo
									)}
									{this.renderTableRowColumn(entry.aWeekAgo, entry.twoWeeksAgo)}
									{this.renderTableRowColumn(
										entry.twoWeeksAgo,
										entry.twoWeeksAgo
									)}

									<TableRowColumn style={styles.tableTextBody}>
										{entry.overall ? this.numberWithCommas(entry.overall) : '-'}
										<Trend>&nbsp;</Trend>
									</TableRowColumn>
								</TableRow>
							)}
					</TableBody>
				</Table>
			</Container>
		)
	}
}

export default TopRank
