import React from 'react'
import {
	TopBarWithNavigation,
	PublisherSettingMenu,
	Footer,
	PrivateRoute,
	PublisherDashboardPage,
	PublisherSettingPage,
	PublisherContactAndAboutPage,
	PublisherStoryPage,
	ColumnSettingPage,
	PublisherInsightStories,
	PublisherInsightColumns,
	PublisherInsightWriters,
	PublisherPublishingSetting
} from 'components'
import styled from 'styled-components'

const Wrapper = styled.div`
  width:100%;
	background: ${props => props.theme.primaryColor};
  background: -moz-linear-gradient(-45deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  background: -webkit-gradient(left top, right bottom, color-stop(0%, ${props => props.theme.primaryColor}), color-stop(100%, ${props => props.theme.secondaryColor}));
  background: -webkit-linear-gradient(-45deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  background: -o-linear-gradient(-45deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  background: -ms-linear-gradient(-45deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  background: linear-gradient(135deg, ${props => props.theme.primaryColor} 0%, ${props => props.theme.secondaryColor} 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00b2b4', endColorstr='#cef1b7', GradientType=1 );
`

const Container = styled.div`
  width:100%;
  padding:10% 0 5% 0;
`

const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
  width:1110px;
  margin:0 auto 0 auto;
`

const Main = styled.div`
	background: white;
	flex: 3 855px;
	max-width: 855px;
`

const Aside = styled.div`
	background: rgba(255,255,255,0.5);
	flex: 1 255px;
	max-width: 255px;
`

const PublisherEditor = ({ onLoading, location, children, match }) => {
	return (
		<Wrapper>
			<TopBarWithNavigation
				 
				onLoading={onLoading}
			/>
			<Container>
				<Content>
					<Aside>
						<PublisherSettingMenu pathname={location.pathname} />
					</Aside>
					<Main>
						<PrivateRoute
							exact
							path={`${match.url}/`}
							roles={['ADMIN', 'EDITOR']}
							component={PublisherDashboardPage}
						/>
						<PrivateRoute
							exact
							path={`${match.url}/stories`}
							roles={['ADMIN', 'EDITOR']}
							component={PublisherInsightStories}
						/>
						<PrivateRoute
							exact
							path={`${match.url}/columns`}
							roles={['ADMIN', 'EDITOR']}
							component={PublisherInsightColumns}
						/>
						<PrivateRoute
							exact
							path={`${match.url}/writers`}
							roles={['ADMIN', 'EDITOR']}
							component={PublisherInsightWriters}
						/>
						<PrivateRoute
							exact
							path={`${match.url}/manage/news`}
							roles={['ADMIN', 'EDITOR']}
							component={PublisherStoryPage}
						/>
						<PrivateRoute
							exact
							path={`${match.url}/manage/stories`}
							roles={['ADMIN', 'EDITOR']}
							component={PublisherStoryPage}
						/>
						<PrivateRoute
							exact
							path={`${match.url}/settings`}
							roles={['ADMIN']}
							component={PublisherSettingPage}
						/>
						<PrivateRoute
							exact
							path={`${match.url}/settings/contact`}
							roles={['ADMIN']}
							component={PublisherContactAndAboutPage}
						/>
						<PrivateRoute
							exact
							path={`${match.url}/settings/publishing`}
							roles={['ADMIN']}
							component={PublisherPublishingSetting}
						/>
						<PrivateRoute
							exact
							path={`${match.url}/settings/columns`}
							roles={['ADMIN', 'EDITOR']}
							bypassCidCheck={false}
							component={ColumnSettingPage}
						/>
					</Main>
				</Content>
			</Container>
			<Footer />
		</Wrapper>
	)
}

export default PublisherEditor
