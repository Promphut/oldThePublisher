/* eslint-disable no-console */
import 'babel-polyfill'
// require.extensions['.css'] = () => {
//   return null
// }
// allow self signed cert for dev mode
if (process.env.NODE_ENV === 'development') {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
	require('longjohn')
}
import path from 'path'
import express from 'express'
import React from 'react'
//import styleSheet from 'styled-components/lib/models/StyleSheet'
import { ServerStyleSheet } from 'styled-components'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-router-server'
import { CookiesProvider } from 'react-cookie'
import cookiesMiddleware from 'universal-cookie-express'

//import forceSSL from 'express-force-ssl'
import http from 'http'
import https from 'https'
import fs from 'fs'

import {
	FRONTURL,
	port,
	host,
	basename,
	ANALYTIC,
	COVER,
	amazonAccessKey,
	secretKey,
	PID
} from 'config'
//import AppRoutes from 'components/routes'
import App2 from 'components/App2'
import Html from 'components/Html'
import ErrorPage from 'components/ErrorPage'
import api from './services/api'
import sm from 'sitemap'

const renderApp = ({ cookies, context, location, sheet, setting }) => {
	const app = sheet.collectStyles(
		<CookiesProvider cookies={cookies}>
			<StaticRouter context={context} location={location}>
				<App2 setting={setting} />
				{/*<AppRoutes/>*/}
				{/*<AppRoutes currentlocation = {req.url}/>*/}
			</StaticRouter>
		</CookiesProvider>
	)

	return renderToString(app)
}

const extractMeta = (setting, url) => {
	//console.log(setting)
	let meta = {
		name: '',
		keywords: setting.publisher.keywords || '',
		desc: setting.publisher.desc || '',
		cover: COVER || '',
		analytic: ANALYTIC.FBAPPID || '',
		url: url,
		logo: setting.publisher.theme.slogo,
		publisher: setting.publisher.name,
		writer: setting.publisher.name,
		datePublished: new Date()
	}

	if (setting.publisher.name)
		meta.name =
			setting.publisher.name +
			(setting.publisher.tagline ? ' | ' + setting.publisher.tagline : '')

	let path = url.split('/')

	if (
		path[1] === 'stories' &&
		!(path[2].startsWith('all') || path[2].startsWith('columns')) &&
		!path[3]
	) {
		// 1. Column case
		let slug = decodeURIComponent(path[2])
		return api
			.getColumnFromSlug(slug)
			.then(col => {
				if (col.name) meta.name = col.name + ' | ' + setting.publisher.name
				if (col.shortDesc) meta.desc = col.shortDesc
				if (col.cover && col.cover.medium) meta.cover = col.cover.medium
				if (col.url) meta.url = col.url
				return meta
			})
			.catch(err => {
				return { status: 404 }
			})
	} else if (
		path[1] === 'stories' &&
		!(path[2].startsWith('all') || path[2].startsWith('columns'))
	) {
		// 2. Story case
		if (path.length > 4 && path[4]) {
			let sid = path[4]
			return api
				.getStoryFromSid(sid)
				.then(res => {
					let s = res.story
					//console.log(s)
					if (s.ptitle) meta.name = s.ptitle + ' | ' + setting.publisher.name
					if (s.contentShort) meta.desc = s.contentShort
					if (s.cover) meta.cover = s.cover.large || s.cover.medium
					if (s.url) meta.url = s.url
					if (s.writer) meta.writer = s.writer.display
					if (s.published) meta.datePublished = s.published
					return meta
				})
				.catch(err => {
					return { status: 404 }
				})
		} else return Promise.resolve(meta)
	} else if (path[1] && path[1].substring(0, 1) === '@') {
		// 3. User case with username
		let user
		if (path[1].indexOf('?') != -1)
			user = decodeURIComponent(path[1].substring(1, path[1].indexOf('?')))
		else user = decodeURIComponent(path[1].substring(1))
		return api
			.getUserFromUsername(user)
			.then(u => {
				if (u.display) meta.name = u.display + ' | ' + setting.publisher.name
				if (u.desc) meta.desc = u.desc
				if (u.url) meta.url = u.url
				return meta
			})
			.catch(err => {
				return { status: 404 }
			})
	} else if (path[1] === 'u') {
		// 4. User case with user id
		let uid
		if (path[2].indexOf('?') != -1)
			uid = path[2].substring(path[2].indexOf('?'))
		else uid = path[2]
		path[2].substring(1, path[1].indexOf('?'))
		return api
			.getUser(uid)
			.then(u => {
				if (u.display) meta.name = u.display + ' | ' + setting.publisher.name
				if (u.desc) meta.desc = u.desc
				if (u.url) meta.url = u.url
				return meta
			})
			.catch(err => {
				return { status: 404 }
			})
	} else if (path[1] === 'tags') {
		// 5. Tags case
		let tag
		if (path[2].indexOf('?') != -1)
			tag = path[2].substring(0, path[2].indexOf('?'))
		else tag = path[2]
		return api.getTagFromTagSlug(decodeURIComponent(tag)).then().catch(err => {
			return { status: 404 }
		})
	} else return Promise.resolve(meta)
}

// const getMeta = (u) => {
// 	return api.getPublisherSetting().then(setting => {
// 		let name = setting.publisher.name+' | '+setting.publisher.tagline || ''
// 		let keywords = setting.publisher.keywords || ''
// 		let desc = setting.publisher.desc || ''
// 		let cover = COVER || ''
// 		let url = '' || ''
// 		let analytic = ANALYTIC.FBAPPID || ''
// 		var data = {name,keywords,desc,cover,analytic,url}
// 		const path = u.split('/')
// 		if (path[1] === 'stories' && (path[3] == '' || path[3] == undefined)) {
// 			const slug = decodeURIComponent(path[2])
// 			return api.getColumnFromSlug(slug).then(res => {

// 				data.name = res.name && res.name
// 				data.desc = res.shortDesc && res.shortDesc
// 				data.cover = res.cover.medium && res.cover.medium
// 				data.url = res.url && res.url
// 				return data
// 			}).catch((err)=>{return data})
// 		} else if (path[1] === 'stories') {
// 			const sid = path[4]
// 			return api.getStoryFromSid(sid).then(res => {

// 				data.name = res.story.ptitle && res.story.ptitle
// 				data.desc = res.story.contentShort && res.story.contentShort
// 				data.cover = res.story.cover.large && res.story.cover.large
// 				data.url = res.story.url && res.story.url
// 				return data
// 			}).catch((err)=>{return data})
// 		} else if (path[1].substring(0, 1) === '@') {
// 			const user = decodeURIComponent(path[1].substring(1))
// 			return api.getUserFromUsername(user).then(res => {

// 				data.name = res.display && res.display
//  				data.desc = res.desc && res.desc
// 				data.url = res.url && res.url
// 				return data
// 			}).catch((err)=>{return data})
// 		} else if (path[1] === 'u') {
// 			const uid = path[2]
// 			return api.getUser(uid).then(res => {

// 				data.name = res.display && res.display
//  				data.desc = res.desc && res.desc
// 				data.url = res.url && res.url
// 				return data
// 			}).catch((err)=>{return data})
// 		} else {
// 			return data
// 		}
// 	}).catch((err)=>{
// 		console.error(err)
// 		var data = {name:'',keywords:'',desc:'',cover:'',analytic:'',url:''}
// 		return data
// 	})
// }

const renderHtml = ({ content, sheet, meta }) => {
	//const styles = styleSheet.rules().map(rule => rule.cssText).join('\n')
	const styles = sheet.getStyleElement()
	const assets = global.assets
	const html = <Html {...{ styles, assets, content, meta }} />
	return `<!doctype html>\n${renderToStaticMarkup(html)}`
}

const app = express()

//app.use(forceSSL)
app.use(
	basename,
	express.static(path.resolve(process.cwd(), 'dist/public'), { maxAge: '7d' })
)
app.use(cookiesMiddleware())

var options = {
	tmpDir: './public/uploads/tmp',
	uploadUrl: '/thepublisher/publishers/' + PID + '/',
	imageTypes: /\.(gif|jpe?g|png)/i,
	useSSL: true,
	imageVersions: {
		maxWidth: 730,
		maxHeight: 'auto'
	},
	accessControl: {
		allowOrigin: '*',
		allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
		allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
	},
	storage: {
		type: 'aws',
		aws: {
			accessKeyId: amazonAccessKey,
			secretAccessKey: secretKey,
			//bucketName : 'thepublisher/publishers/'+PID,
			bucketName: 'thepublisher',
			acl: 'public-read',
			region: 'ap-southeast-1',
			path: 'publishers/' + PID + '/',
			expiresInMilliseconds: 99999999,
			getSignedUrl: false
		}
	}
}

var uploader = require('blueimp-file-upload-expressjs')(options)

app.post('/upload/img', (req, res) => {
	uploader.post(req, res, function(err, obj) {
		//console.log('HAHA', err, obj)
		res.send(JSON.stringify(obj))
	})
})

// app.delete('/upload/img',
// 	(req,res)=>{
// 		uploader.delete(req, res, function (err,obj) {
// 				res.send(JSON.stringify(obj));
// 		});
// 	}
// )
app.get('/sitemap.xml', (req, res) => {
	api.getPublisherSetting().then(setting => {
		var column = []
		setting.menu.column.map((val, inx) => {
			column.push({
				url: '/stories/columns/' + val.slug,
				changefreq: 'daily',
				priority: 0.8
			})
		})
		const sitemap = sm.createSitemap({
			hostname: FRONTURL,
			cacheTime: 600000, // 600 sec - cache purge period
			urls: [
				{ url: '/', changefreq: 'daily', priority: 1, img: COVER },
				{ url: '/stories/news', changefreq: 'daily', priority: 0.8 },
				{ url: '/stories/all', changefreq: 'daily', priority: 0.8 },
				...column,
				{ url: '/stories/columns', changefreq: 'weekly', priority: 0.5 },
				{ url: '/about' },
				{ url: '/contact' }
			]
		})
		sitemap.toXML(function(err, xml) {
			if (err) {
				return res.status(500).end()
			}
			res.header('Content-Type', 'application/xml')
			res.send(xml)
		})
	})
})

app.get('/robots.txt', (req, res) => {
	let robotTxt = ''

	if (process.env.NODE_ENV === 'production')
		robotTxt = `User-agent: *
Disallow: /me/*
Disallow: /editor
Disallow: /editor/*
Sitemap: ${FRONTURL}/sitemap.xml`
	else
		robotTxt = `User-agent: *
Disallow: /
Sitemap: ${FRONTURL}/sitemap.xml`

	res.send(robotTxt)
})

app.get(['/feed', '/feed/rss', '/rss'], (req, res) => {
	let type = req.query.type || 'article'
	api
		.getFeed(type.toLowerCase(), { status: 1 }, 'latest', null, null, 20, {
			rss: true
		})
		.then(result => {
			res.set('Content-Type', 'text/xml')
			res.send(result.xml)
		})
})

app.get(['/feed/atom', '/atom'], (req, res) => {
	let type = req.query.type || 'article'
	api
		.getFeed(type.toLowerCase(), { status: 1 }, 'latest', null, null, 20, {
			atom: true
		})
		.then(result => {
			res.set('Content-Type', 'text/xml')
			res.send(result.xml)
		})
})

app.get(['/linetoday', '/feed/linetoday'], (req, res) => {
	let type = req.query.type || 'article'
	api
		.getFeed(type.toLowerCase(), { status: 1 }, 'latest', null, null, 20, {
			line: true
		})
		.then(result => {
			res.set('Content-Type', 'text/xml')
			res.send(result.xml)
		})
})

app.use((req, res, next) => {
	global.window = global.window || {}
	global.navigator = global.navigator || {}
	global.navigator.userAgent = req.headers['user-agent'] || 'all'
	//console.log('req')
	const location = req.url
	const context = {}
	const sheet = new ServerStyleSheet()

	api.getPublisherSetting().then(setting => {
		if (!setting || !setting.publisher)
			return next(new Error('Cannot get publisher setting.'))
		//console.log('SETTING', setting)
		extractMeta(setting, location)
			.then(meta => {
				//console.log("META", meta)
				renderApp({
					cookies: req.universalCookies,
					context,
					location,
					sheet,
					setting
				})
					.then(({ html: content }) => {
						if (meta.status == 404) {
							return res.redirect('/404')
						}
						if (context.status) {
							res.status(context.status)
						}
						if (context.url) {
							res.redirect(context.url)
						} else {
							res.send(renderHtml({ content, sheet, meta }))
						}
					})
					.catch(next)
			})
			.catch(next)
	})

	// getMeta(req.url).then((meta)=>{
	// 	//console.log('data',meta)
	// 	renderApp({ cookies:req.universalCookies, context, location, sheet })
	// 	.then(({ html: content }) => {
	// 		if (context.status) {
	// 			res.status(context.status)
	// 		}
	// 		if (context.url) {
	// 			res.redirect(context.url)
	// 		} else {
	// 			res.send(renderHtml({ content, sheet, meta }))
	// 		}
	// 	})
	// 	.catch(next)
	// })
})

app.use((err, req, res, next) => {
	const sheet = new ServerStyleSheet()
	const content = renderToStaticMarkup(sheet.collectStyles(<ErrorPage />))

	var meta = {
		name: '',
		keywords: '',
		desc: '',
		cover: '',
		analytic: '',
		url: ''
	}

	res.status(500).send(renderHtml({ content, sheet, meta }))

	console.error(err)

	next(err)
})

function startListen(_server, _url, _port) {
	_server.listen(_port)

	_server.on('error', err => {
		if (err.syscall !== 'listen') {
			throw err
		}

		let bind = typeof _port === 'string' ? 'Pipe ' + _port : 'Port ' + _port

		// handle specific listen errors with friendly messages
		switch (err.code) {
			case 'EACCES':
				console.error(bind + ' requires elevated privileges')
				process.exit(1)
				break
			case 'EADDRINUSE':
				console.error(bind + ' is already in use')
				process.exit(1)
				break
			default:
				throw err
		}
	})

	_server.on('listening', () => {
		const boldBlue = text => `\u001b[1m\u001b[34m${text}\u001b[39m\u001b[22m`

		let addr = _server.address()
		let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
		console.info(
			`Server is running at ${boldBlue(`${_url}:${_port}${basename}/`)}`
		)
	})
}

const server = http.createServer(app)
startListen(server, 'http://localhost', port)

// Use local cert for development mode,
// For production / test, nginx'll handle this
if (process.env.NODE_ENV === 'development') {
	const ssl_options = {
		key: fs.readFileSync('./private/keys/localhost.key'),
		cert: fs.readFileSync('./private/keys/localhost.crt'),
		passphrase: 'thepublisher'
	}
	const secureServer = https.createServer(ssl_options, app)
	startListen(secureServer, 'https://localhost', parseInt(port) + 100)
}
