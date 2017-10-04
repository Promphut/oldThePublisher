import React from 'react'
import {Route} from 'react-router-dom'
import { TopBarWithNavigation, TopBarWithBack, UserSettingMenu, Footer} from 'components'
import styled from 'styled-components'
import auth from '../../../services/auth'
import utils from '../../../services/utils'

const Wrapper = styled.div`
  width:100%;
	background: ${props=> props.theme.primaryColor};
  background: -moz-linear-gradient(-45deg, ${props=> props.theme.primaryColor} 0%, ${props=> props.theme.secondaryColor} 100%);
  background: -webkit-gradient(left top, right bottom, color-stop(0%, ${props=> props.theme.primaryColor}), color-stop(100%, ${props=> props.theme.secondaryColor}));
  background: -webkit-linear-gradient(-45deg, ${props=> props.theme.primaryColor} 0%, ${props=> props.theme.secondaryColor} 100%);
  background: -o-linear-gradient(-45deg, ${props=> props.theme.primaryColor} 0%, ${props=> props.theme.secondaryColor} 100%);
  background: -ms-linear-gradient(-45deg, ${props=> props.theme.primaryColor} 0%, ${props=> props.theme.secondaryColor} 100%);
  background: linear-gradient(135deg, ${props=> props.theme.primaryColor} 0%, ${props=> props.theme.secondaryColor} 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00b2b4', endColorstr='#cef1b7', GradientType=1 );
`

const Container = styled.div`
  width:100%;
  padding:10% 0 5% 0;
	min-height: calc(100vh - 161px);
  @media(max-width:480px){
    max-width: 100%;
    padding:0 0 0 0;
  }
`

const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
  width:1110px;
  margin:0 auto 0 auto;
  @media(max-width:480px){
    max-width: 100%;
  }
`

const Main = styled.div`
	background: white;
	flex: 3 855px;
  @media(max-width:480px){
    max-width: 100%;
  }
`

const Aside = styled.div`
	background: rgba(255,255,255,0.5);
	flex: 1 255px;
	max-width: 255px;
  @media(max-width:480px){
    display:none;
  }
`

class UserSetting extends React.Component {
  constructor(props) {
    super(props)

    this.user = {}
  }

  componentWillMount(){
    this.user = auth.getUser()
  }

  render(){
    const isMobile = utils.isMobile()
    let {match, location, onLoading, children} = this.props

    let title = ''
    if (location.pathname == '/me/settings') {
      title = 'Edit Profile'
    } else if (location.pathname == '/me/settings/account') {
      title = 'Setting'
    }

    return (
        <Wrapper>
          {isMobile ? <TopBarWithBack title={title} history={this.props.history}/> :
            <TopBarWithNavigation   onLoading={onLoading} />
          }

          <Container>
            <Content>
              <Aside>
                <UserSettingMenu pathname={location.pathname} user={this.user}/>
              </Aside>
              <Main>
                {children}
                {/*<Route exact path={`${match.url}/settings`} component={UserSettingProfile}/>
                <Route exact path={`${match.url}/settings/account`} component={UserSettingAccount} {...this.props}/>
                <PrivateRoute exact path={`${match.url}/stories/new`} component={NewStory} hasRoles={['ADMIN', 'WRITER', 'EDITOR']} {...this.props} />
                <Route exact path={`${match.url}/stories`} component={UserSettingStory} {...this.props}/>*/}
              </Main>
            </Content>
          </Container>
          <Footer/>
       </Wrapper>
    )
  }
}

export default UserSetting
