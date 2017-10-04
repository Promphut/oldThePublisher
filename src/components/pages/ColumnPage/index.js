import React from 'react'
import PropTypes from 'prop-types'
import {
	TopBarWithNavigation,
	ArticleBox,
	ArticleBoxLarge,
	TrendingSideBar,
	BGImg,
	StoryMenu,
	Stick,
	Footer,
	EmptyStory,
	BackToTop,
	Pagination
} from 'components'
import { findDOMNode as dom } from 'react-dom'
import styled from 'styled-components'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import api from '../../../services/api'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import CircularProgress from 'material-ui/CircularProgress'
import utils from '../../../services/utils'
import config from '../../../config'

const Wrapper = styled.div`
`

const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	padding:110px 0 20px 0;
	min-height: calc(100vh - ${props => (props.isMobile ? '321px' : '501px')});
	@media (min-width: 768px) and (max-width: 992px) {
		padding:80px 0 0 0;
  }
`

const Main = styled.div`
	flex: 8 730px;
	max-width: 730px;
	@media (max-width: 480px) {
		flex:0 100%;
		max-width: 100%;
		padding:0 15px 0 15px;
	}
`

const Head = styled.div`
	 position:relative;
	 width:100%;
	 height:100%;
	 top:0px;
	 left:0px;
	 display: flex;
	 justify-content:center;
	 padding:0 20% 0 20%;
	 flex-direction:column;
	@media (max-width: 480px) {
		padding:0 5% 0 5%;
	}
	@media (min-width: 768px) and (max-width: 992px) {
		padding:0 15% 0 15%;
  }
`

const Feed = styled.div`
	flex: 12 1120px;
	max-width: 1120px;
	@media (max-width:480px) {
    flex: 0 100%;
		max-width: 100%;
		min-width: 100%;
		padding:0 15px 0 15px;
  }
`

const Aside = styled.div`
	flex: 3 325px;
	position:relative;
	max-width: 325px;
	margin-left:60px;
	@media (max-width: 1160px) {
		display:none;
	}
`

const Text = styled.div`
	color:#8F8F8F;
	font-size:19px;
`

const ColumnName = styled.div`
  color:#fff;
  font-size:48px;
  font-weight:bold;
	display:inline;
	@media (max-width:480px) {
		padding-top:13px;
  	font-size: 16px;
  }
	@media (min-width: 768px) and (max-width: 992px) {
		font-size: 32px;
  }
`

const ColumnDetail = styled.div`
	color:#fff;
  font-size:16px;
	font-family:'Mitr';
	margin-top:15px;
	font-weight:normal;
	@media (max-width:480px) {
  	font-size: 12px;
		margin-top: 8px;
  }
	@media (min-width: 768px) and (max-width: 992px) {
		margin-top: 10px;
		font-size: 12px;
  }
`
const Cover = styled(BGImg)`
	 width: 100%;
	 height: 280px;
	 position:relative;
	 top:60px;
	 display: flex;
	 align-items:center;
	 @media (max-width:480px) {
		height: 160px;
	 }
	@media (min-width: 768px) and (max-width: 992px) {
		height:200px;
  }
`

const Icon = styled.img`
	width:72px;
	height:72px;
	display:inline;
	margin:10px 30px 0 0;
	@media (max-width:480px) {
  	width:30px;
		height:30px;
		margin:0 10px 0 0;
  }
	@media (min-width: 768px) and (max-width: 992px) {
		width:37px;
		height:37px;
		margin:0 20px 0 0;
  }
`

const Onload = styled.div`
	width:100%;
	height:70px;
	margin:50px 0 50px 0;
`

const Page = styled.div`
  display: flex;
	flex-flow: row wrap;
	justify-content: center;
  padding:20px 0 0px 0;
`
const TextLine = styled.div`
  color:${props => props.theme.primaryColor};
  font-size:28px;
  font-weight:bold;
`
const Dash = styled.div`
  margin:5px 0 0 0;
  width:30px;
  height:4px;
  background-color:${props => props.theme.accentColor};
`
class ColumnPage extends React.Component {

	FEED_LIMIT = utils.isMobile()
		? config.FEED_LIMIT_MOBILE * 2
		: config.FEED_LIMIT

	static contextTypes = {
		setting: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			column: {
				cover: {}
			},
			isMobile: false,

			currentPage: utils.querystring('page',this.props.location) ? utils.querystring('page',this.props.location) - 1 : 0,
			feedCount: 0,
			feed: [],
			totalPages: 0,
			isEmpty: false,

			loading: false,
			initialLoading: true,
		}
	}

	onload = () => (
		<Onload>
			<div className="row">
				<CircularProgress
					size={60}
					thickness={6}
					style={{ width: '60px', margin: '0 auto 0 auto' }}
				/>
			</div>
		</Onload>
	)

	loadFeed = () => {
		if (this.state.column._id == null) return
		// ensure this method is called only once at a time
		if (this.state.loading === true) return
		
		this.state.loading = true

		let currentPage = this.state.currentPage
		let colId = this.state.column._id

		let colIds = []
		api.getChildrenFromParent(colId).then(res => {
			res.forEach(col => {
				colIds.push(col._id)
			})

		if (colIds.length === 0) colIds = colId
		api.getFeed('article', { status: 1, column: colId }, 'latest', null, currentPage, this.FEED_LIMIT)
			.then(result => {
				this.setState(
					{
						feed: result.feed,
						feedCount: result.count['1'] ? result.count['1'] : 0,
						totalPages: result.count['1'] ? utils.getTotalPages(this.FEED_LIMIT, result.count['1']) : 0,
						isEmpty: result.count['total']==0 || (!result.count['1'])
					},
					() => {
						this.setState({loading:false,initialLoading:false})
					}
				)
			})
		})
	}

	changePage = e => {
		this.props.history.push({ search: '?page=' + e })
	}

	getColumnFromSlug = (columnSlug, done = () => {}) => {
		if (!columnSlug) utils.notFound(this.props.history)
		
		api.getColumnFromSlug(columnSlug)
			.then(col => {
				this.setState({ column: col}, done)
			})
			.catch(err => {
				utils.notFound(this.props.history, err)
			})
	}

	componentWillMount() {
		this.getColumnFromSlug(this.props.match.params.columnSlug, this.loadFeed)
	}

	componentDidMount() {
		this.setState({
			isMobile: utils.isMobile()
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.columnSlug != this.props.match.params.columnSlug) {
			this.setState({
				currentPage : utils.querystring('page',nextProps.location) ? utils.querystring('page',nextProps.location) - 1 : 0,
				initialLoading: true,
			}, ()=> {
				this.getColumnFromSlug(nextProps.match.params.columnSlug, this.loadFeed)
			})
		} else if(nextProps.location.search != this.props.location.search){
			this.setState({
				currentPage : utils.querystring('page',nextProps.location) ? utils.querystring('page',nextProps.location) - 1 : 0,
				initialLoading: true,
			},()=>{
				document.body.scrollTop = document.documentElement.scrollTop = 0
				this.loadFeed()
			})
		}
	}

	render() {
		let { keywords, channels, theme } = this.context.setting.publisher
		const BGImgSize = (utils.isMobile() ? 100 : 280) + 60
		let { column, isMobile, feedCount, feed, currentPage, totalPages, loading, initialLoading, isEmpty } = this.state

		var head = (
			<Head>
				<div className="row">
					{column.icon != config.BACKURL + '/imgs/brand_display.png' &&
						<Icon src={column.icon} />}
					<ColumnName className="sans-font">{column.name}</ColumnName>
				</div>
				<ColumnDetail>{column.shortDesc}</ColumnDetail>
			</Head>
		)

		return (
			<Wrapper>
				<Helmet>
					<title>{column.name}</title>
					<meta name="title" content={column.name} />
					<meta name="keywords" content={keywords} />
					<meta name="description" content={column.shortDesc} />
				</Helmet>
				<TopBarWithNavigation
					onLoading={this.props.onLoading}
				/>

				<Cover
					style={{ display: 'flex', alignItems: 'center' }}
					src={
						column.cover.medium != config.BACKURL + '/imgs/column_cover.png'
							? column.cover.medium
							: null
					}
					alt={column.name}>
					{head}
				</Cover>

				<Content isMobile={isMobile}>
					<Main>
						<div>
							<TextLine className="sans-font hidden-mob">LATEST STORIES</TextLine>
							<Dash className="hidden-mob" style={{ margin: '5px 0 10px 0' }} />
						</div>

						{ (loading || initialLoading) ? this.onload() :
							<div>
								{(feed && currentPage >= 0) &&
									feed.map((item, index) => (
									<ArticleBox final={index == feed.length -1 ? true:false} detail={item} key={index} />
								))}

								{ (isEmpty) &&
									<EmptyStory
										title="No Story, yet"
										description={
											<div>
												There are no stories in this column right now. Wanna back to see
												<Link
													to="/stories/columns"
													style={{
														color: theme.accentColor,
														padding: '0 0.5em 0 0.5em'
													}}>
													other columns
												</Link>
												?
											</div>
										}
									/>
								}

								{ (!isEmpty && !(totalPages > currentPage && currentPage >= 0)) &&
									<EmptyStory
										title="No More Story"
										description={
											<div>
												There are no more stories in this page. Go back to
												<Link
													to={"/stories/" + this.state.column.slug + "?page=1"}
													style={{
														color: theme.accentColor,
														padding: '0 0.5em 0 0.5em'
													}}>
													first page
												</Link>of this column
												?
											</div>
										}
										hideButton={true}
									/>
								}

								<Page>
									{ (totalPages > currentPage && currentPage >= 0) &&
										<Pagination
											hideFirstAndLastPageLinks={utils.isMobile() ? false : true}
											hidePreviousAndNextPageLinks={utils.isMobile() ? true : false}
											boundaryPagesRange={utils.isMobile() ? 0 : 1}
											currentPage={currentPage + 1}
											totalPages={totalPages}
											onChange={this.changePage}
										/>
									}
								</Page>
							</div>
						}
					</Main>

					<Aside>
						<Stick topOffset={70} style={{ zIndex: '0' }}>
							<TrendingSideBar />
						</Stick>
					</Aside>

				</Content>

				<BackToTop scrollStepInPx="200" delayInMs="16.66" showOnTop="600" />
				<Footer />
			</Wrapper>
		)
	}
}

export default ColumnPage
