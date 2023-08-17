const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantList = require('../../restaurants.json').results
const SEED_USERS = [{
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678'
}, {
  name: 'user2',
  email: 'user2@example.com',
  password: '12345678'
}]

db.once('open', () => {
  Promise.all(Array.from(SEED_USERS, (seed, index) => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seed.password, salt))
      .then(hash => User.create({
        name: seed.name,
        email: seed.email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        return Promise.all(Array.from(
          { length: 3 },
          (_, i) => Restaurant.create({ ...restaurantList[i + 3 * index], userId })
        ))
      })
  }))
    .then(() => {
      console.log('Seed data created!')
      process.exit()
    })
})