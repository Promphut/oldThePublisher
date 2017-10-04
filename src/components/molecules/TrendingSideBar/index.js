import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { BGImg, SeeMore } from 'components'
import { findDOMNode as dom } from 'react-dom'
//import Request from 'superagent'
import api from '../../../services/api'
import truncate from 'lodash/truncate'

const Container = styled.div`
  width:100%;
	padding-bottom: 24px;
`

const Head = styled.div`
  color:#22222;
  font-size:24px;
  font-weight:bold;
`

const Divider = styled.div`
  height:1px;
  width:100%;
  background-color:#E2E2E2;
  top:35px;
  z-index:-5;
  position:relative;
`

const Column = styled.div`
  font-weight:bold;
  font-size:36px;
  color:${props => props.theme.primaryColor};
  text-align:center;
`

//if height less than 900px remove last item
const Con = styled.div`
  width:100%;
  display:flex;
  margin:20px 0 0 0;
`

const Name = styled(Link)`
  flex:1;
  color:#222;
  font-size:14px;
  font-weight:bold;
  padding:0 0 0 10px;
  transition: .1s;

  &:hover {
    color: ${props => props.theme.accentColor}
  }
`

const Img = styled.div`
  width:127px;
  height:75px;
  float:right;
  background-position:center;
  background-size:cover;
`

const Line = styled.div`
  width:150px;
  height:1px;
  background-color:#c4c4c4;
  margin:20px auto 0 auto;
`
const Dash = styled.div`
  width:30px;
  height:4px;
  background-color:${props => props.theme.accentColor};
  margin:5px 0 20px 0;
`

const SeemoreContainer = styled.div`
	margin-top: 26px;
	width: 100%;
	display: flex;
	justify-content: center;
`

const TrendingSideBarInner = ({ style, detail, index }) => {
	if (!detail) return <div />
	let { ptitle, comments, votes, cover } = detail
	return (
		<div>
			<Con style={{ ...style }}>
				<BGImg
					url={detail.url}
					src={cover.small || cover.medium}
					style={{
						maxWidth: '124px',
						width: '124px',
						height: '65px',
						flex: '1 124px'
					}}
				/>
				<Name to={detail.url} className="nunito-font">
					{truncate(ptitle, { length: 90, separator: '' })}
				</Name>
			</Con>
			{index != 3 && <Line />}
		</div>
	)
}

class TrendingSideBar extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			popular: []
		}
	}

	getPopular = (sid) => {
		// sort will be changed to 'trending' later when implemented
		api.getFeed('story', { status: 1 }, 'trending', null, 0, 3,{omit : [sid]}).then(result => {
			this.setState({ popular: result.feed })
		})
	}

	componentDidMount() {
		this.getPopular(this.props.sid)
		//this.Slider()
	}

	componentWillReceiveProps(nextProps) {
    if (this.props.sid != nextProps.sid){
        this.getPopular(nextProps.sid)
      }
  }

	render() {
		let { popular } = this.state
		//console.log('popular', popular)
		let { style,className } = this.props
		let tn = []
		if (popular.length > 0) {
			for (let i = 0; i < Math.min(6, popular.length); i++) {
				tn.push(
					<TrendingSideBarInner key={i} detail={popular[i]} index={i + 1} />
				)
			}
		}

		return (
			<Container style={{ ...style }} ref="contain" className={className}>
				<Head className="sans-font">TRENDING</Head>
				{popular.length != 0 ? tn : []}
				{/*{detail.map((data,index)=><Link to='#' key={index}><TrendingSideBarInner detail={data}/></Link>)}*/}
				{/*<Divider/>*/}
				{/*<SeemoreContainer>
					<SeeMore isTraindingSideBar = {true}/>
				</SeemoreContainer>*/}
			</Container>


		)
	}
}

export default TrendingSideBar
