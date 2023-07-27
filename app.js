// includes Express modules related variables
const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')  // 載入 Restaurant Model

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

// setting routes
app.get('/', (req, res) => {
  Restaurant.find() // 取出 Restaurant Model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板
    .catch(err => console.error(err))
})

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  const { name, nameEn, category, location, phone } = req.body
  Restaurant.create({ name, nameEn, category, location, phone })
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

app.get('/restaurants/:id', (req, res) => {
  // const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.id
  // )
  // res.render('show', { restaurant: restaurant })
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.error(err))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.error(err))
})

// 暫時用 post ，之後要改成 PUT
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const { name, nameEn, category, location, phone } = req.body
  // const name = req.body.name
  // restaurant.name = req.body.name
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = nameEn
      restaurant.category = category
      restaurant.location = location
      restaurant.phone = phone
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => console.error(err))
})

// 暫時用 post ，之後要改成 DELETE
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

// 搜尋功能：Controller 把 keyword 給 Model ， Model 再發請求給資料庫
// 資料庫先撈出所有資料，再用 keyword 做篩選
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find() // 取出 Restaurant Model 裡的所有資料
    .lean()
    .then(allRestaurants => {
      const filteredRestaurants = allRestaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().trim().includes(keyword.toLowerCase().trim()) || restaurant.category.toLowerCase().trim().includes(keyword.toLowerCase().trim())
      })
      res.render('index', { restaurants: filteredRestaurants, keyword })
    })
    .catch(err => console.error(err))
})


app.listen(port, () => {
  console.log(`App is listening on localhost:${port}`)
})