import React from 'react'
import PropTypes from 'prop-types'
import { BGImg } from 'components'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import truncate from 'lodash/truncate'

const LargeBox = styled.div`
  display:flex;
	flex:${props => (props.large ? 3 : 2)};
	height:222px;
  @media (max-width:480px) {
    height:auto;
    padding:16px 0 16px 0;
    border-bottom:${props => (props.final ? '' : '1px solid #E2E2E2')};
    display:${props => (props.head ? 'block' : 'flex')};
  }
@media (min-width: 768px) and (max-width: 992px) {
    height:150px;
  }
`
const MiniBox = styled(BGImg)`
	height:222px;
  transition: all 0.3s;
  transform: ${props => (props["data-hover2"] ? 'scale(1.15)' : 'scale(1)')};
  z-index:-1;
  @media (max-width:480px) {
    height:${props => (props.head ? props.height : props.height/2)}px;
    margin-bottom:${props => (props.head ? '10' : '0')}px;
  }
@media (min-width: 768px) and (max-width: 992px) {
    height:150px;
  }
`
const Box1 = styled.div`
  flex:${props => (props.large ? 2 : 1)};
	height:222px;
  overflow: hidden;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  @media (max-width:480px) {
    flex: 1;
    height:auto;
  }
@media (min-width: 768px) and (max-width: 992px) {
    height:150px;
  }
`
const MiniBoxDark = styled.div`
	flex:1;
	height:222px;
	background-color:${props => props.theme.primaryColor};
@media (min-width: 768px) and (max-width: 992px) {
    height:150px;
  }
`
const MiniBoxLight = styled.div`
	flex:1;
	height:222px;
	background-color:white;
  @media (max-width:480px) {
    flex: 1 ;
  	height:auto;
    background:none;
  }
@media (min-width: 768px) and (max-width: 992px) {
    height:150px;
  }
`
const ArrowLeft = styled.div`
	position:relative;
	left:-15px;
	top:96px;
	width:0;
	height:0;
	z-index:10;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left:15px solid ${props => props.theme.primaryColor};
  @media (max-width:480px) {
    display:none;
  }
@media (min-width: 768px) and (max-width: 992px) {
    top:60px;
  }
`
const ArrowRight = styled.div`
	position:relative;
	left:-15px;
	top:96px;
	width:0;
	height:0;
	z-index:10;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right:15px solid ${props => props.theme.primaryColor};
  @media (max-width:480px) {
    display:none;
  }
	@media (min-width: 768px) and (max-width: 992px) {
    top:60px;
  }
`
const NewsBox = styled.div`
	flex:2;
	height:444px;
	@media (min-width: 768px) and (max-width: 992px) {
    height:150px;
  }
`
const SName = styled(Link)`
	font-size:18px;
  transition: all 0.3s;
  color:${props => (props["data-hover2"] ? props.theme.accentColor : '#222')};
  &:hover{
    color:${props => props.theme.accentColor};
  }
  @media (max-width:480px) {
    color:white;
    font-size:14px;
  }
	@media (min-width: 768px) and (max-width: 992px) {
    font-size:14px;
  }
`

const HName = styled.div`
	text-transform: uppercase;
	color:#C4C4C4;
	font-size:14px;
	font-weight:bold;
  margin-bottom:8px;
  @media (max-width:480px) {
    font-size:10px;
    margin-bottom:4px;
    color:${props => props.theme.accentColor};
  }
	@media (min-width: 768px) and (max-width: 992px) {
    font-size:12px;
  }
`
const Inner = styled.div`
	position:relative;
	top:-30px;
	left:0;
	width:100%;
	height:100%;
  padding:20px;
  @media (max-width:480px) {
    width:auto;
		top:0px;
		padding:${props => (props.head ? 0 : '0 0 0 10')}px;
  }
	@media (min-width: 768px) and (max-width: 992px) {
    height:150px;
  }
`

class TopStory extends React.Component {
	static contextTypes = {
		setting: PropTypes.object,
  	id: PropTypes.string
	}

	constructor(props) {
		super(props)

		this.state = {
			hover: false
		}
	}

	hover = () => {
		this.setState({ hover: true })
	}
	leave = () => {
		this.setState({ hover: false })
	}

	render() {
		var { style, swift, className, large, head, final} = this.props
		var {
			cover,
			writer,
			column,
			votes,
			comments,
			updated,
			url,
			readTime,
			contentShort,
			ptitle
		} = this.props.detail
		var { hover } = this.state

		if (swift && screen.width > 480) {
			return (
				<LargeBox
					head={head}
					large={large}
					style={{ ...style }}
					className={' ' + className}
					onMouseOver={this.hover}
					onMouseLeave={this.leave}>
					<MiniBoxLight>
						<ArrowLeft
							style={{
								marginLeft: '100%',
								left: '0px',
								borderLeft: '15px solid white'
							}}
						/>
						<Inner>
							<HName className="sans-font" style={{}}>TOP STORIES</HName>
							<SName
								id ={this.props.id}
								data-hover2={hover}
								to={this.props.detail && url}
								className="nunito-font">
								{truncate(ptitle ? ptitle : '', { length: 70, separator: '' })}
							</SName>
						</Inner>
					</MiniBoxLight>
					<Box1 large={large}>
						<MiniBox
							url={url}
							data-hover2={hover}
							head={head}
							height={(screen.width - 16) / 1.91}
							src={cover && cover.medium}
							opacity={0.2}
						/>
					</Box1>
				</LargeBox>
			)
		} else {
			return (
				<LargeBox 
					head={head}
					large={large}
					style={{ ...style }}
					className={' ' + className}
					final={final}
					onMouseOver={this.hover}
					onMouseLeave={this.leave}>
					<Box1 large={large}>
						<MiniBox
							url={url}
							head={head}
							height={(screen.width - 16) / 1.91}
							data-hover2={hover}
							src={cover && cover.medium}
							opacity={0.2}
						/>
					</Box1>
					<MiniBoxLight>
						<ArrowRight
							style={{ borderRight: '15px solid white', left: '-14px' }}
						/>
						<Inner head={head}>
							<HName className="sans-font" style={{}}>TOP STORIES</HName>
							<SName id ={this.props.id} data-hover2={hover} to={url} className="nunito-font">
								{truncate(ptitle ? ptitle : '', { length: 60, separator: '' })}
							</SName>
						</Inner>
					</MiniBoxLight>
				</LargeBox>
			)
		}
	}
}

export default TopStory
