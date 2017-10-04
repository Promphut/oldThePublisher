import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import api from '../../../services/api'
import * as d3 from 'd3'
import { findDOMNode as dom } from 'react-dom'
import { Tabs, Tab } from 'material-ui/Tabs'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Popover from 'material-ui/Popover'
import config from '../../../config'

if (process.env.BROWSER) {
	require('react-datepicker/dist/react-datepicker.css')
}

const Wrapper = styled.div`
    width:${props => props.width}px;
    .row{
        overflow:hidden;
        display:block;
    }
    .total{
        float:right;
        margin:0 18px;
    }
    .inputDate{
        outline:none;
    }
`

const Chart = styled.div`
    g {
        font-family:'nunito';
    }
    .area{
        fill:${props => props.theme.accentColor};
        opacity:0.4;
    }
    .line{
        fill:none;
        stroke-width:3px;
        stroke:${props => props.theme.accentColor};
    }
`

const X = styled.g`
    path{
        fill: none;
        stroke: #fff;
    }
    line{
       stroke:#f4f4f4;
    }
    text{
        x:-10;
    }
`

const Label = styled.div`
    display:inline;
    font-size:14px;
`

const Num = styled.div`
    font-size:24px;
    font-weight:bold;
`

class Axis extends React.Component {
	static propTypes = {
		h: PropTypes.number,
		axis: PropTypes.func,
		axisType: PropTypes.oneOf(['x', 'y'])
	}
	renderAxis = () => {
		let node = ReactDOM.findDOMNode(this)
		d3.select(node).call(this.props.axis)
	}
	componentDidUpdate() {
		this.renderAxis()
	}
	componentDidMount() {
		this.renderAxis()
	}
	render() {
		let translate = 'translate(0,' + (this.props.h + 30) + ')'
		return (
			<X
				className="axis"
				transform={this.props.axisType == 'x' ? translate : ''}
			/>
		)
	}
}

class Dots extends React.Component {
	static propTypes = {
		data: PropTypes.array,
		x: PropTypes.func,
		y: PropTypes.func
	}
	render() {
		let _self = this
		//remove last & first point
		let data = this.props.data.splice(1)
		data.pop()

		let circles = data.map(function(d, i) {
			return (
				<circle
					className="dot"
					r="7"
					cx={_self.props.x(d.date)}
					cy={_self.props.y(d.value)}
					fill="#7dc7f4"
					stroke="#3f5175"
					strokeWidth="5px"
					key={i}
				/>
			)
		})
		return (
			<g>
				{circles}
			</g>
		)
	}
}

class LineChart extends React.Component {
	static propTypes = {
		fill: PropTypes.string,
		width: PropTypes.number,
		height: PropTypes.number,
		chartId: PropTypes.string
	}
	static defaultProps = {
		width: 600,
		height: 300,
		chartId: 'v1_chart'
	}
	constructor(props) {
		super(props)

		this.state = {
			width: props.width,
			area: ''
		}
	}

	// zoomed() {
	//     var t = d3.event.transform, xt = t.rescaleX(x);
	//     g.select(".area").attr("d", area.x(function(d) { return xt(d.date); }));
	//     g.select(".axis--x").call(xAxis.scale(xt));
	// },

	// type = (d) => {
	// 	d.date = parseDate(d.date)
	// 	d.price = +d.price
	// 	return d
	// }

	render() {
		let data = this.props.data
		//console.log(data)

		let margin = { top: 50, right: 30, bottom: 50, left: 30 },
			w = this.state.width - (margin.left + margin.right),
			h = this.props.height - (margin.top + margin.bottom)

		let parseDate = d3.timeParse('%m/%d/%Y')

		data.forEach(function(d) {
			d.date = parseDate(d.day)

			//console.log(d.date)
		})

		let x = d3
			.scaleTime()
			.domain(
				d3.extent(data, function(d) {
					return d.date
				})
			)
			.range([30, w]),
			y = d3
				.scaleLinear()
				.domain([
					0,
					d3.max(data, function(d) {
						return d.value
					})
				])
				.range([h, 0])

		let xAxis = d3.axisBottom(x).tickSize(-h - 20).ticks(8),
			  yAxis = d3.axisLeft(y).tickSize(-w - 20).ticks(6).tickFormat(function(tickVal) {
        return tickVal >= 1000 ? tickVal/1000 + "K" : tickVal;
    });

		function zoomed() {
			let t = d3.event.transform, xt = t.rescaleX(x)
			g.select('.area').attr(
				'd',
				area.x(function(d) {
					return xt(d.date)
				})
			)
			g.select('.axis--x').call(xAxis.scale(xt))
		}

		let zoom = d3
			.zoom()
			.scaleExtent([1, 32])
			.translateExtent([[0, 0], [w, h]])
			.extent([[0, 0], [w, h]])
			.on('zoom', zoomed)

		let area = d3
			.area()
			.curve(d3.curveLinear)
			.x(function(d) {
				return x(d.date)
			})
			.y0(h)
			.y1(function(d) {
				return y(d.value)
			})

		let line = d3
			.line()
			.curve(d3.curveLinear)
			.x(function(d) {
				return x(d.date)
			})
			.y(function(d) {
				return y(d.value)
			})

		let transform = 'translate(' + margin.left + ',' + margin.top + ')'

		return (
			<Chart>
				<svg
					id={this.props.chartId}
					width={this.state.width}
					height={this.props.height}>
					<g transform={transform}>
						{/*<Grid h={h} grid={yGrid} gridType="y"/>*/}
						<Axis h={h} axis={yAxis} axisType="y" />
						<Axis h={h} axis={xAxis} axisType="x" />
						<path className="area" d={area(data)} />
						<path className="line" d={line(data)} />
					</g>
				</svg>
			</Chart>
		)
	}
}

class GraphDashboard extends React.Component {
	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number
	}
	static contextTypes = {
		setting: PropTypes.object
	}
	static defaultProps = {
		width: 900,
		height: 400
	}
	constructor(props) {
		super(props)

		this.state = {
			startDate1: moment().utcOffset('+07:00').subtract(30, 'days'),
			startDate2: moment().utcOffset('+07:00'),
			swipPicker: true,
			open: false,
			selectTab: 'view',
			data: []
		}
	}

	getPublisherInsight = () => {
		var { selectTab, startDate1, startDate2 } = this.state
		var pid = config.PID
		var action = selectTab
		var from = moment(startDate1).format('YYYYMMDD')
		var to = moment(startDate2).format('YYYYMMDD')
		//console.log(from,to)
		api.getPublisherInsight(pid, action, null, null, from, to).then(ins => {
			//console.log(ins)
			var data = []
			ins.insights.map((value, index) => {
				data[index] = {
					day: moment(value.date).format('MM/DD/YYYY'),
					value: value.value
				}
			})
			this.setState({ data: data, sum: ins.summary })
			//console.log(ins)
		})
	}

	handleChangeDate = e => {
		//console.log(e)
		if (e > new Date()) {
			this.setState({
				open: false
			})
			return false
		} else {
			this.setState(
				{
					startDate1: e,
					open: false
				},
				() => {
					this.getPublisherInsight()
				}
			)
		}
	}

	handleRequestClose = () => {
		this.setState({
			open: false
		})
	}

	openDatePicker = e => {
		this.setState({
			open: true,
			swipPicker: true,
			anchorEl: e.currentTarget
		})
	}

	handleChangeDate2 = e => {
		//console.log(e)
		if (e <= this.state.startDate1) {
			this.setState({
				open: false
			})
			return false
		} else {
			this.setState(
				{
					startDate2: e,
					open: false
				},
				() => {
					this.getPublisherInsight()
				}
			)
		}
	}

	openDatePicker2 = e => {
		this.setState({
			open: true,
			swipPicker: false,
			anchorEl: e.currentTarget
		})
	}

	handleChangeTab = e => {
		this.setState(
			{
				selectTab: e
			},
			() => {
				this.getPublisherInsight()
			}
		)
	}

	componentDidMount() {
		this.getPublisherInsight()
	}

	numberWithCommas = number => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	render() {
		var { theme } = this.context.setting.publisher
		var {
			startDate1,
			startDate2,
			open,
			anchorEl,
			swipPicker,
			selectTab,
			data
		} = this.state
		const styles = {
			headline: {
				fontSize: 24,
				paddingTop: 16,
				marginBottom: 12,
				fontWeight: 400
			},
			tabs: {
				background: 'none',
				height: '60px',
				color: '#222222'
			},
			tab: {
				fontFamily: "'Nunito', 'Mitr'",
				fontSize: '16px',
				fontWeight: 'bold',
				textTransform: 'none'
			}
		}
		var { width, height, style } = this.props
		var { sum } = this.state
		//console.log(this.state.startDate1<this.state.startDate2)
		return (
			<Wrapper width={width} style={{ ...style }}>
				<Popover
					open={open}
					anchorEl={anchorEl}
					onRequestClose={this.handleRequestClose}
					style={{
						background: 'none',
						boxShadow: 'none',
						margin: '0 5px 0 5px'
					}}>
					{swipPicker
						? <DatePicker
								selected={startDate1}
								selectsStart
								startDate={this.state.startDate1}
								endDate={this.state.startDate2}
								onChange={this.handleChangeDate}
								inline
							/>
						: <DatePicker
								selected={startDate2}
								selectsEnd
								startDate={this.state.startDate1}
								endDate={this.state.startDate2}
								onChange={this.handleChangeDate2}
								inline
							/>}
				</Popover>
				<Tabs
					style={{ width: 300 }}
					tabItemContainerStyle={{ ...styles.tabs }}
					inkBarStyle={{ background: theme.accentColor, height: 3 }}
					onChange={this.handleChangeTab}
					value={selectTab}>
					<Tab
						buttonStyle={{
							...styles.tab,
							color: selectTab == 'view' ? '#222' : '#c4c4c4'
						}}
						label="View"
						value={'view'}
					/>
					<Tab
						buttonStyle={{
							...styles.tab,
							color: selectTab == 'share' ? '#222' : '#c4c4c4'
						}}
						label="Share"
						value={'share'}
					/>
				</Tabs>
				<div className="row" style={{ marginTop: '50px' }}>
					<Label className="sans-font" style={{ margin: '2px 10px 0 0' }}>
						Start:
					</Label>
					<div style={{ display: 'inline-block' }}>
						<FlatButton
							onClick={this.openDatePicker}
							style={{
								border: '1px solid #C4C4C4',
								borderRadius: '20px',
								padding: '0px 10px 0px 12px',
								fontSize: '14px',
								height: '28px',
								lineHeight: '28px'
							}}
							icon={
								<FontIcon
									className="material-icons"
									style={{ color: '#c4c4c4', marginLeft: '15px' }}>
									keyboard_arrow_down
								</FontIcon>
							}>
							{moment(startDate1).format('MM/DD/YYYY')}
						</FlatButton>
					</div>
					<Label className="sans-font" style={{ margin: '2px 10px 0 15px' }}>
						End:
					</Label>
					<FlatButton
						onClick={this.openDatePicker2}
						style={{
							border: '1px solid #C4C4C4',
							borderRadius: '20px',
							padding: '0px 10px 0px 12px',
							fontSize: '14px',
							height: '28px',
							lineHeight: '28px'
						}}
						icon={
							<FontIcon
								className="material-icons"
								style={{ color: '#c4c4c4', marginLeft: '15px' }}>
								keyboard_arrow_down
							</FontIcon>
						}>
						{moment(startDate2).format('MM/DD/YYYY')}
					</FlatButton>
					<div className="total">
						<Label style={{ color: '#8e8e8e' }}>Number of Stories</Label>
						<Num className="serif-font">
							{sum && this.numberWithCommas(sum.count)}
						</Num>
					</div>
					<div className="total">
						<Label style={{ color: '#8e8e8e' }}>Average per story</Label>
						<Num className="serif-font">
							{sum && this.numberWithCommas(sum.avg)}
						</Num>
					</div>
					<div className="total">
						<Label style={{ color: '#8e8e8e' }}>Total</Label>
						<Num className="serif-font" style={{ color: theme.accentColor }}>
							{sum && this.numberWithCommas(sum.total)}
						</Num>
					</div>
				</div>
				<LineChart width={width} height={height} data={data} />
			</Wrapper>
		)
	}
}

export default GraphDashboard
