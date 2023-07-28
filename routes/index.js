// 總路由索引
const express = require('express')
const router = express.Router()

// 引入路由模組
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')

// 依網址結構導向個別模組
router.use('/', home)
router.use('/restaurants', restaurants)

module.exports = router