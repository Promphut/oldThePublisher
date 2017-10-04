var auth = require('../services/auth')
//var chai = require('chai')
//var chaiAsPromised = require('chai-as-promised')
//chai.use(chaiAsPromised)
//var should = chai.should()
Promise = require('bluebird')
var find = require('lodash/find')
var should = require('chai').should()
var Request = require('superagent')
var Nightmare = require('nightmare')
var argv = require('yargs').argv
var config = require('../config')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  /** 
   * User[0] = Editor
   * User[1] = Unregistered User
   * User[2] = FB User
   */

const user = ['ochawinwin@gmail.com','nightmaretest@gmail.com', 'naoise.solomon@gmail.com'],
      password = ['12345678','nightmaretest', 'thisistestuser55678*']

const FRONTURL = argv.fronturl || 'http://localhost:3000',
      ISLOCALHOST = FRONTURL.indexOf('localhost')!==-1,
      BACKURL = argv.backurl || (ISLOCALHOST ? 'https://localhost:4000' : 'https://api.thesolar.co')

//console.log('ARG', process.argv, FRONTURL, BACKURL)

// STILL NOT FINISH, HAVE TO MOVE NONG BOOM'S TEST INTO THIS MOCHA TEST
describe('Check signin', function() {
  let nm 
  beforeEach(function(){
    nm = Nightmare({ 
      show: true ,
      switches: {
        'ignore-certificate-errors': true
      },
      Promise: Promise
    });
  })

  it('should sign in with correct email', function(done) {
    nm.goto(FRONTURL)
    .wait('#SignInPageButton')
    .click("#SignInPageButton")

    .wait('#SignInEmailField')
    .insert('#SignInEmailField',user[0])
    .insert('#SignInPasswordField', password[0])
    .click('#SignInButton')

    // 1. signed in, should redirect to homepage with right menu button existed
    .wait('#RightMenuButton')
    .exists('#RightMenuButton')
    .then(exist => { 
      exist.should.be.true 

      // 2. should be able to reload homepage, also with right menu button existed
      return nm
      .goto(FRONTURL)
      .wait('#RightMenuButton')
      .exists("#RightMenuButton")
    })
    .then(exist => {
      exist.should.be.true 

      // 3. after signed in, should present cookie
      return nm.cookies.get({
        path: '/',
        secure: true
      })
      .then(cookies => {
        should.exist( find(cookies, {name:'token'}) )
        should.exist( find(cookies, {name:'user'}) )
        should.exist( find(cookies, {name:'roles'}) )

        // 4. sign out, should appear sign in button on homepage
        return nm
        .click('#RightMenuButton')
        .click("#LogOutButton")
        .goto(FRONTURL)
        .wait('#SignInPageButton')
        .exists('#SignInPageButton')
      })
    })
    .then(exist => {
      exist.should.be.true

      // 5. after logged out cookie should not exist
      return nm.cookies.get({
        path: '/',
        secure: true
      })
      .then(cookies => {
        should.not.exist( find(cookies, {name:'token'}) )

        return nm.end()
      })
    })
    .then(() => {done()})
    .catch(done)
  })


  it('should unable to sign in with incorrect credential', function(done) {
    nm.goto(FRONTURL)
    .wait('#SignInPageButton')
    .click("#SignInPageButton")

    .wait('#SignInEmailField')
    .insert('#SignInEmailField',user[1])
    .insert('#SignInPasswordField', password[0])
    .click('#SignInButton')
    .wait(1000)
    .url()
    .then(url => {
      url.should.have.string('/signin')

      return nm.end()
    })
    .then(() => {done()})
    .catch(done)
  })

  if(!ISLOCALHOST){ // no need to check fb signin for localhost
    it('should sign in with facebook', function(done) {
      nm.goto(FRONTURL)
      .wait('#SignInPageButton')
      .click("#SignInPageButton")

      .wait('#SignInFacebookButton')
      .click("#SignInFacebookButton")

      // go to facebook.com to login
      .wait("#email")
      .insert('#email', user[2])
      .insert('#pass', password[2])
      .click("#loginbutton")

      // redirect back to homepage
      .wait('#RightMenuButton')
      .exists("#RightMenuButton")
      .then(exist => {
        exist.should.be.true 
        return nm.end()
      })
      .then(() => {done()})
      .catch(done)
    })
  }
})


describe('Check signup', function(){
  let nm 
  beforeEach(function(){
    nm = Nightmare({ 
      show: true ,
      switches: {
        'ignore-certificate-errors': true
      },
      Promise: Promise
    });
  })

  it('should sign up with used email', function(done){
    nm.goto(FRONTURL)
    .wait('#SignInPageButton')
    .click("#SignInPageButton")

    .wait("#SignUpButton")
    .click("#SignUpButton")

    // sign up page, enter username
    .wait("#EmailField")
    .insert("#EmailField",user[0])
    .click("#ConfirmEmailButton")

    // // will ask for pwd
    // .wait('input[name="password"]')
    // .insert('input[name="password"]', password[0])
    // .click('button[type="submit"]')

    // will ask for FB sign up button click
    .wait('#ContinueSignUpButton')
    .click('#ContinueSignUpButton')

    // already on facebook.com sign up dialog ?
    .wait("#loginbutton")
    .exists("#loginbutton")

    .then(exist => {
      exist.should.be.true 
      return nm.end()
    })
    .then(() => {done()})
    .catch(done)
  })

  // available for v1.5.1
  it('should sign up with available email', function(done){
    // firstly, clear out last time "nightmare" mock user
    Request.post(BACKURL + '/auth')
    .send({username : user[0], password : password[0]})
    .set('Accept', 'application/json')
    .then(res => {
      //console.log('HAHA1', res.body)  
      Request
      .delete(BACKURL + '/users/' + encodeURIComponent(user[1]))
      .send({token: res.body.token})
      .set('Accept','application/json')
      .then(res => {
        //console.log('HAHA2', res.body)

        nm.goto(FRONTURL)
        .wait('#SignInPageButton')
        .click("#SignInPageButton")

        .wait('#SignUpButton')
        .click("#SignUpButton")

        .wait('#EmailField')
        .insert("#EmailField",user[1])
        .click("#ConfirmEmailButton")

        .wait('#SignUpPasswordField')
        .insert("#SignUpPasswordField",password[1])
        .insert("#SignUpPasswordAgainField",password[1])
        .click("#ConfirmSignUp")

        // redirect back to homepage
        .wait('#RightMenuButton')
        .exists("#RightMenuButton")
        .then(exist => {
          exist.should.be.true 
          return nm.end()
        })
        .then(() => {done()})
        .catch(done)
      })
    })
  })

  it('should able to use editor mode', function(done){
    // sign in first
    nm.goto(FRONTURL)
    .wait("#SignInPageButton")
    .click("#SignInPageButton")

    .wait('#SignInEmailField')
    .insert('#SignInEmailField',user[0])
    .insert('#SignInPasswordField', password[0])
    .click('#SignInButton')

    // 1. should be able to click new story button
    .wait('#TopNewStoryButton')
    .click('#TopNewStoryButton')
    .url()
    .then(url => {
      url.should.have.string('/me/stories/new')

      // 2. should be able to go to editor mode
      return nm.wait('#RightMenuButton')
      .click("#RightMenuButton")
      .wait('#EditorModeButton')
      .click('#EditorModeButton')
      .url()
      .then(url => {
        url.should.have.string('/editor')

        return nm.end()
      })
    })
    .then(() => {done()})
    .catch(done)
  })
})