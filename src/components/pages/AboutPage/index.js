import React from 'react'
import styled from 'styled-components'
import {
	ContactAndAboutContainer,
	ShareButton,
	TwtShareButton,
	FbShareButton,
	EditorCss
} from 'components'
import { Helmet } from 'react-helmet'
import api from '../../../services/api'
import config from '../../../config'
import moment from 'moment'
import utils from '../../../services/utils'

const Wrapper = styled(EditorCss)`

`

const Head = styled.div`
  font-size: 36px;
  font-Weight: bold;
  color: ${props => props.theme.primaryColor};
  @media (max-width: 480px) {
    font-size: 24px;
  }
`

const Article = styled.div`
  font-size:20px;
  margin-top:40px;
  clear:both;
	overflow:hidden;
`

const HiddenMobile = styled.div`
  @media (max-width: 480px){
    display: none;
  }
`

class AboutPage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			aboutUs: '',
			fb: 0,
			twt: 0
		}
	}

	componentDidMount() {
		api.getPublisherAboutUs().then(aboutUs => {
			this.setState({
				aboutUs: aboutUs
			})
		})
		var pid = config.PID
		const from = config.FROMDATE
		const to = moment().utcOffset('+07:00').format('YYYYMMDD')

    utils.FBShareCount(config.FRONTURL).then((res)=>this.setState({fb:res}))

		// Request.get('https://share.yandex.ru/gpp.xml?url='+config.FRONTURL)
		// .end((er,res)=>{
		// 	//console.log(res)
		// 	this.setState({twt:res})
		// })

	}

	render() {
		const { fb, twt } = this.state
		return (
			<Wrapper>
			<ContactAndAboutContainer onLoading={this.props.onLoading}>
				<div>
					<Head className="title-font">About Us</Head>
					<Article
						id='paper'
						className="content-font"
						dangerouslySetInnerHTML={{ __html: this.state.aboutUs }}
					/>
					<HiddenMobile>
						<FbShareButton
							button={
								<ShareButton
									className="fa fa-facebook"
									number={fb||0}
									color="58,88,155"
								/>
							}
						/>
						<TwtShareButton
							button={
								<ShareButton
									className="fa fa-twitter"
									number={twt||0}
									color="96,170,222"
									style={{ marginLeft: '15px' }}
								/>
							}
						/>
					</HiddenMobile>
				</div>
			</ContactAndAboutContainer>
			</Wrapper>
		)
	}
}
export default AboutPage
