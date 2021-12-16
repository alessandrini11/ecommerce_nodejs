const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shop')
const isAuth = require('../middleware/isauth')


router.get('/products',shopController.getProducts)
router.get('/products/:productId',shopController.getProduct)
router.get('/cart',isAuth, shopController.getCart)
router.post('/cart',isAuth,shopController.postCart)
router.post('/cart-delete-item',isAuth,shopController.postCartDeleteProduct)
router.post('/create-order',isAuth,shopController.postOrder)
router.get('/checkout',isAuth,shopController.getCheckout)
router.get('/orders',isAuth,shopController.getOrders)
router.get('/orders/:orderId',isAuth, shopController.getInvoice)
router.get('/', shopController.getIndex)




module.exports = router