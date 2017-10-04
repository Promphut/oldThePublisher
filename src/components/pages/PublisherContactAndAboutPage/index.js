import React from 'react'
import { OverlayImg, PublisherContact, PublisherAbout } from 'components'
import styled from 'styled-components'
import api from '../../../services/api'
import auth from '../../../services/auth'

const Container = styled.div`
  width:100%;
`

const Header = styled.div`
	margin: 0;
	padding: 0;
  height: 80px;
	width: 100%;
  background: #F4F4F4;
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

class PublisherContactAndAboutPage extends React.Component {
	state = {
		publisher: {
			contactCats: []
		}
	}

	componentDidMount() {
		// we need private publisher object
		api.getPublisher(auth.getToken()).then(pub => {
			this.setState({ publisher: pub })
		})
	}

	render() {
		let pub = this.state.publisher
		//console.log('publisher', pub)
		return (
			<Container>
				<Header>
					<Title>Contact & About</Title>
				</Header>
				<PublisherContact contactCats={pub.contactCats} />
				<PublisherAbout aboutUs={pub.aboutUs} />
			</Container>
		)
	}
}

export default PublisherContactAndAboutPage
