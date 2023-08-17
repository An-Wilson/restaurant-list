// 首頁路由模組
const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

const sorts = [
  { sortName: "A - Z", sortBy: "a-z" },
  { sortName: "Z - A", sortBy: "z-a" },
  { sortName: "類別", sortBy: "category" },
  { sortName: "地區", sortBy: "location" }
]

router.get('/', (req, res) => {
  Restaurant.find({ userId: req.user._id }) // 取出 Restaurant Model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .sort({ _id: "asc" })
    .then(restaurants => res.render('index', { restaurants, sorts })) // 將資料傳給 index 樣板
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

// 功能：首頁排序功能
router.get('/sort/:sortBy', (req, res) => {
  const sortBy = req.params.sortBy
  let sort = {}

  if (sortBy === "a-z") {
    sort = { name: "asc" }
  } else if (sortBy === "z-a") {
    sort = { name: "desc" }
  } else if (sortBy === "category") {
    sort = { category: "asc" }
  } else if (sortBy === "location") {
    sort = { location: "asc" }
  }

  Restaurant.find({ userId: req.user._id })
    .lean()
    .sort(sort)
    .then(restaurants => res.render('index', { restaurants, sorts }))
    .catch(err => console.error(err))
})

// 匯出路由模組
module.exports = router