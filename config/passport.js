// 1. 先載入相關模組
const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

// 2. module.exports 並初始化套件
module.exports = app => {
  // 初始化 passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy(
    // 設定 passReqToCallback 及 引數 req
    { usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            // return done(null, false, { message: '此帳號不存在' })
            return done(null, false, req.flash('warning_msg', '此帳號不存在'))
          }
          return bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('warning_msg', '密碼核對錯誤'))
              // return done(null, false, { message: '密碼核對錯誤' })
            }
            return done(null, user)
          })
        })
        .catch(err => done(err, false))
    }))

  // 設定序列化及反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(user => done(err, null))
  })
}