import React from 'react'
import {Route} from 'react-router-dom'

const Status = ({ code, children }) => (
  <Route render={({ staticContext }) => {
  	//console.log('staticContext', staticContext)
    if (staticContext)
      staticContext.status = code
    return children
  }}/>
)

export default Status