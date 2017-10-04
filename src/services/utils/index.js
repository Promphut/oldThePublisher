const htmlToText = require('html-to-text')

const config = require('../../config'), { parse } = require('query-string')
const moment = require('moment')
const utils = {}
const Request = require('superagent')

utils.getWidth = () => {
	return (
		window.innerWidth ||
		doc.clientWidth ||
		document.getElementsByTagName('body')[0].clientWidth
	)
}
utils.getHeight = () => {
	return (
		window.innerHeight ||
		doc.clientHeight ||
		document.getElementsByTagName('body')[0].clientHeight
	)
}

utils.getScrollX = () => {
	return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
}

utils.getScrollY = () => {
	return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
}
utils.isMobile = () => {
	//if(!navigator) return false
	// return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
	return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	)
}

utils.getFbUrl = fbid => {
	return 'https://facebook.com/' + fbid
}
utils.getTwtUrl = username => {
	return 'https://twitter.com/' + username
}
utils.getIgUrl = username => {
	return 'https://instagram.com/' + username
}
utils.getYtUrl = username => {
	// channel
	if (username.startsWith('UC') && username.length === 24)
		return 'https://youtube.com/channel/' + username

	// user
	return 'https://youtube.com/' + username
}

// default twt tweet url
utils.getTweetUrl = (url, hashtags) => {
	//console.log("TWT", url, hashtags)
	return (
		'https://twitter.com/intent/tweet?text=' +
		encodeURIComponent(url) +
		(hashtags ? '&hashtags=' + hashtags : '')
	)
}

utils.getLinkedInUrl = (url) => {
	return (
		'https://www.linkedin.com/shareArticle?mini=true&url=' +
		encodeURIComponent(url)
	)
}

utils.getLineUrl = (url) => {
	return (
		'https://timeline.line.me/social-plugin/share?url=' +
		encodeURIComponent(url)
	)
}

// append UTM to url
// utm: {source, medium, campaign, content}
utils.appendUTM = (url, utm) => {
	if (!utm) return url
	var utmUrl = 
		url +
		'?' +
		(utm
			? 'utm_source=' + encodeURIComponent(utm.source || config.DOMAIN) + '&'
			: '') +
		(utm && utm.medium
			? 'utm_medium=' + encodeURIComponent(utm.medium) + '&'
			: '') +
		(utm && utm.campaign
			? 'utm_campaign=' + encodeURIComponent(utm.campaign) + '&'
			: '') +
		(utm && utm.content
			? 'utm_content=' + encodeURIComponent(utm.content) + '&'
			: '')
	return (utmUrl.substr(0, utmUrl.lastIndexOf("&")==-1 ? utmUrl.length : utmUrl.lastIndexOf("&")))
}

utils.getTrailingSid = url => {
	// Get sid by trailing the last param from url
	// because all story url have trailing :sid
	//let arr = url ? url.split('/') : window.location.href.split('/')
	let arr
	if (!url) {
		if (!window) return null
		arr = window.location.href.split('/')
	}
	else arr = url.split('/')

	return parseInt(arr[arr.length - 1])
}

/*
	Refer from url pattern in routes.js
	Able to match public story url: Story1, Story2, Story3, Story4.
	For examples:
		/stories/nesdwsasdasdกดกดกดdfd/d-sddfsf/301
		/@ochawin/stories/d-sddfsf/301
		/u/1121/stories/d-sddfsf/30
*/
utils.getPublicSidFromPath = path => {
	let found = path.match(/\/stories\/[^\/ ]+[^\/ ]\/[^\/ ]+[^\/ ]\/[0-9]+$|\/@[^\/ ]+[^\/ ]\/stories\/[^\/ ]+[^\/ ]\/[0-9]+$|\/u\/[0-9]+\/stories\/[^\/ ]+[^\/ ]\/[0-9]+$/)
	if(!found) return null

	let arr = path.split('/')
	return parseInt(arr[arr.length - 1])
}

utils.dotToObj = (obj, str, val) => {
	str = str.split('.')
	while (str.length > 1) {
		let key = str.shift()
		if (!obj[key]) obj[key] = {}
		obj = obj[key]
	}
	return (obj[str.shift()] = val)
}

utils.getTotalPages = (itemsLimit, itemsCount) => {
	let count = Math.ceil(itemsCount / itemsLimit)
	return isNaN(count) ? 0 : count
}

utils.querystring = (field, location) => {
	if (!location || !field) throw new Error('location and field are required.')
	return parse(location.search)[field]
}

utils.toError = (history, err) => {
	history.replace({
		pathname: '/error'
	})

	return err
}
utils.notFound = history => {
	history.replace({
		pathname: '/404'
	})
}
utils.toSignin = history => {}

utils.analyticsHasImg = (html) => {
	if (!html) return false

	const img = html.match(/<img((?!>).)*/g)
	if (!img) return false
	return true
}

utils.analyticsHasLink = (html) => {
	if (!html) return false

	const link = html.match(/<a((?!>).)*/g)
	if (!link) return false
	return true
}

utils.analyticsDensityFocusWord = (focusWord, content) => {
	if (!focusWord || !content || focusWord == '') return 0

	const reg = new RegExp(focusWord, 'g')
	content = htmlToText.fromString(content,{ignoreImage:true,hideLinkHrefIfSameAsText:true})
	const match = content.match(reg)

	if (!match) return 0

	return ((focusWord.length * match.length) * 100) / content.length
}

// Return the number of char in content
utils.analyticsCharCount = (content) => {
	if (!content) return 0

	content = htmlToText.fromString(content,{ignoreImage:true,hideLinkHrefIfSameAsText:true})
  	return content.length
}

// Return number of repeated focus word in title
utils.analyticsHasFocusWordInTitle = (title, focusWord) => {
	if (!title || !focusWord || focusWord == '') return 0

	const reg = new RegExp(focusWord, 'g')
	const checkedString = title.match(reg)

	if (!checkedString) return 0
	return checkedString.length
}


utils.dateFormat = d => {
	var spl =  moment(d).fromNow().split(' ')
  if(spl[1]=='minutes'){
    return spl[0]+' min '+spl[2]
  }else if(spl[1]=='days'||spl[1]=='day'){
    if(spl[0]=='1') return 'yesterday'
    else return moment(d).format('ll');
  }else if(spl[1]=='months'||spl[1]=='month'||spl[1]=='years'||spl[1]=='year'){
    return moment(d).format('ll');
  }else{
    return moment(d).fromNow()
  }
}

utils.numberFormat = n => {
	if(n<999) return n
	else if(n>999&&n<99999){
		return (n/1000).toFixed(1)+'k'
	}else if(n>99999&&n<999999){
		return parseInt(n/1000)+'k'
	}else if(n>999999){
		return (n/1000000).toFixed(1)+'m'
	}
}

utils.FBShareCount = url => {
	return (
		Request.get('https://graph.facebook.com/?id='+url)
		.then((res)=>{
			//console.log(res)
			return res.body.share.share_count
		})
		.catch((er)=>{
			return Promise.resolve(0)
		})
	)
}

module.exports = utils
