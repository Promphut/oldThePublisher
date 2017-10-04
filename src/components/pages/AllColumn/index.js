import React from 'react'
import PropTypes from 'prop-types'
import { TopBarWithNavigation, BGImg, StoryMenu, Footer } from 'components'
import { findDOMNode as dom } from 'react-dom'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import Slider from 'react-slick'
//import Request from 'superagent'
import api from '../../../services/api'
import remove from 'lodash/remove'
import config from '../../../config'

const Wrapper = styled.div`
  background-color: #F4F4F4;

  .imgWidth{
    width:255px;
    height:141px;
  }
  @media (max-width:480px) {
    .imgWidth{
      width:255px;
      height:141px;
    }
    .row{
      display:block;
    }
  }
	@media (min-width: 768px) and (max-width: 992px) {
		.imgWidth{
			width:230px;
			height:127px;
		}
  }
`
const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	padding:50px 0 0 0;
  min-height: calc(100vh - 161px);
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
  font-size:24px;
  font-weight:bold;
  color:white;
	&:hover{
		color:${props=>props.theme.accentColor};
	}
`
const Column = styled.div`
	color:#8F8F8F;
  font-size:14px;
  margin-top:2px;
  color:white;
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
	@media (min-width: 768px) and (max-width: 992px) {
		flex: 12 720px;
		max-width: 720px;
  }
`

const Box = styled.div`
  width:255px;
  background:white;
  height:257px;
  margin:0px auto 15px auto;
  cursor: pointer;
  transition: .2s;
  > div > div  > div > div {
    transition: .2s;
  }

  &:hover {
    > div > div > div > div {
      color: ${props => props.accentColor};
    }
  }
	@media (min-width: 768px) and (max-width: 992px) {
		width:230px;
		height:224px;
  }
`
const Blur = styled.div`
background: rgba(255,255,255,0);
background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 89%, rgba(255,255,255,1) 100%);
background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,255,255,0)), color-stop(89%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)));
background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 89%, rgba(255,255,255,1) 100%);
background: -o-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 89%, rgba(255,255,255,1) 100%);
background: -ms-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 89%, rgba(255,255,255,1) 100%);
background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 89%, rgba(255,255,255,1) 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#ffffff', GradientType=0 );
  position:relative;
  width:100%;
  height:117px;
  opacity:1;
	top:-120px;
	@media (min-width: 768px) and (max-width: 992px) {
		top:-70px;
		height:70px;
  }
`
const Desc = styled.div`
  font-size:14px;
  white-space: pre-wrap;      /* Webkit */
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: -pre-wrap;     /* Opera <7 */
  white-space: -o-pre-wrap;   /* Opera 7 */
  word-wrap: break-word;      /* IE */
  overflow: hidden;
  text-overflow: ellipsis;
  position:relative;
  color:#222;
  background:white;
  height:120px;
  padding:15px;
	@media (min-width: 768px) and (max-width: 992px) {
		height:90px;
  }
`
const Div= styled.div`
	display:flex;
	flex-wrap: wrap;
	justify-content:flex-start;
	@media (max-width: 480px) {
		justify-content:center;
	}
`

const Div2 = styled.div`
	flex:0 25%;
	@media (min-width: 768px) and (max-width: 992px) {
		flex:1 30%;
  }
`


class AllColumn extends React.Component {
	static contextTypes = {
		setting: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			columns: [],
			hover: -1
			//popular:[]
		}
	}

	getColumn = () => {
		// var filter = JSON.stringify({status:1})
		// Request
		//  .get(config.BACKURL+'/publishers/'+config.PID+'/columns')
		//  .set('Accept','application/json')
		//  .end((err,res)=>{
		//    if(err) throw err
		//    else{
		//      this.setState({column:res.body.columns})
		//    }
		//  })

		api.getColumns().then(cols => {
			remove(cols, col => {
				return col.slug == 'news'
			})
			this.setState({ columns: cols })
		})
	}

	onHover = index => {
		this.setState({ hover: index })
		// console.log(index)
	}

	componentDidMount() {
		this.getColumn()
	}

	render() {
		let { theme } = this.context.setting.publisher
		let { columns, hover } = this.state
		//console.log('column', column)
		return (
			<Wrapper>
				<TopBarWithNavigation
					 
					onLoading={this.props.onLoading}
				/>
				<Content>
					<Feed>
						<div className="row" style={{ width: '100%' }}>
							<StoryMenu
								style={{
									padding: '15px 0 15px 0',
									marginTop: '20px',
									float: 'left'
								}}
								page="allcolumn"
							/>
						</div>
						<Div >
							{columns &&
								columns.map((data, index) => (
									<Div2
										key={index}
										style={{ margin: '20px 0 20px 0' }}>

											<Box
												accentColor={theme.accentColor}
												onMouseOver={() => this.onHover(index)}
												onMouseLeave={() => this.onHover(-1)}>
												<BGImg
													src={data.cover.medium!=config.BACKURL+'/imgs/column_cover.png'?data.cover.medium:null}
													className="imgWidth"
													opacity={hover == index ? 0.4 : 0.3}
													style={{ margin:'0 auto 0 auto',backgroundPosition:'right' }}
													alt={data.name}
													gradient="black">
													<div
														style={{
															position: 'absolute',
															left: '15px',
															bottom: '20px'
														}}>
														<Link to={'/stories/' + data.slug + '?page=1'}>
															<ColumnName className="serif-font">
																{data.name}
															</ColumnName>
														</Link>
														{/*
                            FOR THE NEXT VERSION
                          <Column className='sans-font' >131 Stories</Column>
                          */}
													</div>
												</BGImg>
												<Desc className="sans-font">
													{data.shortDesc}
												</Desc>
												<Blur />
											</Box>
									</Div2>
								))}
						</Div>
					</Feed>
				</Content>
				<Footer />
			</Wrapper>
		)
	}
}

export default AllColumn
