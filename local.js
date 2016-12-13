'use strict'

let express = require('express')
let passport = require('passport')
let flash = require('connect-flash')
let LocalStrategy = require('passport-local').Strategy
let userDB = {};
userDB.snoob = '123456';
passport.use(new LocalStrategy(function(user,password,done){
    if(userDB[user]){
        if(userDB[user] === password) return done(null, {'name': user, 'password': password});
        else return done(null, null,{message: 'Incorect Password'});
    }
    else done(null,false,{message: 'Incorrect Username'})
}))

passport.serializeUser(function(user, done) {
  done(null, user.name)
})

passport.deserializeUser(function(name, done) {
  done(null,  {'name': name, 'password': userDB[name]});
})

let app = express()

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());
app.set('view engine', 'ejs')

app.get('/',
  function(req, res){
    console.log(req.flash('error'));
    res.render('local-login');
  })

app.post('/auth',
  passport.authenticate('local',{ successRedirect: '/profile',
                                   failureRedirect: '/',
                                   failureFlash: true }));
app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn('/'),
  function(req, res){
    console.log(req.user)
    res.send(`Welcome ${req.user.name}`);
  })

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})

app.listen(1338)