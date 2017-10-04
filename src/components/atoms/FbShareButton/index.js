import React from 'react'
import PropTypes from 'prop-types'
import api from '../../../services/api'
import utils from '../../../services/utils'
import config from '../../../config'
import { withRouter } from 'react-router'

class FbShareButton extends React.Component {
	static propTypes = {
		button: PropTypes.node.isRequired,
		id: PropTypes.string,
		hashtag: PropTypes.string, // optional, default is publisher name
		sid: PropTypes.number, // optional, default will try to pick sid from url, unless storyinsight won't be saved.
		url: PropTypes.string // optional, default is this window.location url. If url presented with /:sid, no need to input sid, it will auto get from the url.
	}

	constructor(props) {
		super(props)
	}
	getUrl = (done) => {
		// Get url
		let url = this.props.url
		if(!url){
			url = config.FRONTURL + this.props.location.pathname
		}
		api.shorten(url, {medium:'social', source:'facebook'})
		.then(done)
	}

	getUrl2 = () => {
		let url = this.props.url
		if(!url){
			url = config.FRONTURL + this.props.location.pathname
		}
		return url
	}

	popupwindow(url, title, w, h) {
		var left = (screen.width/2)-(w/2);
		var top = (screen.height/2)-(h/2);
		return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
	} 

	handleFbShare = (e) => {
		// Get sid
		let sid = this.props.sid
		if(sid==null) sid = utils.getTrailingSid(this.props.url)
		if(sid!=null) api.incStoryInsight(sid, 'share', 'share_fb')
		//console.log(sid)
		this.getUrl(res => {
			//console.log('URL', res)

			// Set hashtags
			let hashtag = this.props.hashtag
			if(hashtag==null) hashtag = '#'+config.NAME
	
			// FB.login(function(response) {
			// 		if (response.authResponse) {
			// 		console.log('Welcome!  Fetching your information.... ');
			// 		FB.api('/me', function(response) {
			// 			console.log('Good to see you, ' + response.name + '.');
			// 		});
			// 		} else {
			// 		console.log('User cancelled login or did not fully authorize.');
			// 		}
			// });
			// FB.getLoginStatus(function(response) {
			// 	console.log(response)
			// 	if (response.status === 'connected') {
			// 		// the user is logged in and has authenticated your
			// 		// app, and response.authResponse supplies
			// 		// the user's ID, a valid access token, a signed
			// 		// request, and the time the access token 
			// 		// and signed request each expire
			// 		var uid = response.authResponse.userID;
			// 		var accessToken = response.authResponse.accessToken;
			// 	} else if (response.status === 'not_authorized') {
			// 		// the user is logged in to Facebook, 
			// 		// but has not authenticated your app
			// 	} else {
			// 		// the user isn't logged in to Facebook.
			// 	}
			// });

			FB.ui({
				method: 'share',
				display:'dialog',
				mobile_iframe: true,
				hashtag: hashtag,
				href: res.url,
			}, function(response){
			})
		})
	}

	handleFbShare3 = (e) => {
		// Get sid
		//console.log(this.props.url)
		let url = this.getUrl2() //config.FRONTURL + this.props.location.pathname
		url = utils.appendUTM(url, {medium:'social', source:'facebook'})
		FB.ui({
			method: 'share',
			display:'dialog',
			mobile_iframe: true,
			hashtag: '#'+config.NAME,
			href: url,
		}, function(response){

		})
		// let sid = this.props.sid
		// if(sid==null) sid = utils.getTrailingSid(this.props.url)
		// if(sid!=null) api.incStoryInsight(sid, 'share', 'share_fb')
		//console.log(sid)
	}

	handleFbShare2 = (e) => {
		// Get sid
		let sid = this.props.sid
		if(sid==null) sid = utils.getTrailingSid(this.props.url)
		let hashtag = this.props.hashtag
		if(hashtag==null) hashtag = encodeURIComponent('#'+config.NAME)
		let url = encodeURIComponent(this.getUrl2())
		this.popupwindow(`https://www.facebook.com/sharer/sharer.php?u=${url}&hashtag=${hashtag}`,'hi',500,400)
	}

	render(){
		return (
			<div id={this.props.id} onClick={this.handleFbShare3} style={{...this.props.style}}>
				{this.props.button}
			</div>
		)
	}
}

export default withRouter(FbShareButton)
