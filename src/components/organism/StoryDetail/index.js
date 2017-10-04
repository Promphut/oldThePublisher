import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import FontIcon from 'material-ui/FontIcon'
import {
	EditorCss,
	WriterAndDate,
	WritedBy,
	TagBox,
	CommentBox,
	CommentUser,
	RecommendArticle,
	FromColumn,
	FbShareButton,
	ImageShare,
	ShareBottom
} from 'components'
import RaisedButton from 'material-ui/RaisedButton'
import api from '../../../services/api'
import utils from '../../../services/utils'
import config from '../../../config'

const Share = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items:center;
`

const Blank = styled.div`
  width: 55px;
`
const Wraper = styled(EditorCss)`
  color:#222;
  width:100%;
  margin:0 auto 0 auto;
  @media(max-width:480px){
    .center{
      justify-content: center;
    }
  }
`

const Head = styled.div`
  font-size:36px;
  font-Weight:bold;
  white-space: pre-wrap;      /* Webkit */
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: -pre-wrap;     /* Opera <7 */
  white-space: -o-pre-wrap;   /* Opera 7 */
  word-wrap: break-word;      /* IE */

  @media (max-width:480px){
    font-size:24px;
  }
`

const Story = styled.div`
  margin-top:40px;
  clear:both;
	overflow:hidden;
`

const TagContainer = styled.div`
  display:flex;
  flex-wrap:wrap;
  margin:30px 0 0 0;
  font-family:'PT Sans';
  @media (max-width:480px){
    margin:15px 0 15px 0;
  }
`

const Divider = styled.div`
  height:2px;
  width:100%;
  background-color:#E2E2E2;
  margin:32px 0 20px 0;
  @media (max-width:480px){
    margin:15px 0 15px 0;
  }
`

const CommentUserContainer = styled.div`
  width:100%;

`

const Child = styled.div`
  margin-left:60px;
  width:80%;
`

const NoComment = styled.div`
  font-size:19px;
  color:#8F8F8F;
  margin:15px 0 15px 0;
  @media (max-width:480px){
    font-size:16px;
  }
`
const HighlightBox = styled.div`
  width:100%;
  padding:2px;
  background: linear-gradient(135deg,  ${props => props.theme.primaryColor} 0%, ${props => props.theme.accentColor} 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
`

const Highlight = styled.div`
  position:relative;
  top:0;
  left:0;
  width:100%;
  background-color:white;
  padding:20px;
`
const HighlightText = styled.span`
  position:relative;
  top:10px;
  left:20px;
  z-index:5;
  color:${props => props.theme.primaryColor};
  text-align:center;
  padding:0 9px;
  font-size:14px;
  font-weight:bold;
  font-family:'PT Sans';
  background:white;
  border-left:2px solid ${props => props.theme.accentColor};
  border-right:2px solid ${props => props.theme.accentColor};
`
const Flex = styled.div`
  -webkit-flex:1;
  flex:1;
  @media (max-width:480px){
    -webkit-flex:0;
    flex:0;
  }
`

const ContentInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: flex-start;
`

const ShareButton = styled.div`
  width:200px;
  height:40px;
  border-radius:4px;
  background-color:#3A579A;
  float: left;
  display: flex;
  justify-content: center;
  align-items:center;
  &:hover{
    cursor:pointer;
  }
`

const styles = {
	button: {
		width: '100%',
		margin: '15px 0 15px 0',
		height: '40px',
		borderRadius: '15px'
	},
	btnStyle: {
		width: '100%',
		borderRadius: '15px'
	}
}

class StoryDetail extends React.Component {
	state = {
		tags: [],
		fb: 0
	}
	constructor(props) {
		super(props)
	}

	getStoryTags = sid => {
		if (sid)
			api.getStoryTags(sid).then(tags => {
				//console.log(tags)
				this.setState({
					tags
				})
			})
	}

	renderComment = (data, index) => {
		return (
			<div key={index}>
				<CommentUser data={data} />
				<Child />
			</div>
		)
	}

	componentDidMount() {
		this.getStoryTags(this.props.story._id)
		utils
			.FBShareCount(config.FRONTURL + window.location.pathname)
			.then(res => this.setState({ fb: res }))
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.story != this.props.story) {
			this.getStoryTags(nextProps.story._id)
			//console.log(nextProps.story)
		}
	}

	render() {
		var { story, id } = this.props
		var s = story
		//console.log(s)
		const isMobile = utils.isMobile()
		let { tags } = this.state
		const columnStyle = isMobile
			? {
					marginTop: '22px'
				}
			: {}
		//console.log(s)

		return (
			<Wraper id={id}>
				<ImageShare sid={s && s._id} />
				<Head className="title-font">{s.ptitle || 'NEXT EMPIRE'}</Head>
				<WriterAndDate
					readTime={s.readTime}
					writer={s.writer}
					column={s.column}
					published={s.published}
				/>

				{!isMobile &&
					<Share style={{ marginBottom: '32px' }}>
						<FbShareButton 
						  id = "StoryDetailTopFb"
							button={
								<ShareButton>
									<b
										className="fa fa-facebook fa-lg"
										aria-hidden="true"
										style={{
											color: 'white',
											fontWeight: 'bold',
											paddingRight: '10px'
										}}
									/>
									<b
										aria-hidden="true"
										style={{
											color: 'white',
											fontWeight: 'bold',
											fontFamily: 'Helvetica, Arial, sans-serif',
											fontSize: '14px'
										}}>
										{' '}Share on Facebook
									</b>
								</ShareButton>
							}
						/>
						<Blank />
						<div
							dangerouslySetInnerHTML={{
								__html: `<div style="transform: scale(1.428571428571429);" class="fb-save" data-uri=${config.FRONTURL + s.url}></div>`
							}}
						/>
					</Share>}

				{isMobile &&
					<Share style={{ marginBottom: '19px' }}>
						<FbShareButton
							id = "StoryDetailTopFb"
							button={
								<ShareButton
									style={{
										width: '86px',
										height: '28px',
										display: 'flex',
										alignItems: 'center'
									}}>
									<b
										className="fa fa-facebook fa-1x"
										aria-hidden="true"
										style={{
											flex: '1',
											display: 'flex',
											justifyContent: 'flex-end',
											color: 'white',
											fontWeight: 'normal',
											paddingRight: '10px',
											fontSize: '11.2px'
										}}
									/>
									<b
										aria-hidden="true"
										style={{
											flex: '0 0.5px',
											display: 'flex',
											justifyContent: 'flex-start',
											alignItems: 'center',
											color: 'rgba(255, 255, 255, 0.7)',
											fontWeight: 'lighter',
											fontFamily: 'Helvetica, Arial, sans-serif',
											fontSize: '15px'
										}}>
										|
									</b>
									<b
										aria-hidden="true"
										style={{
											flex: '2',
											display: 'flex',
											justifyContent: 'center',
											color: 'white',
											fontWeight: 'bold',
											fontFamily: 'Helvetica, Arial, sans-serif',
											fontSize: '12px'
										}}>
										{utils.numberFormat((this.props.share && this.props.share.fb) + this.state.fb)}
									</b>
								</ShareButton>
							}
						/>
						<Blank style={{ width: '10px' }} />
						<div
							dangerouslySetInnerHTML={{
								__html: `<div class="fb-save" data-uri="${config.FRONTURL + s.url}"></div>`
							}}
						/>
					</Share>}

				{s.phighlight &&
					<div>
						<HighlightText>
							{s.format == 'NEWS' ? 'SUMMARY' : 'HIGHLIGHTS'}
						</HighlightText>
						<HighlightBox>
							<Highlight
								id="highlight"
								dangerouslySetInnerHTML={{ __html: s.phighlight }}
							/>
						</HighlightBox>
					</div>}
				<Story
					ref="detail"
					id="paper"
					dangerouslySetInnerHTML={{ __html: s.phtml }}
				/>
				{/*<WritedBy writer={s.writer} column={s.column} published={s.published} />*/}

				{/*<TagContainer>
          {tags.map((tag,index)=>(
            <Link to={tag.url} key={index}><TagBox style={{margin:'0 20px 20px 0'}}>{tag.name}</TagBox></Link>
          ))}
        </TagContainer>*/}
				{!isMobile &&
					<Share style={{ marginBottom: '32px' }}>
						<FbShareButton
						  id = "StoryDetailBottomFb"
							button={
								<ShareButton>
									<b
										className="fa fa-facebook fa-lg"
										aria-hidden="true"
										style={{
											color: 'white',
											fontWeight: 'bold',
											paddingRight: '10px'
										}}
									/>
									<b
										aria-hidden="true"
										style={{
											color: 'white',
											fontWeight: 'bold',
											fontFamily: 'Helvetica, Arial, sans-serif',
											fontSize: '14px'
										}}>
										{' '}Share on Facebook
									</b>
								</ShareButton>
							}
						/>
						<Blank />
						<div
							dangerouslySetInnerHTML={{
								__html: `<div style="transform: scale(1.428571428571429);" class="fb-save" data-uri=${config.FRONTURL + s.url}></div>`
							}}
						/>
					</Share>}

				{isMobile &&
					<Share style={{ marginBottom: '19px' }}>
						<FbShareButton
							id = "StoryDetailBottomFb"
							button={
								<ShareButton
									style={{ width: '86px', height: '28px', display: 'flex' }}>
									<b
										className="fa fa-facebook fa-1x"
										aria-hidden="true"
										style={{
											flex: '1',
											display: 'flex',
											justifyContent: 'flex-end',
											color: 'white',
											fontWeight: 'normal',
											paddingRight: '10px',
											fontSize: '11.2px'
										}}
									/>
									<b
										aria-hidden="true"
										style={{
											flex: '0 0.5px',
											display: 'flex',
											justifyContent: 'flex-start',
											alignItems: 'center',
											color: 'rgba(255, 255, 255, 0.7)',
											fontWeight: 'normal',
											fontFamily: 'Helvetica, Arial, sans-serif',
											fontSize: '15px'
										}}>
										|
									</b>
									<b
										aria-hidden="true"
										style={{
											flex: '2',
											display: 'flex',
											justifyContent: 'center',
											color: 'white',
											fontWeight: 'bold',
											fontFamily: 'Helvetica, Arial, sans-serif',
											fontSize: '12px'
										}}>
										{utils.numberFormat((this.props.share && this.props.share.fb) + this.state.fb)}
									</b>
								</ShareButton>
							}
						/>
						<Blank style={{ width: '10px' }} />
						<div
							dangerouslySetInnerHTML={{
								__html: `<div class="fb-save" data-uri="${config.FRONTURL + s.url}"></div>`
							}}
						/>
					</Share>}

				<Blank />

				<Divider />

				{s.writer &&
					s.column &&
					<div className="row center">
						<ContentInfoContainer>
							<Flex>
								<WritedBy
									writer={s.writer}
									column={s.column}
									published={s.published}
								/>
							</Flex>
							<Flex style={{ ...columnStyle }}>
								{s.column && <FromColumn column={s.column} />}
							</Flex>
						</ContentInfoContainer>
					</div>}

				{/* NEXT ITERATION
        <NoComment>5 Comments</NoComment>
        <CommentBox className="hidden-mob"/>
        <CommentUserContainer>
          {a.map(this.renderComment)}
          <RaisedButton
            label="Show more comments"
            target="_blank"
            labelColor="#8F8F8F"
            labelStyle={{fontSize:'15px',top:'11'}}
            style={styles.button}
            buttonStyle={styles.btnStyle}
            backgroundColor="none"
          />
        </CommentUserContainer>*/}

			</Wraper>
		)
	}
}

export default StoryDetail
