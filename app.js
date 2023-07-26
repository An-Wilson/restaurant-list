// includes Express modules related variables
const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')

// includes Mongoose related variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

const restaurantList = require('./restaurants.json')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
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