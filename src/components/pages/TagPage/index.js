import React from 'react'
import {
	TopBarWithNavigation,
	ArticleBox,
	ArticleBoxLarge,
	TrendingSideBar,
	BGImg,
	StoryMenu,
	Stick,
	Footer,
	TagSideBar,
	EmptyStory,
	BackToTop,
	Pagination
} from 'components'
import { Link } from 'react-router-dom'
import { findDOMNode as dom } from 'react-dom'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import api from '../../../services/api'
import CircularProgress from 'material-ui/CircularProgress'
import utils from '../../../services/utils'
import config from '../../../config'

const Wrapper = styled.div`

`

const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	padding:50px 20px 0;
	min-height: calc(100vh - ${props => (props.isMobile ? '200px' : '320px')});
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
	margin: 120px 0 0 20%;

	@media (max-width: 768px) {
		margin: 120px 5% 0 5%;
  }

	@media (max-width: 480px) {
		margin: 72px 5% 0 5%;
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

const TextLine = styled.div`
	color:#8F8F8F;
	font-size:19px;
	border-bottom:1px solid #E2E2E2;
	padding-bottom:11px;
`

const ColumnName = styled.div`
  color:#fff;
  font-size:48px;
  font-weight:bold;

	@media (max-width:480px) {
  	font-size: 16px;
  }
`

const TagName = styled.div`
  font-size:32px;
  font-weight:bold;
  color:${props => props.theme.primaryColor};
`

const ColumnDetail = styled.div`
	color:#fff;
  font-size:16px;
	font-family:'Mitr';
	margin-top:15px;

	@media (max-width:480px) {
  	font-size: 12px;
		margin-top: 8px;
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
    padding:20px 0 20px 0;
`

class TagPage extends React.Component {

	FEED_LIMIT = utils.isMobile() ? config.FEED_LIMIT_MOBILE*2 : config.FEED_LIMIT;

	static contextTypes = {
		setting: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			isMobile: false,
			tag: {},

			currentPage: utils.querystring('page',this.props.location) ? utils.querystring('page',this.props.location) - 1 : 0,
			feedCount: 1,
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
		
		if (this.state.loading === true) return
	
		this.state.loading = true

		let currentPage = this.state.currentPage
		let tagId = this.state.tag._id

		api.getFeed('story', { status: 1, tags: tagId }, 'latest', null, currentPage, this.FEED_LIMIT)
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
	}

	getTagFromSlug = (tagSlug, done = () => {}) => {
		//console.log('PROP', this.props)
		if (!tagSlug) utils.notFound(this.props.history)

		api.getTagFromTagSlug(tagSlug)
			.then(tag => {
				this.setState({ tag: tag }, done)
			})
			.catch(err => {
				utils.toError(this.props.history, err)
			})
	}

	changePage = e => {
        this.props.history.push({ search: "?page=" + e})
    }

	componentDidMount() {
		this.getTagFromSlug(this.props.match.params.tagSlug, this.loadFeed)

		this.setState({
			isMobile: utils.isMobile()
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.tagSlug != this.props.match.params.tagSlug) {
			this.getTagFromSlug(nextProps.match.params.tagSlug, this.loadFeed)
		} else if(nextProps.location.search != this.props.location.search){
            document.body.scrollTop = document.documentElement.scrollTop = 0
            this.setState({
				currentPage : utils.querystring('page',nextProps.location) ? utils.querystring('page',nextProps.location)-1 : 0 ,
				feed: [],
			},()=>{
				this.loadFeed()
            })
        }
	}

	render() {
		//const BGImgSize = (utils.isMobile() ? 100 : 280) + 60
		let { theme } = this.context.setting.publisher
		let { column, isMobile, tag, feedCount, feed, isEmpty, currentPage, totalPages, loading, initialLoading } = this.state

		return (
			<Wrapper>
				<TopBarWithNavigation
					onLoading={this.props.onLoading}
				/>

				<Content isMobile={isMobile}>
					<Main>
						<TextLine
							className="sans-font"
							style={{ border: 'none', marginTop: '60px' }}>
							tag
						</TextLine>
						<TagName
							className="nunito-font"
							style={{ margin: '10px 0 50px 0' }}>
							{tag.name}
						</TagName>

						{ (loading || initialLoading) ? this.onload() :
							<div>
								{ (feed && currentPage >= 0) &&
									<TextLine className="sans-font">Latest</TextLine>
								}

								{ (feed && currentPage >= 0) &&
									feed.map((item, index) => (
									<ArticleBox final={index == feed.length -1 ? true:false} detail={item} key={index} />))
								}

								{ (isEmpty) &&
									<EmptyStory
										title="No Story, yet"
										description={
											<div>
												There are no stories in this tag right now. Wanna back to
												<Link
													to="/"
													style={{
														color: theme.accentColor,
														padding: '0 0.5em 0 0.5em'
													}}>
													home
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
												There are no more stories in this tag. Go back to
												<Link
													to={"/tags/" + this.state.tag.slug  + "?page=1"}
													style={{
														color: theme.accentColor,
														padding: '0 0.5em 0 0.5em'
													}}>
													first page
												</Link>
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
				

					{/* {feedCount <= 0
						? <Main>
								<TextLine
									className="sans-font"
									style={{ border: 'none', marginTop: '60px' }}>
									tag
								</TextLine>
								<TagName
									className="nunito-font"
									style={{ margin: '10px 0 50px 0' }}>
									{tag.name}
								</TagName>

								<EmptyStory
									title="No Story, yet"
									hideButton={true}
								/>
							</Main>
						: <Main>
								<TextLine
									className="sans-font"
									style={{ border: 'none', marginTop: '60px' }}>
									tag
								</TextLine>
								<TagName
									className="nunito-font"
									style={{ margin: '10px 0 50px 0' }}>
									{tag.name}
								</TagName>

								<TextLine className="sans-font">Latest</TextLine>

								<InfiniteScroll
									loadMore={this.loadFeed(tag._id)}
									hasMore={hasMoreFeed}
									loader={this.onload()}>
									<div>
										{feed.map((item, index) => (
											<ArticleBox detail={item} key={index} />
										))}
									</div>
								</InfiniteScroll>
							</Main>} */}

					<Aside>
						<TagSideBar style={{ marginTop:'50px'}} />
						<TrendingSideBar style={{position:'sticky',top:70}} />
					</Aside>
				</Content>

				<BackToTop scrollStepInPx="200" delayInMs="16.66" showOnTop="600"/>
				<Footer />
			</Wrapper>
		)
	}
}

export default TagPage
