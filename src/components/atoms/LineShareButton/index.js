import React from 'react'
import PropTypes from 'prop-types'
import api from '../../../services/api'
import utils from '../../../services/utils'
import config from '../../../config'
import { withRouter } from 'react-router'

class LineShareButton extends React.Component {
	static propTypes = {
		button: PropTypes.node.isRequired,
		id: PropTypes.string,
		hashtags: PropTypes.string, // optional, a string comma seperated, default is publisher name
		sid: PropTypes.number, // optional, default will try to pick sid from url, unless storyinsight won't be saved.
		url: PropTypes.string // optional, default is this window.location url. If url presented with /:sid, no need to input sid, it will auto get from the url.
	}

	constructor(props) {
		super(props)
		//this.state = { url:'' }
	}

	/*componentDidMount(){
		// Handel url
		this.getUrl(res => {
			//console.log('URL', res)
			this.setState({url: res.url})
		})

		// Handle story insight
		let sid = this.props.sid
		if(sid==null) sid = utils.getTrailingSid(this.props.url)

		// The story page will have sid, else just ignore.
		if(sid!=null){ 
			// When twt button clicked
			// add event to DOM element 
			//console.log('before tweet')
			this.a.addEventListener('click', function(event){
				//console.log('tweetStory', sid, event)
				api.incStoryInsight(sid, 'share', 'share_line')

				//this.a.removeEventListener('tweetStory')
			})
		} 
	}*/

	handleLineShare = (e) => {
		let sid = this.props.sid
		let url = this.props.url

		if(sid==null) sid = utils.getTrailingSid(this.props.url)
		if(sid!=null) api.incStoryInsight(sid, 'share', 'share_line')

		if(!url) url = config.FRONTURL + this.props.location.pathname
		
		window.open(utils.getLineUrl(utils.appendUTM(url, {medium:'social', source:'line'})),'_blank');
	}

	render(){
		// Set url
		/*let url = this.state.url
		
		return <a href={utils.getLineUrl(url)} target="_blank" ref={(_a) => {this.a = _a}}>{this.props.button}</a>;*/

		return (
			<div id={this.props.id} onClick={this.handleLineShare} style={{...this.props.style}}>
				{this.props.button}
			</div>
		)
	}
}

export default withRouter(LineShareButton)