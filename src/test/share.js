var argv = require('yargs').argv
var Nightmare = require('nightmare');

var nightmare = Nightmare({ 
    show: true ,
    switches: {
      'ignore-certificate-errors': true
    }
});

const user = ['ochawinwin@gmail.com','nightmaretest@gmail.com', 'naoise.solomon@gmail.com'],
      password = ['12345678','nightmaretest', 'thisistestuser55678*']

const FRONTURL = argv.fronturl || 'http://localhost:3000',
      ISLOCALHOST = FRONTURL.indexOf('localhost')!==-1,
      BACKURL = argv.backurl || (ISLOCALHOST ? 'https://localhost:4000' : 'https://api.thesolar.co')
      
nightmare
    .goto(FRONTURL)
    .evaluate(function () {
         window.resizeTo(screen.width, screen.height)
    })

    .wait(3000)
    .click('#FirstTrendingStories')
    
    .wait(5000)
    .click("#ShareSideBarFb")
    .evaluate(function () {
         window.open('http://www.google.com','_blank')
    })
    .wait(10000)
    .click("#ShareSideBarMore")
    .wait(5000)
    .click("#ShareSideBarTwt")
    .wait(5000)
    .click("#ShareSideBarIn")
    .wait(5000)
    .click("#ShareSideBarLine")
    .wait(5000)
    .click("#ShareSideBarMore")
    .wait(3000)

    .refresh()

    .wait(3000)
    .click("#StoryDetailTopFb")
    .wait(5000)
    // .scrollTo(2000, 0)
    .wait(3000)
    .click("#StoryDetailTopFb")
    .wait(5000)

    .back()

    .wait(3000)
    .scrollTo(1000, 0)

    .wait(3000)
    .click('#FirstAricle')
    .wait(3000)
    .click('#dropdownFb')
    .wait(5000)
    .click('#dropdownTwt')
    .wait(5000)
    .click('#dropdownIn')
    .wait(5000)
    .click('#dropdownLine')
    .wait(5000)
    .click('#dropdownCopy')
    .wait(5000)

    .refresh()
    .wait(3000)

    .end()
    .then(function() {
        console.log("Share Button Test FINISH!!!")
    })
    .catch(function (error) {
        console.error('Search failed:', error);
    });