const merge = require('lodash/merge')

//const browser = typeof window !== 'undefined'
//const ip = process.env.IP || '0.0.0.0'
//const port = process.env.PORT || 3000

const config = {
	all: {
		env: process.env.NODE_ENV || 'development',
		isDev: process.env.NODE_ENV === 'development',
		basename: process.env.PUBLIC_PATH,
		isBrowser: typeof window !== 'undefined',
		isServer: typeof window === 'undefined',
		host: process.env.HOST || 'localhost',
		port: process.env.PORT || 3000,

    FROMDATE:'20170610',
    PID:'11',
    NAME: 'NextEmpire', // one word, no space
    FACEBOOK: 'nextempire',
    FEED_LIMIT: 15,
    FEED_LIMIT_MOBILE: 5,
    ROLES: {
      MEMBER: 0,
      EDITOR: 1,
      WRITER: 2,
      ADMIN: 3
    },
    ANALYTIC: {
      FBAPPID: '140137096570931',
      TAGMGRID: 'GTM-MCM6KWJ',
      CHARTBEATUID: 65098,
      QUANTCASTACC: 'p-uSc6wXBs-FJmv',
      BITLY: '45602029bdf37773b3c3887a281ed9b7e13c5622' // infographicthailand
    },
    amazonAccessKey : 'AKIAJKZV2MRFEBXGXVTQ',
    secretKey : "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"
  },
  development: {
    ANALYTIC: {
      FBAPPID: '292566221211882',
    },
    DOMAIN:     'localhost',
    FRONTURL:     'http://localhost:3000',
    BACKURL:    'https://localhost:4000',
    COVER:  'https://localhost:3000/pic/fbthumbnail.jpg'
  },
  production: {
    DOMAIN:     'nextempire.co',
    FRONTURL:     'https://nextempire.co',
    BACKURL:    'https://api.thesolar.co',
    COVER:  'https://nextempire.co/pic/fbthumbnail.jpg'
  },
  'staging': {
    DOMAIN:     'staging.nextempire.co',
    FRONTURL:     'https://staging.nextempire.co',
    BACKURL:    'https://staging.thesolar.co',
    COVER:  'https://staging.nextempire.co/pic/fbthumbnail.jpg'
  },
}

module.exports = merge(config.all, config[config.all.env])
