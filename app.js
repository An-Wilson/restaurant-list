// includes Express modules related variables
const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')  // 載入 Restaurant Model
const methodOverride = require('method-override')
const routes = require('./routes')  // 預設自動找 index.js
require('./config/mongoose')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret:'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)


app.listen(port, () => {
  console.log(`App is listening on localhost:${port}`)
})