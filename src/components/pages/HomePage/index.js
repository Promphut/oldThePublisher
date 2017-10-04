import React from 'react'
import PropTypes from 'prop-types'
import {
	TopBarWithNavigation,
	ArticleBox,
	BGImg,
	Footer,
	StaffPickSideBar,
	TopHome,
	TopVideoHome,
	TopNewsHome,
	LogoLink,
	BackToTop,
	BgWithLogo,
	Stick,
	SeeMore
} from 'components'
import styled from 'styled-components'
import api from '../../../services/api'
import slider from 'react-slick'
import InfiniteScroll from 'react-infinite-scroller'
import CircularProgress from 'material-ui/CircularProgress'
import LinearProgress from 'material-ui/LinearProgress'
import FontIcon from 'material-ui/FontIcon'
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'
import utils from '../../../services/utils'
import isEmpty from 'lodash/isEmpty'
import config from '../../../config'

const Wrapper = styled.div`
	@media (max-width:480px) {
		max-width: 100%;
		width:100%;
  }
`

const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	padding: 40px 0 0 0;
	min-height: calc(100vh - ${props => (props.isMobile ? '261px' : '261px')});

	@media (max-width:480px) {
		padding: 0;
  }
	@media (min-width: 768px) and (max-width: 992px) {
		padding: 20px 0 0 0;
  }

`

const Main = styled.div`
	flex: 3 780px;
	max-width: 780px;
	@media (max-width:480px) {
    flex: 0 100%;
		max-width: 100%;
		padding:0 16px 0 16px;
  }
	@media (min-width: 768px) and (max-width: 992px) {
    flex: 3 720px;
		max-width: 720px;
  }
`
const Feed = styled.div`
	flex: 12 1120px;
	max-width: 1120px;
	display:flex;
	@media (max-width:480px) {
    flex: 0 100%;
		max-width: 100%;
		padding:0 15px 0 15px;
  }
`

const Aside = styled.div`
	flex: 1 300px;
	max-width: 300px;
	margin-left:60px;
	z-index: 9;
	@media (max-width: 1160px) {
		display:none;
	}
`
const Text = styled.div`
	color:#8F8F8F;
	font-size:19px;
`
const Dash = styled.div`
  margin:5px 0 0 0;
  width:30px;
  height:4px;
  background-color:${props => props.theme.accentColor};
`

const TextLine = styled.div`
  color:${props => props.theme.primaryColor};
  font-size:28px;
  font-weight:bold;
`
const Onload = styled.div`
	width:100%;
	height:70px;
	margin:50px 0 50px 0;
`

const MiniBoxDark = styled.div`
	flex:1;
	height:222px;
	background-color:${props => props.theme.primaryColor};
	display:flex;
  align-items: center;
  justify-content: center;
`
const Line = styled.div`
  position:relative;
  top:-2px;
  z-index:-5;
  width:100%;
  height:1px;
  background-color:#C4C4C4;
`
const BG = styled(BGImg)`
	width:100%;
	height:350px;
	display:flex !important;
	align-items:center !important;
	justify-content:center !important;
`
const Tagline = styled.div`
	font-size:20px;
	margin:0 auto 0 auto;
	width:600px;
	text-align:center;
	color:white;
`
const Img = styled.img`
	width:749px;
	height:100px;
`
const ImgGif = styled.img`
	width:849px;
	height:200px;
`

const SeemoreContainer = styled.div`
	margin-top: 26px;
	width: 100%;
	display: flex;
	justify-content: center;
	@media (max-width:480px) {
		margin-bottom: 26px;
		padding-bottom:26px;
  	}
`

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

class HomePage extends React.Component {
	static contextTypes = {
		setting: PropTypes.object
	}

	state = {
		isMobile: false,
		completed: 0,
		selectTab: 0,

		page: 0,
		feedCount: 1,
		feed: [],
		hasMoreFeed: true,
		animate: false
	}

	constructor(props) {
		super(props)

		this.publisher = {
			cover: {}
		}
		this.writer = []
		this.column = []
	}

	FEED_LIMIT = utils.isMobile() ? config.FEED_LIMIT_MOBILE : config.FEED_LIMIT

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
	reloadFeed = () => {
		this.setState(
			{
				page: 0,
				feedCount: 1,
				feed: [],
				hasMoreFeed: true
			},
			() => {
				this.loadFeed(this.state.tag._id)()
			}
		)
	}
	loadFeed = () => {
		return () => {
			//console.log('LOAD FEED0', tagId, this.loading)
			// ensure this method is called only once at a time
			if (this.loading === true) return
			this.loading = true
			//console.log('LOAD FEED1')

			let page = this.state.page
			//console.log('page', page)

			api
				.getFeed(
					'article',
					{ status: 1 },
					'latest',
					null,
					page,
					this.FEED_LIMIT
				)
				.then(result => {
					let feed = this.state.feed.concat(result.feed)
					this.setState(
						{
							page: ++page,
							feed: feed,
							feedCount: result.count['1'] ? result.count['1'] : 0,
							hasMoreFeed: feed.length < this.FEED_LIMIT ? false : page < 2
						},
						() => {
							this.loading = false
						}
					)
				})
		}
	}

	// getPublisher = () => {
	// 	api.getPublisher().then(pub => {
	// 		this.publisher = pub

	// 		this.setState({})
	// 	})
	// }

	handleChangeTab = e => {
		this.setState({ selectTab: e })
	}

	componentDidMount() {
		this.setState({
			isMobile: utils.isMobile(),
			completed: 100
		})
		// this.interval = setInterval(()=>{
		// 	this.setState({
		// 		animate:!this.state.animate
		// 	})
		// },10000)
	}
	componentWillUnmount() {
		//clearInterval(this.interval)
	}

	render() {
		let { isMobile, completed, selectTab } = this.state
		let { feedCount, feed, hasMoreFeed, animate } = this.state
		let pub = this.context.setting.publisher
		let { theme } = this.context.setting.publisher

		//console.log(this.state.feedCount)
		//if(feed.length==0) return <div></div>

		return (
			<Wrapper>
				{!isEmpty(pub) && !utils.isMobile() && <BgWithLogo data={pub} />}

				<TopBarWithNavigation special={true} onLoading={this.props.onLoading} />

				<TopHome />

				{/*<TopVideoHome className='hidden-mob'></TopVideoHome>*/}
				<Content isMobile={isMobile}>
					<Main>
						<TextLine className="sans-font hidden-mob">LATEST STORIES</TextLine>
						<Dash className="hidden-mob" style={{ margin: '5px 0 10px 0' }} />
						{!isMobile &&
							<InfiniteScroll
								loadMore={this.loadFeed()}
								hasMore={hasMoreFeed}
								loader={this.onload()}>
								<div>
									{feed.length != 0 &&
										feed.map((item, index) => (
											<ArticleBox
												id={index == 0 ? "FirstAricle":""}
												final={index == feed.length - 1 ? true : false}
												detail={item}
												key={index}
											/>
										))}
								</div>
							</InfiniteScroll>}

						{!hasMoreFeed &&
							!isMobile &&
							<SeemoreContainer>
								<SeeMore url={'/stories/all?type=article&sort=latest&page=1'} />
							</SeemoreContainer>}

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
								label="Stories"
								value={0}
							/>
							<Tab
								buttonStyle={{
									...styles.tab,
									color: selectTab == 1 ? '#222' : '#c4c4c4'
								}}
								label="News"
								value={1}
							/>
							{/*<Tab
			                  buttonStyle={{...styles.tab,color: selectTab == 2 ? '#222' : '#c4c4c4'}}
			                  label="Video"
			                  value={2}
			                />*/}
						</Tabs>

						{/*<Line />*/}

						{utils.isMobile() &&
							<SwipeableViews
								index={selectTab}
								animateHeight={true}
								disableLazyLoading={true}
								style={{overflow:'hidden'}}
								onChangeIndex={this.handleChangeTab}
								className="hidden-des">
								{/*<div className='story'>
								{feed && utils.isMobile() && feed.map((story, index) => (
									<ArticleBox detail={story} key={index}/>
								))}
							</div>*/}
								<div>
									<InfiniteScroll
										loadMore={this.loadFeed()}
										hasMore={hasMoreFeed}
										loader={this.onload()}>
										<div>
											{feed.length != 0 &&
												feed.map((item, index) => (
													<ArticleBox
														final={index == feed.length - 1 ? true : false}
														detail={item}
														key={index}
													/>
												))}
										</div>
									</InfiniteScroll>

									{!hasMoreFeed &&
										<SeemoreContainer>
											<SeeMore
												url={'/stories/all?type=article&sort=latest&page=1'}
											/>
										</SeemoreContainer>}
								</div>

								<div className="news">
									<TopNewsHome />
								</div>

								{/*<div className='video'>

							</div>*/}
							</SwipeableViews>}
					</Main>
					<Aside>
						<Stick topOffset={100}>
							<div
								dangerouslySetInnerHTML={{
									__html: `<div class="fb-page" data-href="https://www.facebook.com/${config.FACEBOOK}/" data-tabs="timeline" data-height="400" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"><blockquote cite="https://www.facebook.com/${config.FACEBOOK}/" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/${config.FACEBOOK}/">${config.NAME}</a></blockquote></div>`
								}}
							/>
						</Stick>
						{/* <StaffPickSideBar></StaffPickSideBar>
						<TopNewsHome/> */}
					</Aside>
				</Content>

				<BackToTop scrollStepInPx="800" delayInMs="16.66" showOnTop="1800" />
				<Footer />
			</Wrapper>
		)
	}
}

export default HomePage
