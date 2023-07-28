// includes Express modules related variables
const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')  // 載入 Restaurant Model
const methodOverride = require('method-override')
const routes = require('./routes')  // 預設自動找 index.js

// includes Mongoose related variables
const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// const restaurantList = require('./restaurants.json')  連線 MONGODB，原資料改當種子資料

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)




app.listen(port, () => {
  console.log(`App is listening on localhost:${port}`)
})