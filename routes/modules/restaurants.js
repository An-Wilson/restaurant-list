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
  const { name, nameEn, category, location, phone } = req.body
  Restaurant.create({ name, nameEn, category, location, phone })
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

// 頁面：特定餐廳詳細資料
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.error(err))
})

// 頁面：編輯特定餐廳資料
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.error(err))
})

// 功能：修改特定餐廳資料
router.put('/:id', (req, res) => {
  const id = req.params.id
  // const { name, nameEn, category, location, phone } = req.body
  // return Restaurant.findById(id)
  //   .then(restaurant => {
  //     restaurant.name = name
  //     restaurant.name_en = nameEn
  //     restaurant.category = category
  //     restaurant.location = location
  //     restaurant.phone = phone
  //     return restaurant.save()
  //   })
  // 上方的 restaurant.name 等似乎無法再用解構賦值
  // 筆記：用 findByIdAndUpdate 更簡潔
  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => console.error(err))
})

// 功能：刪除特定餐廳資料
router.delete('/:id', (req, res) => {
  const id = req.params.id
  // return Restaurant.findById(id)
  //   .then(restaurant => restaurant.remove())

  // 筆記：remove()在 mongoose 新版已沒有搭配 model使用，用 findByIdAndDelete 更簡潔
  Restaurant.findByIdAndDelete(id)
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

module.exports = router