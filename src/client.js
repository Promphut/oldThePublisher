import 'react-hot-loader/patch'
import 'babel-polyfill'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
// require.extensions['.css'] = () => {
//   return null
// }
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { basename } from 'config'
import { CookiesProvider } from 'react-cookie'

import App2 from 'components/App2'
import api from 'services/api'
//import AppRoutes from 'components/routes'
//import mainStyles from '../public/scss/main.scss'

OfflinePluginRuntime.install()
//import App from 'components/App'

// class RenderApp extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       setting: {
//         publisher:{
//           theme: {}
//         },
//         menu: {}
//       }
//     }
//   }

//   componentWillMount(){
//     api.getPublisherSetting()
//     .then(setting => {
//       //console.log('componentWillMount', setting)
//       this.setState({
//         setting: setting
//       })
//     })
//   } 

//   render() {
//     return (
//       <CookiesProvider>
//         <BrowserRouter basename={basename}>
//           {/*<AppRoutes/>*/}
//           <AppRoutes2 setting={this.state.setting}/>
//         </BrowserRouter>
//       </CookiesProvider>
//     )
//   }
// }

const renderApp = (setting) => (
	<CookiesProvider>
		<BrowserRouter basename={basename}>
			{/*<AppRoutes/>*/}
      <App2 setting={setting}/>
		</BrowserRouter>
	</CookiesProvider>
)

const root = document.getElementById('app')
api.getPublisherSetting()
.then(setting => {
  render(renderApp(setting), root)
})

if (module.hot) {
  //module.hot.accept('components/App', () => {
  module.hot.accept('components/App2', () => {
    //require('components/App')
    require('components/App2')

    const root = document.getElementById('app')
    api.getPublisherSetting()
    .then(setting => {
      render(renderApp(setting), root)
    })
  })
}
