import React from 'react';
import styled from 'styled-components'

import { Link } from 'react-router-dom'
import TextField from 'material-ui/TextField'
import { Tabs, Tab } from 'material-ui/Tabs'
import CircularProgress from 'material-ui/CircularProgress'
import SwipeableViews from 'react-swipeable-views'
import {Footer, TopBarWithNavigation, SearchResultBox, Pagination, BackToTop} from 'components'
import api from '../../../services/api'
import utils from '../../../services/utils'
import config from '../../../config'
import isEmpty from 'lodash/isEmpty'
import split from 'lodash/split'

const Onload = styled.div`
	width:100%;
	height:70px;
	margin:50px 0 50px 0;
`

const Wrapper = styled.div`
	@media (max-width:480px) {
		max-width: 100%;
		width:100%;
  }
`
const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	padding-top: 100px;
	justify-content:center;
	@media (max-width:480px) {
		display: block;
		padding: 60px 0 0 0;
  }
`
const Content2 = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content:center;
	min-height: calc(100vh - ${props => (props.isMobile ? '191px' : '450px')});

	@media (max-width:480px) {
		display: block;
  }
`

const Main = styled.div`
	flex: 3 780px;
	max-width: 780px;
	@media (max-width:480px) {
		padding:0 16px 0 16px;
  }
`

const Aside = styled.div`
	flex: 1 300px;
	max-width: 300px;
	margin-left:60px;
	z-index: 9;
	@media (max-width: 1160px) {
		display:none;
	}
`

const Feed = styled.div`
	flex: 1 1120;
	max-width:1120px;
	@media (max-width:480px) {
		padding:40px 24px 0 24px;
  }
`
const Feed2 = styled.div`
	flex: 1 1120;
	max-width:1120px;
	@media (max-width:480px) {
		padding:0px 24px 0 24px;
  }
`

const FilterContainer = styled.ul `
  list-style-type: none;
  margin-top: 40px;
  margin-bottom: 32px;
  padding-left: 0px;
`

const FilterItem = styled.li `
  display: inline;
  margin-left: 0px;
  margin-right: 20px;
  background-color: ${props => props.select == true ? props.theme.accentColor : 'rgba(0,0,0,0)'};
  border-radius: 100px;
  color: ${props => props.select ? 'white' : '#222'};
  padding-top: 9px;
  padding-bottom: 9px;
  padding-left: 25px;
  padding-right: 25px;
	text-align: center;

  &:hover {
		background-color: ${props => (!props.select && !props.mobile) && props.theme.secondaryColor};
		cursor: pointer;
  }
`

const PaginationContainer = styled.div `
	display: flex;
	justify-content: center;
	margin-top: 20px;
	@media (max-width:480px) {
		margin-bottom: 20px;
  }
`

export default class SearchResultPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      keyword: utils.querystring('keyword',this.props.location) || '',
      type: this.props.type || '',
			throttle: 500,
      result: null,
			isLoading: true,
			isChanging: false,
			currentPage: utils.querystring('page',this.props.location) ? utils.querystring('page',this.props.location) - 1 : 0,
			totalPages: 0,
    }
	}

	onload = () => (
		<Onload>
			<div className="row">
				<CircularProgress
					size={60}
					thickness={6}
					style={{ width: '60px', margin: '0 auto 0 auto' }}
				/>
			</div>
		</Onload>
	)

	FEED_LIMIT = utils.isMobile() ? config.FEED_LIMIT_MOBILE*2 : config.FEED_LIMIT;

	componentWillMount () {
			this.setState({
				keyword: utils.querystring('keyword',this.props.location) ? utils.querystring('keyword',this.props.location) : '',
				type: this.props.match.params.type,
			})
	}

	componentDidMount () {
		this.fetchResult(this.state.keyword, this.state.type)
	}

	componentWillReceiveProps (nextProps) {
		if(nextProps.match.params.type != this.props.match.params.type){
			this.setState({
				type: nextProps.match.params.type,
				isLoading: true,
				totalPages: 0,
				currentPage: 0,
			},() =>	this.fetchResult(utils.querystring('keyword',nextProps.location),nextProps.match.params.type))
		}
		else if(nextProps.location.search != this.props.location.search ){
			this.setState({
				type: nextProps.match.params.type,
				keyword : utils.querystring('keyword',nextProps.location),
				isChanging : true,
				currentPage :  utils.querystring('page',nextProps.location) ? utils.querystring('page',nextProps.location) - 1 : 0,
			},() => {
				document.body.scrollTop = document.documentElement.scrollTop = 0
				this.fetchResult(this.state.keyword, this.state.type)
			})
		}
	}

  fetchResult = (keyword, type) => {
		if(!isEmpty(keyword)){
		  api.getStoryFromKeyword(keyword, type, this.state.currentPage, this.FEED_LIMIT)
		  .then(result => {
		    this.setState({
		      result: result.stories,
					isLoading: false,
					isChanging: false,
					feedCount: result.count['1'] ? result.count['1'] : 0,
					totalPages: result.count['1'] ? (utils.getTotalPages(this.FEED_LIMIT, result.count['1'])) : 0,
		    });
		  })
		}
		else {
			this.setState({
				currentPage : 0,
				totalPages : 0,
				isLoading: false,
				isChanging: false,
				result: null,
			})
		}
  }

	changePage = (e) => {
			this.props.history.push({search: "?keyword=" + this.state.keyword + "&page=" + e})
	}

	changeType = type => {
		if(type != this.state.type){
			this.props.history.push({pathname: '/search/' + type, search: "?keyword=" + this.state.keyword  + "&page=" + 1})
		}
  }

  handleKeywordChange = (e) => {
		this.setState({keyword: e.target.value, isLoading: true, totalPages: 0, feedCount:0}, () => {
			if (this._throttleTimeout) clearTimeout(this._throttleTimeout)

			this._throttleTimeout = setTimeout (
				() => this.fetchResult(this.state.keyword, this.state.type), this.state.throttle
			)
		})
  }

  render() {
		let { isMobile, completed, totalPages, currentPage, loading, feedCount, keyword, type, result, isLoading, isChanging} = this.state
		return (
      <Wrapper>
        <TopBarWithNavigation/>
        <Content>
					<Feed isMobile={utils.isMobile()}><TextField id="search-box" hintText="ค้นหา" autoFocus={true} fullWidth={true} value={keyword} inputStyle={{fontSize:'28px'}} style={{fontFamily: "'Nunito', 'Mitr'"}} onChange={(e)=>this.handleKeywordChange(e)}/></Feed>
				</Content>
				<Content2>
					<Feed2>
            <FilterContainer>
							<FilterItem mobile = {utils.isMobile()} onClick={(e) => this.changeType('stories')}  select={type === 'stories'}>STORIES</FilterItem>
							<FilterItem mobile = {utils.isMobile()} onClick={(e) => this.changeType('news')}  select={type === 'news'}>NEWS</FilterItem>
              {/* <Link to={"/search/stories?keyword=" + keyword + "&page=1"}><FilterItem mobile = {utils.isMobile()} select={type === 'stories'}>STORIES</FilterItem></Link>
              <Link to={"/search/news?keyword=" + keyword + "&page=1"}><FilterItem mobile = {utils.isMobile()} select={type === 'news'}>NEWS</FilterItem></Link> */}
              {/* <Link to={"/search/video/" + this.state.keyword}><FilterItem select={this.state.type === 'video'}>VIDEO</FilterItem></Link> */}
            </FilterContainer>

						{ isChanging ? this.onload() :
            	<SearchResultBox type={type} result={result} isLoading={isLoading} page={currentPage}/>
						}
						{ !isChanging && totalPages > 0 && ((totalPages > currentPage && currentPage >= 0) ?

						<PaginationContainer>
							<Pagination
									hideFirstAndLastPageLinks={utils.isMobile() ? false : true}
									hidePreviousAndNextPageLinks={utils.isMobile() ? true : false}
									boundaryPagesRange={utils.isMobile() ? 0 : 1}
									currentPage={currentPage + 1}
									totalPages={totalPages}
									onChange={this.changePage}
							/>
						</PaginationContainer> :

							<div></div>)}
          </Feed2>

        </Content2>

				<BackToTop scrollStepInPx="200" delayInMs="16.66" showOnTop="600" />
        <Footer />
      </Wrapper>
    )
  }
}
