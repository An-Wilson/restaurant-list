const mongoose = require('mongoose')
const Restaurant = require('../restaurant')  // 載入 restaurant model
const seeders = require('../../restaurants.json') // 載入種子資料

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
  Restaurant.create(seeders.results)
  console.log('Seed data created!')
})