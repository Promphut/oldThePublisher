import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import utils from '../../../services/utils'
import auth from '../../../services/auth'

let toSigninPage = (props) => <Redirect to={{
	pathname: '/signin',
	state: { nextPathname: props.location }
}}/>


/*
	If users is logged in, render the children component
	Else will redirect to signin page.
	
	Also has the ability to check user roles by specified roles={[]} in property
	if specified roles is not unauthorized from cookie roles, 
	redirect user to 'unauthorized access' error page

	Component Properties Params:
	'rest':
		hasRoles={['ADMIN', 'EDITOR']}, default will ignore hasRoles checking
		bypassCidCheck=Boolean, default is true
*/
const PrivateRoute = ({ component: Component, ...rest }) => {
	return <Route {...rest} render={props => {
		// if loggedIn specified but no user login information, reject.
		if(!auth.loggedIn()) return toSigninPage(props)

		//console.log('PROPS', props)

		if(rest.roles){
			let user = auth.getUser(), 
				cid = props.match.params.cid || utils.querystring('cid', props.location)

        	if(!user) return toSigninPage(props)

    		if(!auth.hasRoles(rest.roles, cid, rest.bypassCidCheck)) 
    			utils.toError(props.history)(new Error('Unauthorized access'))

    		if(rest.render) return rest.render(props)
    		return <Component {...props}/>
		}

		// no need to check roles just return
		if(rest.render) return rest.render(props)
		return <Component {...props}/>
	}} />
}

export default PrivateRoute