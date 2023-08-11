// 首頁路由模組
const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  Restaurant.find({ userId: req.user._id }) // 取出 Restaurant Model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .sort({ _id: "asc" })
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板
    .catch(err => console.error(err))
})

// 功能：搜尋餐廳
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find({ userId: req.user._id })
    .lean()
    .then(allRestaurants => {
      const filteredRestaurants = allRestaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().trim().includes(keyword.toLowerCase().trim()) || restaurant.category.toLowerCase().trim().includes(keyword.toLowerCase().trim())
      })
      res.render('index', { restaurants: filteredRestaurants, keyword })
    })
    .catch(err => console.error(err))
})

// 匯出路由模組
module.exports = router