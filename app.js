// includes Express modules related variables
const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurants')  // 載入 Restaurant Model

// includes Mongoose related variables
const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI)

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

app.get('/', (req, res) => {
  Restaurant.find() // 取出 Restaurant Model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板
})

app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.id
  )
  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const searchRestaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().trim().includes(keyword.toLowerCase().trim()) || restaurant.category.toLowerCase().trim().includes(keyword.toLowerCase().trim())
  })
  res.render('index', { restaurants: searchRestaurants, keyword: keyword })
})


app.listen(port, () => {
  console.log(`App is listening on localhost:${port}`)
})