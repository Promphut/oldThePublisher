import React from 'react'
import styled from 'styled-components'
import { GraphDashboard, TopRank } from 'components'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import { Link } from 'react-router-dom'
import api from '../../../services/api'

const Container = styled.div``

const SubContainer = styled.div`padding: 32px;`

const Header = styled.div`
	margin: 0;
	padding: 0;
	height: 80px;
	width: 100%;
	background: #f4f4f4;
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

const GraphGap = styled.div`
	height: 30px;
	background: #f4f4f4;
	border-top: 1px solid #e2e2e2;
	border-bottom: 1px solid #e2e2e2;
`

const TopHeader = styled.div`
	font-weight: bold;
	font-size: 18px;
`

const ButtonWrapper = styled.div`width: 100%;`

let styles = {
	button: {
		display: 'block',
		width: '309px',
		height: '39px',
		margin: '20px auto 10px',
		borderRadius: '20px'
	},
	labelButton: {
		color: '#8f8f8f',
		textTransform: 'none',
		fontFamily: "'PT Sans', 'cs_prajad', sans-serif"
	}
}

class PublisherDashboardPage extends React.Component {
	state = {
		topstories: {},
		topcolumns: {},
		topwriters: {}
	}
	constructor(props) {
		super(props)
	}

	showAllButton = (label, to) => {
		return (
			<Link to={to} style={{ width: '100px' }}>
				<FlatButton
					label={label}
					labelStyle={styles.labelButton}
					style={styles.button}
					backgroundColor="#F4F4F4"
					hoverColor="#E0E0E0"
				/>
			</Link>
		)
	}

	getInsight = (insigth, limit, subaction, filter, sort, current) => {
		api
			.getViewInsight(insigth, subaction, filter, sort, limit, current)
			.then(data => {
				this.setState({ [insigth]: data })
			})
	}

	componentDidMount() {
		const limit = 5

		this.getInsight('topstories', limit)
		this.getInsight('topcolumns', limit)
		this.getInsight('topwriters', limit)
	}

	render() {
		const { topstories, topcolumns, topwriters } = this.state

		return (
			<Container>
				<Header>
					<Title>Overview</Title>
				</Header>
				<SubContainer>
					<GraphDashboard width={800} />
				</SubContainer>
				<GraphGap />

				<SubContainer>
					<TopHeader className="sans-font">Top Stories</TopHeader>
					<TopRank insight={'topstories'} data={topstories} />
					{this.showAllButton('Show All Top Stories', '/editor/stories')}
				</SubContainer>
				<Divider />

				<SubContainer>
					<TopHeader className="sans-font">Top Columns</TopHeader>
					<TopRank insight={'topcolumns'} data={topcolumns} />
					{this.showAllButton('Show All Top Columns', '/editor/columns')}
				</SubContainer>
				<Divider />

				<SubContainer>
					<TopHeader className="sans-font">Top Writers</TopHeader>
					<TopRank insight={'topwriters'} data={topwriters} />
					{this.showAllButton('Show All Top Writers', '/editor/writers')}
				</SubContainer>
			</Container>
		)
	}
}

export default PublisherDashboardPage
