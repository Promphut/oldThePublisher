import React from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import TextField from 'material-ui/TextField'
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'
import {Footer, TopBarWithNavigation, SearchResultBox, Pagination, ArticleBox, EmptyStory, BackToTop} from 'components'
import api from '../../../services/api'
import toUpper from 'lodash/toUpper'
import CircularProgress from 'material-ui/CircularProgress'
import utils from '../../../services/utils'
import config from '../../../config'

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
	min-height: calc(100vh - ${props => (props.isMobile ? '200px' : '302px')});
	@media (max-width:480px) {
		display: block;
		padding: 80px 0 0 0;
  }
`
const Content2 = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content:center;
	min-height: calc(100vh - ${props => (props.isMobile ? '191px' : '456px')});

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

const Onload = styled.div`
    width:100%;
    height:70px;
    margin:50px 0 50px 0;
`

const TextLine = styled.div`
    color:${props => props.theme.primaryColor};
    font-size:28px;
    font-weight:bold;
`

const Dash = styled.div`
    margin:5px 0 0 0;
    width:30px;
    height:4px;
    background-color:${props => props.theme.accentColor};
`

const Page = styled.div`
    display: flex;
        flex-flow: row wrap;
        justify-content: center;
    padding:20px 0 20px 0;
`

export default class AllStoriesPage extends React.Component {

	FEED_LIMIT = utils.isMobile() ? config.FEED_LIMIT_MOBILE*2 : config.FEED_LIMIT;

	static contextTypes = {
		setting: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			type: utils.querystring('type',this.props.location) ? utils.querystring('type',this.props.location) : 'article',
			sort: utils.querystring('sort',this.props.location) ? utils.querystring('sort',this.props.location) : 'latest',

			currentPage: utils.querystring('page',this.props.location) ? utils.querystring('page',this.props.location) - 1 : 0,
			feedCount: 0,
			feed: [],
			totalPages: 0,
			isEmpty: false,
			isChanging: false,

			loading: false,
			initialLoading: true,
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

	getAllFeed = () => {

		if (this.state.loading === true) return
		
		this.state.loading = true

		api.getFeed(this.state.type,{status : 1},this.state.sort,null,this.state.currentPage,this.FEED_LIMIT)
			.then(result => {
				this.setState(
					{
						feed: result.feed,
						feedCount: result.count['1'] ? result.count['1'] : 0,
						totalPages: result.count['1'] ? utils.getTotalPages(this.FEED_LIMIT, result.count['1']) : 0,
						isEmpty: result.count['total']==0 || (!result.count['1'])
					},
					() => {
						this.setState({loading:false,initialLoading:false,isChanging:false})
					}
				)
			})
	}

    changePage = e => {
        this.props.history.push({ search: "?type=" + this.state.type  + "&sort="+ this.state.sort + "&page=" + e})
    }

    changeSort = sort => {
		if(sort != this.state.sort){
			this.props.history.push({ search: "?type=" + this.state.type  + "&sort="+ sort + "&page=" + 1})
		}
    }

    componentDidMount() {
		this.getAllFeed()
        this.setState({
            isMobile: utils.isMobile(),
        })
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.location.search != this.props.location.search){
            document.body.scrollTop = document.documentElement.scrollTop = 0
            this.setState({
				isChanging : true,
				currentPage : utils.querystring('page',nextProps.location) ? utils.querystring('page',nextProps.location)-1 : 0 ,
				type: utils.querystring('type',nextProps.location) ? utils.querystring('type',nextProps.location) : 'article',
				sort: utils.querystring('sort',nextProps.location) ? utils.querystring('sort',nextProps.location) : 'latest' ,
				feed: [],
			},()=>{
				this.getAllFeed()
            })
        }
    }

    render() {
		let { theme } = this.context.setting.publisher
		let { isMobile, completed, totalPages, currentPage, loading, feed, feedCount, initialLoading, isEmpty, isChanging} = this.state

		return (
        <Wrapper>
            <TopBarWithNavigation/>

            <Content isMobile={isMobile}>

                <Main>
                    <TextLine className="sans-font">{toUpper((this.state.type=='article') ? 'STORIES' : this.state.type)}</TextLine>
                    <Dash style={{ margin: '5px 0 10px 0' }} />

                    <FilterContainer>
                        <FilterItem mobile = {utils.isMobile()} onClick={(e) => this.changeSort('latest')} select={this.state.sort === 'latest'}>LATEST</FilterItem>
                        <FilterItem mobile = {utils.isMobile()} onClick={(e) => this.changeSort('trending')} select={this.state.sort === 'trending'}>TRENDING</FilterItem>
                    </FilterContainer>

					{ (loading || initialLoading) ? this.onload() :
						<div>
							{feed && currentPage >= 0 &&
								feed.map((item, index) => (
								<ArticleBox final={index == feed.length -1 ? true:false} detail={item} key={index} />
							))}

							{ (isEmpty) &&
								<EmptyStory
									title="No Story, yet"
									description={
										<div>
											There are no stories in this publisher right now. Wanna back to
											<Link
												to="/"
												style={{
													color: theme.accentColor,
													padding: '0 0.5em 0 0.5em'
												}}>
												home
											</Link>
											?
										</div>
									}
								/>
							}
							
							{ (!isEmpty && !(totalPages > currentPage && currentPage >= 0)) &&

								<EmptyStory
									title="No More Story"
									description={
										<div>
											There are no more stories in this page. Go back to
											<Link
												to={"/stories/all?type=" + this.state.type  + "&sort="+ this.state.sort + "&page=1"}
												style={{
													color: theme.accentColor,
													padding: '0 0.5em 0 0.5em'
												}}>
												first page
											</Link>
											?
										</div>
									}
									hideButton={true}
								/>

							}


							<Page>
								{ (!isChanging && totalPages > currentPage && currentPage >= 0) &&
									<Pagination
                                        hideFirstAndLastPageLinks={utils.isMobile() ? false : true}
                                        hidePreviousAndNextPageLinks={utils.isMobile() ? true : false}
                                        boundaryPagesRange={utils.isMobile() ? 0 : 1}
                                        currentPage={currentPage + 1}
                                        totalPages={totalPages}
                                        onChange={this.changePage}
                                    />
								}
							</Page>
						</div>
					}
				</Main>
            </Content>

			<BackToTop scrollStepInPx="200" delayInMs="16.66" showOnTop="600" />
            <Footer />
        </Wrapper>
        )
    }
}
