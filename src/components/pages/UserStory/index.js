import React from 'react'
import PropTypes from 'prop-types'
import {
	TopBarWithNavigation,
	ArticleBox,
	BGImg,
	StoryMenu,
	Footer,
	BackToTop,
	Pagination,
	UserSocialBar,
	WriterTopStories
} from 'components'
import { findDOMNode as dom } from 'react-dom'
import { Link } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import Avatar from 'material-ui/Avatar'
import api from '../../../services/api'
import InfiniteScroll from 'react-infinite-scroller'
import CircularProgress from 'material-ui/CircularProgress'
import { Helmet } from 'react-helmet'
import utils from '../../../services/utils'
import config from '../../../config'
import auth from '../../../services/auth'

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	background-color: ${props => (props.haveBg ? '#FAFAFA' : '#FFFFFF')};
`

const ContentWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: stretch;
	min-height: calc(100vh - 250px)
`

const Onload = styled.div`
	width:100%;
	height:70px;
	margin:50px 0 50px 0;
`

const NoArticleHeader = styled.h2`
	width: 100%;
	margin-top: 30px;
	text-align: center;
	font-family: 'Mitr';
	font-size: 16px;
	color: #222222;
	font-weight: normal;
`

const UserAvatar = styled(Avatar)`
	margin-right: 20px;
	float: left;
	@media (max-width: 480px) {
		height: 100px !important;
		width: 100px !important;
		float: none;
		margin-right: 0px;
	}
`

const UserAvatarContainer = styled.div`
	text-align: center;
	margin-bottom: 0;
`

const UserInfoContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding-top: 56px;
	margin-top: 0px;
	margin-bottom: 0px;
`

const UserInfoContainerDesktop = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding-top: 160px;
	margin-top: 0px;
	margin-bottom: 0px;
`

const UserInfoPrimaryText = styled.h1`
	margin-top: 16px;
	margin-bottom: 0px;
	color: white;
	font-weight: bold;
	font-size: 18px;
	font-family: 'Roboto';
`

const UserInfoSecondaryText = styled.h2`
	color: white;
	font-weight: lighter;
	font-size: 14px;
	font-family: PT Sans;
	margin-top: 11px;
	margin-bottom: 0;
`

const UserBlockWrapper = styled.div`
	flex:1 345px;
	max-width: 345px;
	background-color: #FAFAFA;
	margin-top: ${props => (props.mobile ? '0' : '60px')};
`

const DetailBlockWrapper = styled.div`
	flex:1 709px;
	max-width: 709px;
	margin-left: 56px;
	margin-top: ${props => (props.mobile ? '0' : '60px')};
`

const EditorProfilePictureSection = styled.div`
	background-image: url(${props => props.userProfileImage});
	background-position: center;
	background-repeat: no-repeat;
	background-size: 100%;
	height: 250px;
	width: ${props => (props.mobile ? '100%' : '345px')};
	margin-top: 0px;
`

const UserProfileSection = EditorProfilePictureSection.extend`
	background-color: ${props => props.theme.primaryColor};
	height: auto;
	padding-bottom: 20px;
`

const UserInfoSection = styled.div`
	width: 100%;
	background-color: ${props => (props.role === 'admin' ? '#FAFAFA' : 'white')};
	padding-bottom: 24px;
`

const UserInfoSectionDesktop = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding-top: 40px;
	margin-top: 0px;
	margin-bottom: 0px;
`

const SeeMoreDescriptionSection = UserInfoSection.extend`
	height: 100%;
	padding-top: 0;
	padding-bottom: 10px;
	display:flex;
	justify-content: center;
	align-content: center;
`

const ArticleSection = styled.div`
	background-color: white;
	padding: 16px 16px 16px 16px;
`

const TopBarContainer = styled.div`
	position: relative;
	top:8px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%
`

const TopBarItem = styled.div`
	flex: 0;
`

const TopBarLeftItem = TopBarItem.extend`
	align-self: flex-start;
	margin-left: 8px;
	font-size: 16px;
`

const TopBarRightItem = TopBarItem.extend`
	align-self: flex-end;
	margin-right: 8px;
	font-size: 20px;
`

const Card = styled.div`
	width: ${props => (props.mobile ? '90%' : '313px')};
	z-index: 3;
	margin: -16px auto 0 auto;
	padding: 20px 16px 24px 16px;
	box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	background: #FFFFFF;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const CardNormal = styled.div`
	width: 810px;
	margin-top: 116px;
	margin-bottom: 56px;
	padding: 40px;
	box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
	background: #FFFFFF;
	display: flex;
	align-items: flex-start;
	justify-content: center;
`

const CardTitle = styled.h1`
	font-family: Roboto;
	font-weight: bold;
	font-size: 18px;
	color: #000000;
	margin: 0;
`

const CardSubtitle = styled.h2`
	font-family: Roboto;
	font-weight: normal;
	font-size: 14px;
	color: #8E8E8E;
	margin-top: 11px;
	margin-bottom: 0px;
	text-align: center;
`

const Dash = styled.div`
  margin-top: ${props => props.MarginTop};
  width:30px;
  height:4px;
  background-color:${props => props.theme.accentColor};
`

const SocialButtonContainer = styled.div`
	margin-top: 20px;
	margin-bottom: 0px;
`

const ProfileDescription = styled.p`
	width: 90%;
	margin: 20px auto 0 auto;
	text-align: center;
	color: #222222;
	font-weight: lighter;
	font-family: 'CS PraJad';
	font-size: 16px;
	min-height: 100px;
	height: ${props => (props.showDescription ? 'auto' : '100px')};
	display: block;
	white-space: wrap;
	overflow: hidden;
	>span{
		position:relative;
		top: ${props => (props.showDescription ? '0px' : '-100px')};
		z-index:0;
	}
`

const ProfileDescriptionDesktop = styled.p`
	width: 100%;
	height: ${props => (props.showDescription ? 'auto' : '115px')};
	margin: 56px 0 24px 0;
	margin-bottom: ${props => (props.showDescription ? '0' : '24px')};
	color: #222222;
	font-weight: lighter;
	font-family: 'Roboto';
	font-size: 16px;
	line-height: 23px;
	display: block;
	white-space: wrap;
	overflow: hidden;
`

const Blur = styled.div`
	display: ${props => (props.showDescription ? 'none' : 'flex')};
	justify-content: center;
	background: rgba(255,255,255,0);
	background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 95%, rgba(255,255,255,1) 100%);
	background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,255,255,0)), color-stop(95%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)));
	background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 95%, rgba(255,255,255,1) 100%);
	background: -o-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 95%, rgba(255,255,255,1) 100%);
	background: -ms-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 95%, rgba(255,255,255,1) 100%);
	background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 95%, rgba(255,255,255,1) 100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#ffffff', GradientType=0 );
	position:relative;
	width:100%;
	max-height:100px;
	height:100%;
	top:0px;
	z-index:1;
	opacity: ${props => (props.showDescription ? 0 : 1)};
	@media (min-width: 768px) and (max-width: 992px) {
		margin-top:-70px;
		height:70px;
  }
`

const ProfileDescriptionSeeMore = styled.button`
	font-family: Mitr;
	border: 0.5px solid #C4C4C4;
	background-color: #FFFFFF;
	border-radius: 100px;
	font-size: 12px;
	z-index: 10;
	padding: 2px 32px 2px 32px;
	align-self: flex-end;
	&:hover{
		cursor:pointer;
		border: 0.5px solid ${props => props.theme.accentColor};
		color: ${props => props.theme.accentColor};
  	}
`
const SeeMoreWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
`

const ArticleHeader = styled.div`
	margin: 0 auto 6px auto;
	color: #222222;
	font-weight: bold;
	font-size: 18px;
`

const ArticleCount = styled.span`
	color: #222222;
	font-size: 25px;
`

const ArticleWrapper = styled.div`
  	margin-top: ${props => (props.mobile ? '0px' : '56px')};
`

const Page = styled.div`
	display: flex;
  flex-flow: row wrap;
  justify-content: center;
  padding:20px 0 0 0;
`

const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	padding: 0px 0 20px 0;
	min-height: calc(100vh - 421px);
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

export default class UserStory extends React.Component {
	FEED_LIMIT = utils.isMobile()
		? config.FEED_LIMIT_MOBILE * 2
		: config.FEED_LIMIT

	static contextTypes = {
		setting: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			user: null,
			isMobile: false,

			currentPage: utils.querystring('page', this.props.location)
				? utils.querystring('page', this.props.location) - 1
				: 0,
			feedCount: 0,
			feed: [],
			totalPages: 0,
			isNormalUser: true,
			isEmpty: false,

			loading: false,

			showDescription: false
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
		if (this.state.user._id == null) return
		// ensure this method is called only once at a time
		if (this.state.loading === true) return

		this.state.loading = true

		let currentPage = this.state.currentPage
		let uid = this.state.user._id

		api
			.getFeed(
				'story',
				{ writer: uid, status: 1 },
				'latest',
				null,
				currentPage,
				this.FEED_LIMIT
			)
			.then(result => {
				this.setState(
					{
						feed: result.feed,
						feedCount: result.count['1'] ? result.count['1'] : 0,
						totalPages: result.count['1']
							? utils.getTotalPages(this.FEED_LIMIT, result.count['1'])
							: 0,
						isEmpty: result.count['total'] == 0 || !result.count['1']
					},
					() => {
						this.setState({ loading: false })
					}
				)
			})
	}

	getUserFromUsername = (username, done = () => {}) => {
		if (!username) utils.notFound(this.props.history)

		api
			.getUserFromUsername(username)
			.then(user => {
				let showDescription = false
				if ((user.shortDesc && user.shortDesc.length < 500) || !user.shortDesc)
					showDescription = true

				this.checkIsNormalUser(user.id)
				this.setState({ user: user, showDescription }, done)
			})
			.catch(err => {
				utils.notFound(this.props.history, err)
			})
	}

	getUserFromUid = (uid, done = () => {}) => {
		if (uid == null) utils.notFound(this.props.history)

		api
			.getUserFromUserId(uid)
			.then(user => {
				let showDescription = false
				if ((user.shortDesc && user.shortDesc.length < 500) || !user.shortDesc)
					showDescription = true

				this.checkIsNormalUser(user.id)
				this.setState({ user: user, showDescription }, done)
			})
			.catch(err => {
				utils.notFound(this.props.history, err)
			})
	}

	checkIsNormalUser = (uid, done = () => {}) => {
		api
			.getPublisherNormalUsers(uid)
			.then(result => {
				this.setState({ isNormalUser: result.isNormal })
			})
			.catch(err => {
				utils.notFound(this.props.history, err)
			})
	}

	changePage = e => {
		this.props.history.push({ search: '?page=' + e })
	}

	checkBack = e => {
		e.preventDefault()

		if (window.history.length <= 2) {
			this.props.history.push('/')
		} else {
			this.props.history.goBack()
		}
	}

	showFullDescription = () => {
		this.setState({
			showDescription: true
		})
	}

	componentDidMount() {
		let username, uid

		if ((username = this.props.match.params.username)) {
			this.getUserFromUsername(username, this.loadFeed)
		} else if ((uid = this.props.match.params.uid)) {
			this.getUserFromUid(uid, this.loadFeed)
		}

		this.setState({
			isMobile: utils.isMobile()
		})

		let token =
			utils.querystring('token', this.props.location) || auth.getToken()

		api.getCookieAndToken(token).then(result => {
			this.setState({
				loggedUser: result.user,
				roles: result.roles
			})
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.username != this.props.match.params.username) {
			this.setState(
				{
					currentPage: utils.querystring('page', nextProps.location)
						? utils.querystring('page', nextProps.location) - 1
						: 0,
					feed: []
				},
				() => {
					this.getUserFromUsername(
						nextProps.match.params.username,
						this.loadFeed
					)
				}
			)
		} else if (nextProps.match.params.uid != this.props.match.params.uid) {
			this.setState(
				{
					currentPage: utils.querystring('page', nextProps.location)
						? utils.querystring('page', nextProps.location) - 1
						: 0,
					feed: []
				},
				() => {
					this.getUserFromUid(nextProps.match.params.uid, this.loadFeed)
				}
			)
		} else if (nextProps.location.search != this.props.location.search) {
			this.setState(
				{
					currentPage: utils.querystring('page', nextProps.location)
						? utils.querystring('page', nextProps.location) - 1
						: 0,
					feed: []
				},
				() => {
					document.body.scrollTop = document.documentElement.scrollTop = 0
					this.loadFeed()
				}
			)
		}
	}

	render() {
		if (!isEmpty(this.state.user)) {
			let { theme } = this.context.setting.publisher
			let {
				user,
				isMobile,
				feedCount,
				feed,
				currentPage,
				totalPages,
				loading,
				showDescription,
				isEmpty,
				isNormalUser
			} = this.state
			let FeedPack = currentPage < 0 ? '' : 'Loading'

			if (feed && currentPage >= 0) {
				FeedPack = []
				feed.map((item, index) =>
					FeedPack.push(
						<ArticleBox
							isUserPage={true}
							final={index == feed.length - 1 ? true : false}
							detail={item}
							key={index}
						/>
					)
				)
			}

			let descLength = user.shortDesc ? user.shortDesc.length : 0

			let WriterUserBlock = (
				<UserBlockWrapper mobile={utils.isMobile()}>
					<EditorProfilePictureSection
						userProfileImage={
							user.pic.large ? user.pic.large : user.pic.medium
						}>
						<TopBarContainer>

							<TopBarLeftItem className="hidden-des">
								<FontIcon
									onClick={this.checkBack}
									style={{
										color: 'white',
										textShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)'
									}}
									className="material-icons hidden-des">
									chevron_left
								</FontIcon>
							</TopBarLeftItem>

							<TopBarRightItem className="hidden-des">
								<Link to="/me/settings">
									<FontIcon
										style={{
											color: 'white',
											textShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)'
										}}
										className="material-icons hidden-des">
										border_color
									</FontIcon>
								</Link>
							</TopBarRightItem>

						</TopBarContainer>
					</EditorProfilePictureSection>
					<Card mobile={utils.isMobile()}>
						<CardTitle>{user.display}</CardTitle>
						<CardSubtitle>{user.intro}</CardSubtitle>

						<Dash MarginTop="16px" />

						<SocialButtonContainer>
							<UserSocialBar
								colorPack={theme.barTone}
								channels={user.channels}
							/>
						</SocialButtonContainer>

					</Card>
					<WriterTopStories uid={user._id} />
				</UserBlockWrapper>
			)

			let WriterDetailBlock = (
				<DetailBlockWrapper mobile={utils.isMobile()}>
					<ProfileDescriptionDesktop showDescription={showDescription}>
						{user.shortDesc ? user.shortDesc : ''}
					</ProfileDescriptionDesktop>

					{!showDescription &&
						<SeeMoreWrapper>
							<ProfileDescriptionSeeMore onClick={this.showFullDescription}>
								อ่านต่อ
							</ProfileDescriptionSeeMore>
						</SeeMoreWrapper>}

					<ArticleWrapper>
						<Content>
							<Main>

								<ArticleHeader>
									<ArticleCount>{feedCount} </ArticleCount>
									{feedCount > 1 ? 'STORIES' : 'STORY'}
								</ArticleHeader>

								<Dash MarginTop="6px" />

								{loading
									? this.onload()
									: <div>
											{FeedPack}
											{isEmpty &&
												<NoArticleHeader>ยังไม่มีบทความ</NoArticleHeader>}
											{!isEmpty &&
												!(totalPages > currentPage && currentPage >= 0) &&
												<NoArticleHeader>
													ไม่มีข้อมูลในหน้านี้ กลับไปยัง
													<Link
														to={user.url + '?page=1'}
														style={{
															color: theme.accentColor,
															padding: '0 0.5em 0 0.5em'
														}}>
														หน้าแรก
													</Link>
												</NoArticleHeader>}
											<Page>
												{totalPages > currentPage &&
													currentPage >= 0 &&
													<Pagination
														hideFirstAndLastPageLinks={
															utils.isMobile() ? false : true
														}
														hidePreviousAndNextPageLinks={
															utils.isMobile() ? true : false
														}
														boundaryPagesRange={utils.isMobile() ? 0 : 1}
														currentPage={currentPage + 1}
														totalPages={totalPages}
														onChange={this.changePage}
													/>}
											</Page>
										</div>}
							</Main>
						</Content>
					</ArticleWrapper>

				</DetailBlockWrapper>
			)

			let NormalUserDesktopBlock = (
				<CardNormal>
					<div style={{ width: '120px' }}>
						<UserAvatarContainer>
							<UserAvatar
								src={user.pic.large ? user.pic.large : user.pic.medium}
								size={120}
							/>
						</UserAvatarContainer>
					</div>
					<div style={{ width: '570px', marginLeft: '40px' }}>
						<CardTitle>{user.display}</CardTitle>
						<CardSubtitle style={{ textAlign: 'left' }}>
							{user.intro}
						</CardSubtitle>

						<SocialButtonContainer>
							<UserSocialBar
								colorPack={theme.barTone}
								channels={user.channels}
							/>
						</SocialButtonContainer>

						<ProfileDescriptionDesktop
							style={{
								marginTop: '40px',
								paddingTop: '24px',
								borderTop: '1px solid #E2E2E2',
								height: 'auto'
							}}>
							{user.shortDesc ? user.shortDesc : ''}
						</ProfileDescriptionDesktop>
					</div>
				</CardNormal>
			)

			let MobileBlock1 = (
				<Wrapper>
					<EditorProfilePictureSection
						mobile={utils.isMobile()}
						userProfileImage={
							user.pic.large ? user.pic.large : user.pic.medium
						}>
						<TopBarContainer>

							<TopBarLeftItem className="hidden-des">
								<FontIcon
									onClick={this.checkBack}
									style={{
										color: 'white',
										textShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)'
									}}
									className="material-icons hidden-des">
									chevron_left
								</FontIcon>
							</TopBarLeftItem>

							<TopBarRightItem className="hidden-des">
								<Link to="/me/settings">
									<FontIcon
										style={{
											color: 'white',
											textShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)'
										}}
										className="material-icons hidden-des">
										border_color
									</FontIcon>
								</Link>
							</TopBarRightItem>

						</TopBarContainer>
					</EditorProfilePictureSection>
					<UserInfoSection role={isNormalUser ? 'user' : 'admin'}>
						<Card mobile={utils.isMobile()}>
							<CardTitle>{user.display}</CardTitle>
							<CardSubtitle>{user.intro}</CardSubtitle>

							<Dash MarginTop="16px" />

							<SocialButtonContainer>
								<UserSocialBar
									colorPack={theme.barTone}
									channels={user.channels}
								/>
							</SocialButtonContainer>

						</Card>

						<ProfileDescription showDescription={showDescription}>
							<Blur showDescription={showDescription} descLength={descLength}>
								<ProfileDescriptionSeeMore onClick={this.showFullDescription}>
									อ่านต่อ
								</ProfileDescriptionSeeMore>
							</Blur>
							<span style={{ fontFamily: 'Roboto' }}>
								{user.shortDesc ? user.shortDesc : ''}
							</span>
						</ProfileDescription>
					</UserInfoSection>

					<ArticleWrapper mobile={utils.isMobile()}>
						<Content>
							<Main>

								<ArticleHeader>
									<ArticleCount>{feedCount} </ArticleCount>
									{feedCount > 1 ? 'STORIES' : 'STORY'}
								</ArticleHeader>

								<Dash MarginTop="6px" />

								{loading
									? this.onload()
									: <div>
											{FeedPack}
											{isEmpty &&
												<NoArticleHeader>ยังไม่มีบทความ</NoArticleHeader>}
											{!isEmpty &&
												!(totalPages > currentPage && currentPage >= 0) &&
												<NoArticleHeader>
													ไม่มีข้อมูลในหน้านี้ กลับไปยัง
													<Link
														to={user.url + '?page=1'}
														style={{
															color: theme.accentColor,
															padding: '0 0.5em 0 0.5em'
														}}>
														หน้าแรก
													</Link>
												</NoArticleHeader>}
											<Page>
												{totalPages > currentPage &&
													currentPage >= 0 &&
													<Pagination
														hideFirstAndLastPageLinks={
															utils.isMobile() ? false : true
														}
														hidePreviousAndNextPageLinks={
															utils.isMobile() ? true : false
														}
														boundaryPagesRange={utils.isMobile() ? 0 : 1}
														currentPage={currentPage + 1}
														totalPages={totalPages}
														onChange={this.changePage}
													/>}
											</Page>
										</div>}
							</Main>
						</Content>
					</ArticleWrapper>
				</Wrapper>
			)

			let MobileBlock2 = (
				<Wrapper>
					<UserProfileSection style={{ width: '100%' }}>
						<TopBarContainer>

							<TopBarLeftItem>
								<FontIcon
									onClick={this.checkBack}
									style={{
										color: 'white',
										textShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)'
									}}
									className="material-icons hidden-des">
									chevron_left
								</FontIcon>
							</TopBarLeftItem>

							<TopBarRightItem>
								<Link to="/me/settings">
									<FontIcon
										style={{
											color: 'white',
											textShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)'
										}}
										className="material-icons hidden-des">
										border_color
									</FontIcon>
								</Link>
							</TopBarRightItem>

						</TopBarContainer>

						<UserInfoContainer>

							<UserAvatarContainer>
								<UserAvatar
									src={user.pic.large ? user.pic.large : user.pic.medium}
									size={100}
								/>
							</UserAvatarContainer>

							<UserInfoPrimaryText>{user.display}</UserInfoPrimaryText>
							<UserInfoSecondaryText>{user.intro}</UserInfoSecondaryText>

							<SocialButtonContainer>
								<UserSocialBar colorPack={'light'} channels={user.channels} />
							</SocialButtonContainer>

						</UserInfoContainer>
					</UserProfileSection>

					<UserInfoSection role={isNormalUser ? 'user' : 'admin'}>

						<ProfileDescription showDescription={showDescription}>
							<Blur showDescription={showDescription} descLength={descLength}>
								<ProfileDescriptionSeeMore onClick={this.showFullDescription}>
									อ่านต่อ
								</ProfileDescriptionSeeMore>
							</Blur>
							<span style={{ fontFamily: 'Roboto' }}>
								{user.shortDesc ? user.shortDesc : ''}
							</span>
						</ProfileDescription>

					</UserInfoSection>
				</Wrapper>
			)

			return (
				<Wrapper haveBg={!utils.isMobile() && isNormalUser}>
					<TopBarWithNavigation className="hidden-mob" />
					{utils.isMobile() &&
						isNormalUser &&
						<div style={{ minHeight: 'calc(100vh - 200px)' }}>
							{MobileBlock2}
						</div>}
					{utils.isMobile() &&
						!isNormalUser &&
						<div>
							{MobileBlock1}
						</div>}
					{!utils.isMobile() &&
						!isNormalUser &&
						<ContentWrapper>
							{WriterUserBlock}
							{WriterDetailBlock}
						</ContentWrapper>}
					{!utils.isMobile() &&
						isNormalUser &&
						<ContentWrapper>
							{NormalUserDesktopBlock}
						</ContentWrapper>}

					<Footer isUserPage={true} />
				</Wrapper>
			)
		} else {
			return <Wrapper />
		}
	}
}
