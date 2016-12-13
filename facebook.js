'use strict'

let express = require('express')
let passport = require('passport')
let Strategy = require('passport-facebook').Strategy

passport.use(new Strategy({
    clientID: '1628225644140390',
    clientSecret: '42193fc402f146293ecd5906cd82984d',
    callbackURL: 'http://localhost:1337/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile)
  }))

passport.serializeUser(function(user, cb) {
  cb(null, user)
})

passport.deserializeUser(function(obj, cb) {
  cb(null, obj)
})

let app = express()

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')

app.get('/',
  function(req, res){
    res.render('facebook-login')
  })

app.get('/login',
  passport.authenticate('facebook',{display: 'popup'}))

app.get('/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile')
  })

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    console.log(req.user)
    res.json({ user: req.user })
  })

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})

app.listen(1337)