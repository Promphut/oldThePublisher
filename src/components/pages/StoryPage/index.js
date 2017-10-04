import React from 'react'
import PropTypes from 'prop-types'
import {
	TopBarWithNavigation,
	StoryDetail,
	RecommendArticle,
	TrendingSideBar,
	Stick,
	ShareSideBar,
	BGImg,
	RecommendContainer,
	Footer,
	BackToTop,
	NextStory,
	NextStoryMobile,
	ShareBottom
} from 'components'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { findDOMNode as dom } from 'react-dom'
import api from '../../../services/api'
import { StickyContainer, Sticky } from 'react-sticky'
import { Helmet } from 'react-helmet'
import config from '../../../config'
import utils from '../../../services/utils'
import auth from '../../../services/auth'
import isEmpty from 'lodash/isEmpty'
import Request from 'superagent'

const Wrapper = styled.div`
	 .hidden-des{
	  	display:none;
	  }
	@media(max-width:480px){
	  .hidden-des{
	  	display:block;
	  }
		.hidden-mob{
			display:none;
		}
    .center{
      justify-content: center;
    }
		.recommends{
			font-size:16px;
		}
  }
`

const GradientOverlay = styled.div`
	background: -moz-linear-gradient(-45deg,  rgba(202,130,172,0.3) 0%, rgba(49,77,170,0.3) 100%);
	background: -webkit-linear-gradient(-45deg,  rgba(202,130,172,0.3) 0%,rgba(49,77,170,0.3) 100%);
	background: linear-gradient(135deg,  rgba(202,130,172,0.3) 0%,rgba(49,77,170,0.3) 100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4dca82ac', endColorstr='#4d314daa',GradientType=1 );

	bottom:0;
	top:0; left:0;
	right:0;
	position:absolute;
	z-index:0
`

const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;

	padding-top: ${props => props.paddingTop}
`
const Content2 = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
`

const Share = styled.div`
	flex: 1 120px;
	position:relative;
	max-width: 120px;
	margin:150px 0 0 0;
	@media (max-width: 850px) {
		display:none;
	}
`

const LikeBoxContainer = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto 24px auto;
`

const Main = styled.div`
	flex: 8 730px;
	max-width: 730px;
	margin-top: 40px;
	min-height: calc(100vh - ${props => (props.isMobile ? '261px' : '261px')});

	@media (max-width: 480px) {
		margin-top: 10px;
		flex:0 100%;
		max-width: 100%;
		padding:0 15px 0 15px;
	}
`
const Main2 = styled.div`
	flex: 8 850px;
	max-width: 850px;
	margin-top: 20px;
	@media (max-width: 480px) {
		margin-top: 10px;
		flex:0 100%;
		max-width: 100%;
		padding:0 15px 0 15px;
	}
`

const Aside = styled.div`
	flex: 3 385px;
	position:relative;
	max-width: 385px;
	padding:0 0 0 60px;
	margin:60px 0 0 0;
	@media (max-width: 1280px) {
		display:none;
	}
`
const BG = styled(BGImg)`
	width: 100%;
	height: 85vh;
	background-position-y: bottom;
	@media (min-width: 768px) and (max-width: 992px) {
		height: 384px;
  }
`

const Cover = styled.div`
	position:relative;
	top:0;
	left:0;
	width:100%;
	height:100%;
	background: rgba(34,34,34,0.64);
	background: -moz-linear-gradient(top, rgba(34,34,34,0.64) 0%, rgba(0,0,0,0.64) 0%, rgba(0,0,0,0) 20%);
	background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(34,34,34,0.64)), color-stop(0%, rgba(0,0,0,0.64)), color-stop(20%, rgba(0,0,0,0)));
	background: -webkit-linear-gradient(top, rgba(34,34,34,0.64) 0%, rgba(0,0,0,0.64) 0%, rgba(0,0,0,0) 20%);
	background: -o-linear-gradient(top, rgba(34,34,34,0.64) 0%, rgba(0,0,0,0.64) 0%, rgba(0,0,0,0) 20%);
	background: -ms-linear-gradient(top, rgba(34,34,34,0.64) 0%, rgba(0,0,0,0.64) 0%, rgba(0,0,0,0) 20%);
	background: linear-gradient(to bottom, rgba(34,34,34,0.64) 0%, rgba(0,0,0,0.64) 0%, rgba(0,0,0,0) 20%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#222222', endColorstr='#000000', GradientType=0 );
`

class StoryPage extends React.Component {
	state = {
		recommends: [],
		description: '',
		showTopbarTitle: false,
		story: {},
		fb: 0
	}
	static contextTypes = {
		setting: PropTypes.object
	}
	constructor(props) {
		super(props)
	}

	getRecommendStories = () => {
		var { story } = this.state
		if (story.column) {
			// Get recommend from column
			let cid = story.column._id

			api
				.getFeed('story', { status: 1, column: cid }, 'latest', null, 0, 4, {
					omit: [this.props.match.params.sid]
				})
				.then(result => {
					//console.log('feed', result.feed.length)
					this.setState({
						recommends: result.feed
					})
				})
		} else {
			// If no column presented, use writer instead
			let uid = story.writer._id

			api
				.getFeed('story', { status: 1, writer: uid }, 'latest', null, 0, 4, {
					omit: [this.props.match.params.sid]
				})
				.then(result => {
					//console.log('feed', result.feed.length)
					this.setState({
						recommends: result.feed
					})
				})
		}
	}

	getStoryFromSid = (sid, done = () => {}) => {
		if (sid == null) utils.notFound(this.props.history)

		api
			.getStoryFromSid(sid, auth.getToken(), this.props.countView)
			.then(result => {
				this.setState({
					story: result.story
				})
			})
			.catch(err => {
				utils.toError(this.props.history, err)
			})
	}

	handleScroll = event => {
		var top = dom(this.refs.TT).getBoundingClientRect().top
		if (top < -110) {
			this.setState({
				showTopbarTitle: true
			})
		} else {
			if (this.state.showTopbarTitle) {
				this.setState({
					showTopbarTitle: false
				})
			} else {
				return
			}
		}
	}

	componentDidMount() {
		this.getStoryFromSid(this.props.match.params.sid, () => {
			this.getRecommendStories()
			//this.findDescription()
		})
		window.addEventListener('scroll', this.handleScroll)

		// Request.get(
		// 	'https://graph.facebook.com/?id=' +
		// 		config.FRONTURL +
		// 		this.props.location.pathname
		// ).end((er, res) => {
		// 	const fb = res ? res.body.share.share_count : 0
		// 	//console.log(res.body)
		// 	this.setState({ fb })
		// })
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.pathname != this.props.location.pathname) {
			this.getStoryFromSid(nextProps.match.params.sid, () => {
				this.getRecommendStories()
				//this.findDescription()
			})
		}
	}

	render() {
		const isMobile = utils.isMobile()
		let { keywords, channels } = this.context.setting.publisher
		let { recommends, description, showTopbarTitle, story, fb } = this.state
		let likeBoxSize = 500
		//console.log(story.shares)
		let hasCover = false
		let nextStoryContainer = <div></div>

		if (!isEmpty(story)) {
			if (isMobile) {

				likeBoxSize = 300
				nextStoryContainer = <NextStoryMobile
					cid={story.column._id}
					currentID={story._id}
					format={story.format}/>

				if (
					story.coverMobile.medium !=
					config.BACKURL + '/imgs/article_cover_portrait.png'
				) {
					hasCover = true
				}
			} else {

				nextStoryContainer = <NextStory
					cid={story.column._id}
					currentID={story._id}
					format={story.format}/>
				if (
					story.cover.medium !=
					config.BACKURL + '/imgs/article_cover_landscape.png'
				) {
					hasCover = true
				}
			}
		}

		//console.log('render', story)
		if (isEmpty(story)) return <div ref="TT" />
		else
			return (
				<div>
					<Helmet>
						<title>{story.ptitle}</title>
						<meta name="title" content={story.ptitle} />
						<meta name="keywords" content={keywords} />
						<meta name="description" content={story.shortDesc} />
					</Helmet>

					<Wrapper>
						<TopBarWithNavigation
							onLoading={this.props.onLoading}
							article={story.title}
							showTitle={showTopbarTitle}
							editButton={'/me/stories/' + story.id + '/edit'}
							hasCover={hasCover}
							share={story.shares && story.shares}
						/>

						{story.cover.medium !=
							config.BACKURL + '/imgs/article_cover_landscape.png' &&
							<BG
								src={story.cover.large || story.cover.medium}
								className="hidden-mob"
								alt={story.title}>
								<Cover />
							</BG>}
						{story.coverMobile.medium !=
							config.BACKURL + '/imgs/article_cover_portrait.png' &&
							<BGImg
								style={{ width: '100%', height: '85vh' }}
								src={story.coverMobile.large || story.coverMobile.medium}
								className="hidden-des"
								alt={story.title}>
								<Cover />
							</BGImg>}
						<Content paddingTop={hasCover ? '0px' : '60px'}>
							<Share ref="share" style={{ zIndex: '50' }}>
								<Stick topOffset={100}>
									<ShareSideBar
										shareCount={story.shares && story.shares.total}
										url={config.FRONTURL+story.url}
									/>
								</Stick>
							</Share>

							<Main ref={'TT'} isMobile={isMobile}>
								<StoryDetail share={story.shares && story.shares} story={story} id='storyDetail'/>
							</Main>

							{utils.isMobile() && nextStoryContainer}


							<Aside id="trendingBar" ref="trendingBar">

								<TrendingSideBar sid={story._id} />
								<div
									dangerouslySetInnerHTML={{
										__html: `<div class="fb-page" data-href="https://www.facebook.com/${config.FACEBOOK}/" data-tabs="timeline" data-height="700" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"><blockquote cite="https://www.facebook.com/${config.FACEBOOK}/" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/${config.FACEBOOK}/">${config.NAME}</a></blockquote></div>`
									}}
								/>

							</Aside>

						</Content>

						<Content2>
							<Share/>
							<Main2>
									<LikeBoxContainer
										dangerouslySetInnerHTML={{
											__html: `<div class="fb-page" data-href="https://www.facebook.com/${config.FACEBOOK}" data-tabs="timeline" data-width="${likeBoxSize}" data-height="300" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"><blockquote cite="https://www.facebook.com/${config.FACEBOOK}/" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/${config.FACEBOOK}/">${config.NAME}</a></blockquote></div>`
										}}
									/>
							</Main2>
							<Aside/>
						</Content2>

						<Content>
							{recommends.length != 0 &&
								<RecommendContainer recommend={recommends} />}
						</Content>

						{utils.isMobile() && <ShareBottom url={config.FRONTURL+story.url} sid={story.id}/>}

						{!utils.isMobile() && nextStoryContainer}

						{/* <BackToTop scrollStepInPx="200" delayInMs="16.66" showOnTop="1800" /> */}
						<Footer isStoryPage={true} />
					</Wrapper>
				</div>
			)
	}
}

export default StoryPage
