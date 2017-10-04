import React from 'react'
import PropTypes from 'prop-types'
import api from '../../../services/api'
import utils from '../../../services/utils'
import config from '../../../config'
import { withRouter } from 'react-router'

class TwtShareButton extends React.Component {
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

	/*getUrl = (done) => {
		let url = this.props.url
		if(!url){
			url = config.FRONTURL + this.props.location.pathname
		}
		api.shorten(url, {medium:'social', source:'twitter'})
		.then(done)
	}*/

	/*componentWillReceiveProps(nextProps){
		if(nextProps.url && this.props.url != nextProps.url){
			api.shorten(nextProps.url, {medium:'social', source:'twitter'})
			.then(res => {
				this.setState({url: res.url})
			})
		}
	}

	componentDidMount(){
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
			this.a.addEventListener('tweetStory', function(event){
				//console.log('tweetStory', sid, event)
				api.incStoryInsight(sid, 'share', 'share_twt')

				//this.a.removeEventListener('tweetStory')
			})
		} 
	}*/

	handleTwtShare = (e) => {
		let sid = this.props.sid
		if(sid==null) sid = utils.getTrailingSid(this.props.url)
		if(sid!=null) api.incStoryInsight(sid, 'share', 'share_twt')
		let hashtag = this.props.hashtag
		if(hashtag==null) hashtag = config.NAME
		let url = this.props.url
		if(!url){
			url = config.FRONTURL + this.props.location.pathname
		}
		var win = window.open('about:blank');
		api.shorten(url, {medium:'social', source:'twitter'})
			.then(res=>{
				win.location = utils.getTweetUrl(res.url, hashtag)
			})
	}

	render(){
		// Set url
		/*let url = this.state.url

		// Set hashtags
		let hashtags = this.props.hashtags
		if(hashtags==null) hashtags = config.NAME*/

		return (
			<div id={this.props.id} onClick={this.handleTwtShare} style={{...this.props.style}}>
				{this.props.button}
			</div>
		)

		//return <a href={utils.getTweetUrl(url, hashtags)} ref={(_a) => {this.a = _a}}>{this.props.button}</a>;
	}
}

export default withRouter(TwtShareButton)