import React from 'react'
import styled from 'styled-components'
import FontIcon from 'material-ui/FontIcon'
import utils from '../../../services/utils'

const Box = styled.div`
  display: ${props => (props.scrollToTop ? 'block' : 'none')};
  opacity: ${props => (props.scrollOpacity ? '1' : '0')};
  width: 40px;
  height: 40px;
  background: #F4F4F4;
  padding-top: 8px;
  text-align: center;
  border-radius: 20px;
  transition: .2s;

  position: -webkit-sticky;
  position: sticky;
  float: right;
  right: 20px;
  bottom: 20px;

  &:hover {
    cursor: pointer;
    opacity: .7;
  }

  .scrollToTop {
    display: block;
  }
`

class BackToTop extends React.Component {
	constructor() {
		super()

		this.state = {
			intervalId: 0,
			scrollToTop: false,
			scrollOpacity: false
		}
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll)
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll)
	}

	handleScroll = e => {
		if (!utils.isMobile()) {
			const scrollToTop = e.srcElement.body.scrollTop >
				this.props.showOnTop - 20
				? true
				: false
			const scrollOpacity = e.srcElement.body.scrollTop > this.props.showOnTop
				? true
				: false

			this.setState({
				scrollToTop,
				scrollOpacity
			})
		}
	}

	scrollStep = () => {
		if (window.pageYOffset === 0) {
			clearInterval(this.state.intervalId)
		}
		window.scroll(0, window.pageYOffset - this.props.scrollStepInPx)
	}

	scrollToTop = () => {
		let intervalId = setInterval(
			this.scrollStep.bind(this),
			this.props.delayInMs
		)
		this.setState({ intervalId: intervalId })
	}

	render() {
		const { scrollToTop, scrollOpacity } = this.state
		return (
			<Box
				style={this.props.style}
				onClick={() => {
					this.scrollToTop()
				}}
				scrollToTop={scrollToTop ? true : false}
				scrollOpacity={scrollOpacity ? true : false}>
				<FontIcon className="material-icons">
					expand_less
				</FontIcon>
			</Box>
		)
	}
}

export default BackToTop
