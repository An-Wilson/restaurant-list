const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')  // 載入 restaurant model
const seeders = require('../../restaurants.json') // 載入種子資料

db.once('open', () => {
  Restaurant.create(seeders.results)
  console.log('Seed data created!')
})