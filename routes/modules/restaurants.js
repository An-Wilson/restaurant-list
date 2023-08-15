// 路由模組
const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 頁面：新增餐廳
router.get('/new', (req, res) => {
  res.render('new')
})

// 功能：新增餐廳
router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, nameEn, category, location, phone, image, rating, description } = req.body
  Restaurant.create({ name, nameEn, category, location, phone, image, rating, description, userId })
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

// 頁面：特定餐廳詳細資料
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.error(err))
})

// 頁面：編輯特定餐廳資料
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.error(err))
})

// 功能：修改特定餐廳資料
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOneAndUpdate({ _id, userId }, req.body)
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(err => console.error(err))
})

// 功能：刪除特定餐廳資料
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOneAndDelete({ _id, userId })
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

module.exports = router