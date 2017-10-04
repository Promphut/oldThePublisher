import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import api from '../../../services/api'

const Container = styled.div`
	display:flex;
	.active{
		font-weight:bold;
		color:${props => props.theme.accentColor};
	}
	@media (min-width: 768px) and (max-width: 992px) {
		display:none;
  }
`

const NavSpan = styled.span`
	padding: 18px 20px 20px 20px;
	font-size:17px;
	color: ${props => (props.theme.barTone == 'light' ? '#222' : '#FFF')};
	height:60px;
	cursor: pointer;
	transition: .2s;
	&:hover{
		font-weight:bold;
		color:${props => props.theme.accentColor};
		>div{
			display:block;
		}
	}
`
const NavLink2 = styled(NavLink)`
	padding: 18px 20px 20px 20px;
	font-size:17px;
	text-decoration: none;
	color: ${props => (props.theme.barTone == 'light' ? '#222' : '#FFF')};
	height:60px;
	cursor: pointer;
	transition: .2s;
	&:hover{
		font-weight:bold;
		color:${props => props.theme.accentColor};
		>div{
			display:block;
		}
	}
`
const DropdownBox = styled.div`
	display: none;
	position: absolute;
	top: 60px;
	padding: 5px 15px;
	background-color:#E5E5E5;
	z-index: 3;
`

const DropdownFlex = styled.div`
	display: flex;
`

const DropdownCol = styled.div`
	flex: 1 auto;
	padding: 8px;
	max-width: 240px;
`

const DropdownRow = styled(NavLink)`
	display: block;
	color: #222;
	padding: 7px;
	min-width: 140px;
	max-width: 225px;
	white-space: initial;

	&:hover {
		color: ${props => props.theme.accentColor};
	}
`

const Line = styled.div`
	background-color: #C4C4C4;
	height: 1px;
	margin: 0px 15px;
`
const TopNavigation = ({ menu, children }) => {
	let cols = menu && menu.column ? menu.column : []
	_.remove(cols, col => {
		return col.slug == 'news' || _.indexOf(children, col.slug) !== -1
	})

	let stories_cols = []
	const s_colsNumber = Math.ceil(cols.length / 7)
	for (let i = 0; i < s_colsNumber; i++) {
		let stories_rows = []
		for (let j = i * 7; j < i * 7 + 7; j++) {
			if (cols[j]) {
				stories_rows.push(
					<DropdownRow
						key={j}
						exact
						to={'/stories/' + cols[j].slug + '?page=1'}
						activeClassName="active"
						className="nunito-font">
						{cols[j].name}
					</DropdownRow>
				)
			}
		}
		stories_cols.push(
			<DropdownCol key={i}>
				{stories_rows}
			</DropdownCol>
		)
	}
	return (
		<Container>
			<NavLink2
				exact
				to="/stories/news"
				activeClassName="active"
				className="nunito-font">
				News
			</NavLink2>
			<NavSpan className="nunito-font">
				Stories ▾
				<DropdownBox>
					<DropdownFlex>
						{stories_cols}
					</DropdownFlex>
					<Line />
					<DropdownCol key={999}>
						<DropdownRow
							key={999}
							exact
							to={'/stories/columns'}
							activeClassName="active"
							className="nunito-font">
							All Columns
						</DropdownRow>
					</DropdownCol>
				</DropdownBox>
			</NavSpan>
			<NavLink2
				exact
				to="/about"
				activeClassName="active"
				className="nunito-font">
				About Us
			</NavLink2>
			<NavLink2
				exact
				to="/contact"
				activeClassName="active"
				className="nunito-font">
				Contact
			</NavLink2>
		</Container>
	)
}

TopNavigation.propTypes = {
	menu: PropTypes.object
}

export default TopNavigation
