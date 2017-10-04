import React from 'react'
import {ErrorAndNotFound, Status} from 'components'

const NotFoundPage = () => {
	return (
		<Status code={404}>
	    	<ErrorAndNotFound title="404">
				Sorry, we couldn’t find the page you’re looking for.
	    	</ErrorAndNotFound>
	    </Status>
	)
}

export default NotFoundPage;
