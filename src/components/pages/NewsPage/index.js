import React from 'react'
import PropTypes from 'prop-types'
import {
	TopBarWithNavigation,
	TopWriterSidebar,
	BGImg,
	NewsBox,
	Footer,
	TopNewsBox,
	BackToTop,
	SeeMore
} from 'components'
import styled from 'styled-components'
import api from '../../../services/api'
import slider from 'react-slick'
import InfiniteScroll from 'react-infinite-scroller'
import CircularProgress from 'material-ui/CircularProgress'
import LinearProgress from 'material-ui/LinearProgress'
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'
import utils from '../../../services/utils'
import config from '../../../config'

const Wrapper = styled.div`
	@media (max-width:480px) {
		max-width: 100%;
		width:100%;
		.paddingTop{
			padding-top:10px;
		}
  }
	.center{
		margin:0 auto 0 auto;
	}
	.paddingTop{
		padding-top:40px;
	}
`

const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	padding: 40px 0 0 0;
	@media (max-width:480px) {
		padding: 10px 0 0 0;
  }
	@media (min-width: 481px) {

	}
	@media (min-width: 768px) and (max-width: 992px) {
		padding: 20px 0 0 0;
  }
`

const Main = styled.div`
	flex: 3 731px;
	max-width: 731px;
	@media (max-width:480px) {
    flex: 0 100%;
		max-width: 100%;
		padding:0 15px 0 15px;
  }
`
const Feed = styled.div`
	flex: 12 1120px;
	max-width: 1120px;
	@media (max-width:480px) {
    flex: 0 100%;
		max-width: 100%;
		padding:0 15px 0 15px;
  }
	@media (min-width: 768px) and (max-width: 992px) {
		flex: 12 720px;
		max-width: 720px;
  }
`

const Aside = styled.div`
	flex: 1 350px;
	max-width: 350px;
	margin-left:25px;
	@media (max-width: 1160px) {
		display:none;
	}
`
const Text = styled.div`
	color:#8E8E8E;
	font-size:16px;
	font-weight:normal;
	text-align:center;
	width:864px;
	padding:35px 0 35px 0;
	@media (max-width: 480px) {
		width:100%;
		padding:15px;
	}
	@media (min-width: 768px) and (max-width: 992px) {
		width:100%;
		padding:25px 0 25px 0;
  }
`

const TextLine = styled.div`
	color:#8F8F8F;
	font-size:19px;
	border-bottom:1px solid #E2E2E2;
	padding-bottom:11px;
`

const Onload = styled.div`
	width:100%;
	height:70px;
	margin:50px 0 50px 0;
`

const Line = styled.div`
  position:relative;
  top:-41px;
  z-index:-5;
  width:100%;
  height:1px;
  background-color:#C4C4C4;
	@media (min-width: 768px) and (max-width: 992px) {
		top:-32px;
		width:720px;
		margin:0 auto 0 auto;
  }
`

const Latest = styled.div`
	margin:30px 0 0 0;
	padding-bottom:30px;
`

const Trending = styled.div`
	margin:30px 0 0 0;
	padding-bottom:30px;
`

const Head = styled.div`
	font-size:64px;
	font-weight:bold;
	text-align:center;
	padding:0 25px 0 25px;
	margin:0 auto 0 auto;
	background:white;
	width:280px;
	@media (min-width: 768px) and (max-width: 992px) {
		font-size:48px;
		width:220px;
  }
`

const News = styled.div`
	font-size:18px;
	color:white;
	z-index:0;
	height:60px;
	text-align:center;
	vertical-align: middle;
	@media (max-width: 480px) {
		z-index:1000;
	}

`

const SeemoreContainer = styled.div`
	margin-top: 26px;
	margin-bottom: 1px;
	width: 100%;
	display: flex;
	justify-content: center;
	@media (max-width:480px) {
		margin-bottom: 26px;
  	}
`

class NewsPage extends React.Component {
	static contextTypes = {
		setting: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.writer = []
		this.column = []

		this.state = {
			page: 0,
			page2: 0,
			feedCount: 1,
			feedCount2: 1,
			feedLatest: [],
			feedTrend: [],
			hasMoreFeed: true,
			hasMoreFeed2: true,

			trendingNews: [],

			isMobile: false,
			selectTab: 0,
			shortDesc: ''
		}
	}

	FEED_LIMIT = utils.isMobile() ? config.FEED_LIMIT_MOBILE : config.FEED_LIMIT;

	getTrendingNews = () => {
		api.getFeed('news', { status: 1 }, 'trending', null, 0, 4).then(result => {
			if (result) {
				this.setState({
					trendingNews: result.feed
				})
			}
		})
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
		return () => {
			// ensure this method is called only once at a time
			if (this.loading === true) return
			this.loading = true
			let page = this.state.page
			//console.log('page', page)
			api.getFeed('news', { status: 1 }, 'latest', null, page, this.FEED_LIMIT)
			.then(result => {
					let feed = this.state.feedLatest.concat(result.feed)
					this.setState(
						{
							page: ++page,
							feedLatest: feed,
							feedCount: result.count['1']?result.count['1']:0,
							hasMoreFeed: feed.length < this.FEED_LIMIT ? false : (page < 2)
						},
						() => {
							this.loading = false
						}
					)
			})
		}
	}

	loadFeed2 = () => {
		return () => {
			// ensure this method is called only once at a time
			if (this.loading === true) return
			this.loading = true
			let page = this.state.page2
			//console.log('page', page)
			api.getFeed('news', { status: 1 }, 'trending', null, page, this.FEED_LIMIT)
			.then(result => {
					let feed = this.state.feedTrend.concat(result.feed)
					this.setState(
						{
							page2: ++page,
							feedTrend: feed,
							feedCount2: result.count['1']?result.count['1']:0,
							hasMoreFeed2: feed.length < this.FEED_LIMIT ? false : (page < 2)
						},
						() => {
							this.loading = false
						}
					)
			})
		}
	}

	handleChangeTab = e => {
		this.setState({ selectTab: e })
	}

	componentDidMount() {
		this.getTrendingNews()
		this.setState({
			isMobile: utils.isMobile()
		})
		api.getColumnFromSlug('news').then(col => {
			this.setState({ shortDesc: col.shortDesc })
		}).catch((er)=>{
			this.setState({ shortDesc: '' })
		})
	}

	render() {
		let {
			feedCount,
			feedCount2,
			feedLatest,
			feedTrend,
			hasMoreFeed,
			hasMoreFeed2,
			trendingNews,
			isMobile,
			selectTab,
			shortDesc
		} = this.state
		let pub = this.context.setting.publisher
		let { theme } = this.context.setting.publisher
		const styles = {
			headline: {
				fontSize: 24,
				paddingTop: 16,
				marginBottom: 12,
				fontWeight: 400
			},
			tabs: {
				background: 'none',
				height: '60px',
				color: '#222222'
			},
			tab: {
				fontFamily: "'Nunito', 'Mitr'",
				fontSize: '20px',
				fontWeight: 'bold',
				textTransform: 'none'
			}
		}

		return (
			<Wrapper>
				<TopBarWithNavigation onLoading={this.props.onLoading} />
				<News>News</News>
				{!isMobile
					? <Content>
							<Feed>
								<Head className="serif-font hidden-mob">NEWS</Head>
								<Line className="hidden-mob" />
								<Text className="center">{shortDesc}</Text>
							</Feed>
						</Content>
					: ''}
				<TopNewsBox className='hidden-mob' data={trendingNews} />
				<Content>
					<Feed>
						<Tabs
							style={{ width: '100%' }}
							tabItemContainerStyle={{ ...styles.tabs }}
							inkBarStyle={{ background: theme.accentColor, height: 3 }}
							onChange={this.handleChangeTab}
							value={selectTab}
							className="hidden-des">
							<Tab
								buttonStyle={{
									...styles.tab,
									color: selectTab == 0 ? '#222' : '#c4c4c4'
								}}
								label="Latest"
								value={0}
							/>
							<Tab
								buttonStyle={{
									...styles.tab,
									color: selectTab == 1 ? '#222' : '#c4c4c4'
								}}
								label="Trending"
								value={1}
							/>
						</Tabs>
						<Tabs
							style={{ width: 360 }}
							tabItemContainerStyle={{ ...styles.tabs }}
							inkBarStyle={{ background: theme.accentColor, height: 3 }}
							onChange={this.handleChangeTab}
							value={selectTab}
							className="hidden-mob">
							<Tab
								buttonStyle={{
									...styles.tab,
									color: selectTab == 0 ? '#222' : '#c4c4c4'
								}}
								label="LATEST NEWS"
								value={0}
							/>
							<Tab
								buttonStyle={{
									...styles.tab,
									color: selectTab == 1 ? '#222' : '#c4c4c4'
								}}
								label="TRENDING"
								value={1}
							/>
						</Tabs>
						<Line style={{top:-1}} />

						<SwipeableViews
							index={selectTab}
							disableLazyLoading={true}
							animateHeight={true}
							style={{overflow:'hidden'}}
							onChangeIndex={this.handleChangeTab}>
							
							<Latest>
								<InfiniteScroll
									loadMore={this.loadFeed()}
									hasMore={hasMoreFeed}
									loader={this.onload()}>
									<div>
										{feedLatest.map((item, index) => (
											<NewsBox final= {index == feedLatest.length -1 ? true:false} detail={item} key={index} timeline={true} />
										))}
									</div>
								</InfiniteScroll>
								{!hasMoreFeed && 
								<SeemoreContainer>
									<SeeMore url={'/stories/all?type=news&sort=latest&page=1'}/>
								</SeemoreContainer>}
							</Latest>
							<Trending>

								{selectTab==1&&<InfiniteScroll
									loadMore={this.loadFeed2()}
									hasMore={hasMoreFeed2}
									loader={this.onload()}>
									<div>
										{feedTrend.map((item, index) => (
											<NewsBox final= {index == feedTrend.length -1 ? true:false} detail={item} key={index} timeline={false} />
										))}
									</div>
								</InfiniteScroll>}
								
								{!hasMoreFeed2 && 
								<SeemoreContainer>
									<SeeMore url={'/stories/all?type=news&sort=trending&page=1'}/>
								</SeemoreContainer>}
								
							</Trending>
						</SwipeableViews>
					</Feed>
				</Content>
				<BackToTop scrollStepInPx="200" delayInMs="16.66" showOnTop="600" />
				<Footer />
			</Wrapper>
		)
	}
}

export default NewsPage
