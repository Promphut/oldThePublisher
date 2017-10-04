import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {
	BGImg,
	TopBarWithNavigation,
	TrendingSideBar,
	RecommendArticle,
	Navbar,
	RecommendContainer,
	Footer,
	BgWithLogo
} from 'components'
import api from '../../../services/api'
import utils from '../../../services/utils'
import config from '../../../config'
import isEmpty from 'lodash/isEmpty'

const Wrapper = styled.div`

`

const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	@media (max-width: 480px) {
		padding:0 0 15px 0;
	}
`

const Main = styled.div`
	margin-top: 80px;
	flex: 8 730px;
	max-width: 730px;
	min-height: calc(100vh - ${props => (props.isMobile ? '241px' : '591px')});

	@media (max-width: 768px) {
		flex: 0 100%;
		max-width: 100%;
		padding: 0 15px 0 15px;
	}

`
const Aside = styled.div`
	flex: 3 325px;
	position:relative;
	max-width: 325px;
	margin-top: 50px;
	margin-left:60px;
	@media (max-width: 1160px) {
		display:none;
	}
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

class ContactAndAboutContainer extends React.Component {
	constructor(props) {
		super(props)

		this.recommends = []
		this.publisher = {}
		this.state = {
			isMobile: false
		}
		//this.state = {
		//refresh: 0
		//recommends: []
		//}
	}

	getRecommendStories = () => {
		api.getFeed('story', { status: 1 }, 'latest', null, 0, 4).then(result => {
			this.recommends = result.feed

			this.setState({})
			//console.log('feed', result.feed.length)
			// this.setState({
			// 	recommends: result.feed,
			// })
		})
	}

	getPublisher = () => {
		api.getPublisher().then(pub => {
			this.publisher = pub

			this.setState({})
		})
	}

	componentDidMount() {
		this.getPublisher()
		this.getRecommendStories()
		this.setState({
			isMobile: utils.isMobile()
		})
	}

	render() {
		//let {recommends} = this.state
		let pub = this.publisher
		var {theme} = this.publisher 
		let { isMobile } = this.state

		let list = []
		for (let i = 0; i < this.recommends.length; i++) {
			list.push(
				<div key={i} className="col-lg-6 col-md-6 col-sm-12">
					<RecommendArticle detail={this.recommends[i]} />
				</div>
			)
		}

		return (
			<Wrapper>
				{!isEmpty(pub) && !utils.isMobile() && <BgWithLogo data={pub}/>}

				<TopBarWithNavigation
					special={true}				 
					onLoading={this.props.onLoading}
				/>

				<Content>
					<Main isMobile={isMobile}>
						{this.props.children}
					</Main>
					{/*<Aside>
	            <TrendingSideBar/>
	          </Aside>*/}
				</Content>
				<Content>
					{this.recommends.length!=0&&<RecommendContainer recommend={this.recommends} />}
				</Content>
				<Footer />
			</Wrapper>
		)
	}
}

export default ContactAndAboutContainer
