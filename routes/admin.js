const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/isauth')

router.get('/add-product',isAuth,adminController.getAddProduct)
router.post('/add-product',isAuth,adminController.postAddProduct)
// router.get('/add-product',adminController.getAddProduct)
router.get('/products',isAuth,adminController.getProducts)
// router.post('/add-product',adminController.postAddProduct)
router.get('/edit-product/:productId',isAuth,adminController.getEditProduct)
router.post('/edit-product',isAuth,adminController.postEditProduct)
router.post('/delete-product',isAuth,adminController.postDeleteProduct)
 
// router.get('/add-product',adminController.getAddProduct)
// router.get('/add-product',adminController.getAddProduct)

module.exports = router