import Request from 'superagent'
import config from '../config'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//console.log(config)

const   FRONTURL = process.argv[3]==='--' || !process.argv[3] ? 'http://localhost:3000' : process.argv[3],
        BACKURL = FRONTURL.indexOf('localhost')!==-1 ? 'https://localhost:4000' : 'https://api.thesolar.co'
//console.log('F B', process.argv, FRONTURL, BACKURL)

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Page Availability 1', () => {

    it('Homepage', async () => {
        await Request
            .get(FRONTURL + '/')
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

    it('NewsPage', async () => {
        await Request
            .get(FRONTURL + '/stories/news')
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

    it('AllStoriesPage', async () => {
        await Request
            .get(FRONTURL + '/stories/all')
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

    it('AllColumnsPage', async () => {
        await Request
            .get(FRONTURL + '/stories/columns')
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

    it('ColumnsPage', async () => {
        var columns = await Request
            .get(BACKURL + '/publishers/' + config.PID + '/columns')
            .then(res => {
                return res.body.columns
            })

        var Promises = []

        for(var col of columns){
            Promises.push(
                Request
                    .get(FRONTURL + '/stories/' + col.slug)
                    .then(res => {
                        expect(res.status).toBe(200)
                    })
                )
            }

        await Promise.all([Promises])

    })
})


describe('Page Availability 2', () => {
    it('NewsPage', async () => {

        let page = 0
        let feeds = []
        let totalPages = 0
        
        // while(true){
        //     var results = await Request
        //         .get(BACKURL + '/publishers/' + config.PID + '/feed?type=news&page=' + page)
        //         .then(res => {
        //             return res.body
        //         })
        //     feeds = feeds.concat(results.feed)
        //     if(results.feed.length < 15)
        //         break
        //     page++
        // }
        feeds = await Request
            .get(BACKURL + '/publishers/' + config.PID + '/feed?type=news&page=0&limit=3')
            .then(res => {
                return res.body.feed
            })

        var Promises = []

        for(var index = 0 ; index < feeds.length ; index++){ 
            var link = ''
            for(var x of feeds[index].url.split('/')){
                link += '/' + encodeURIComponent(x)
            }
            await Request
                    .get(FRONTURL + link.substr(1))
                    .then(res => {
                        expect(res.status).toBe(200)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            await timeout(200)
            }
        
    },10000000)

    it('ArticlePage', async () => {

        let page = 0
        let feeds = []
        let totalPages = 0
        
        // while(true){
        //     var results = await Request
        //         .get(BACKURL + '/publishers/' + config.PID + '/feed?type=article&page=' + page)
        //         .then(res => {
        //             return res.body
        //         })
        //     feeds = feeds.concat(results.feed)
        //     if(results.feed.length < 15)
        //         break
        //     page++
        // }
        feeds = await Request
            .get(BACKURL + '/publishers/' + config.PID + '/feed?type=article&page=0&limit=3')
            .then(res => {
                return res.body.feed
            })

        var Promises = []

        for(var index = 0 ; index < feeds.length ; index++){ 
            var link = ''
            for(var x of feeds[index].url.split('/')){
                link += '/' + encodeURIComponent(x)
            }
            await Request
                    .get(FRONTURL + link.substr(1))
                    .then(res => {
                        expect(res.status).toBe(200)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            await timeout(200)
            }
        
    },10000000)

    it('Search', async () => {
        await Request
            .get(FRONTURL + '/search/article')
            .then(res => {
                expect(res.status).toBe(200)
            })
        await Request
            .get(FRONTURL + '/search/news')
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

    it('AboutPage', async () => {
        await Request
            .get(FRONTURL + '/about')
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

    it('ContactPage', async () => {
        await Request
            .get(FRONTURL + '/contact')
            .then(res => {
                expect(res.status).toBe(200)
            })
    })
})


describe('Page Availability 3', () => {
    it('TagPage', async () => {

        var tags = await Request
            .get(BACKURL + '/publishers/' + config.PID + '/tags')
            .then( res => { 
                //console.log('TAGS', res.body.tags.slice(0,4), config.PID)
                return res.body.tags.slice(0,4)
            })
        
        var Promises = []

        for(var tag of tags)
            Promises.push(
                Request
                    .get(FRONTURL + '/tags/' + encodeURIComponent(tag.slug))
                    .then(res => {
                        expect(res.status).toBe(200)
                    })
            )

        await Promise.all(Promises)
    })

    it('SignInPage', async () => {
        await Request
            .get(FRONTURL + '/signin')
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

    it('SignUpPage', async () => {
        await Request
            .get(FRONTURL + '/signup')
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

    it('ForgetPage', async () => {
        await Request
            .get(FRONTURL + '/forget')
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

    it('LogOutPage', async () => {
        await Request
            .get(FRONTURL + '/logout')
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.redirects[0]).toBe(FRONTURL + '/')
            })
    })

    //*User Page

    it('ErrorPage', async () => {
        await Request
            .get(FRONTURL + '/error')
            .then(res => {
            })
            .catch(err =>{
                expect(err.status).toBe(500)
            })
    })

    it('404Page', async () => {
        await Request
            .get(FRONTURL + '/404')
            .then(res => {
            })
            .catch(err => {
                expect(err.status).toBe(404)
            })
    })
})


describe('Private Route - Not Login', () => {
    
    it('EditorPage', async () => {
        await Request
            .get(FRONTURL + '/editor')
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.redirects[0]).toBe(FRONTURL + '/signin')
            })
    })

    it('SettingsPage', async () => {
        await Request
            .get(FRONTURL + '/me/settings')
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.redirects[0]).toBe(FRONTURL + '/signin')
            })
    })

    it('SettingsAccountPage', async () => {
        await Request
            .get(FRONTURL + '/me/settings/account')
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.redirects[0]).toBe(FRONTURL + '/signin')
            })
    })

    it('MyStoriesPage', async () => {
        await Request
            .get(FRONTURL + '/me/stories')
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.redirects[0]).toBe(FRONTURL + '/signin')
            })
    })

    it('NewStoryPage', async () => {
        await Request
            .get(FRONTURL + '/me/stories/new')
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.redirects[0]).toBe(FRONTURL + '/signin')
            })
    })

})

describe('404 Redirect', () => {

    it('Wrong Column Name', async () => {
        await Request
            .get(FRONTURL + '/stories/xxxx')
            .then((res)=> {
            })
            .catch(err => {
                expect(err.status).toBe(404)
            })
        })

    it('Wrong News Name', async () => {
        await Request
            .get(FRONTURL + '/stories/news/yyy')
            .then((res)=> {
            })
            .catch(err => {
                expect(err.status).toBe(404)
            })
        })

    it('Wrong Story Name', async () => {
        await Request
            .get(FRONTURL + '/stories/next-business/xxx')
            .then((res)=> {
            })
            .catch(err => {
                expect(err.status).toBe(404)
            })
        })

    it('Wrong Path Name', async () => {
        await Request
            .get(FRONTURL + '/yyyy')
            .then((res)=> {
            })
            .catch(err => {
                expect(err.status).toBe(404)
            })
        })

    it('Wrong Writer Name', async () => {
        await Request
            .get(FRONTURL + '/@yyyy')
            .then((res)=> {
            })
            .catch(err => {
                expect(err.status).toBe(404)
            })
        })

    it('Wrong Tag Name', async () => {
        await Request
            .get(FRONTURL + '/tags/xxxxx')
            .then((res)=> {
            })
            .catch(err => {
                expect(err.status).toBe(404)
            })
        })

})

describe('Get Config', () => {
    it('Check Config', async () =>  {
        var setting = await Request
            .get(BACKURL + '/publishers/' + config.PID + '/setting')
            .then((res) => {
                //console.log('CONFIG', config.PID, config.NAME, res.body.publisher.name, BACKURL)
                return res.body
            })

        expect(setting.publisher.name.replace(' ','')).toEqual(config.NAME.replace(' ','')) //ignore space

    })
})

