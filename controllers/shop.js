const Product = require('../models/product')
// const Cart = require('../models/cart')
const Order = require('../models/order')
const User = require('../models/user')
const fs = require('fs')
const path = require('path')
const PDF = require('pdfkit')
// get the list of all products on the products page
exports.getProducts = (req, res, next) =>{
    Product.find()
        .then(products => {
            res.render('shop/product-list',{
                pageTitle: "products",
                path: "/products",
                products: products,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(error => console.log(error) )
}

// get a unique product
exports.getProduct = (req, res, next) =>{
    const prodId = req.params.productId
    Product.findOne({_id: prodId})
        .then(product => {
            res.render('shop/product-detail',{
                pageTitle: product.title,
                product: product,
                path: `/product/${product.id}`,
                isAuthenticated: req.session.isLoggedIn
            })

        })
        .catch(error => console.log(error))
}

// get all products on the home page
exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index',{
                pageTitle: "home",
                path: "/",
                products: products,
                isAuthenticated: req.session.isLoggedIn,
            })
        })
        .catch(error => console.log(error) )
    
}

// get cart page with all products present in the cart
exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items
            res.render('shop/cart',{
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(error => console.log(error))
}

// add a product in the cart
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => res.redirect('/cart'))
        .catch(error => console.log(error))
}

// delete product from the cart
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user
        .deleteCartItem(prodId)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(error => console.log(error))
}

//get the checkout page
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout',{
        pageTitle: 'checkout',
        path: '/checkout'
    })
}

//create a new order
exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(item => {
                return {quantity: item.quantity, product: {...item.productId._doc}}
            })
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            })
            return order.save()
        })
        .then(result => {
            return req.user.clearCart()
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(error => {
            console.log(error)
        })
}
//get the orders page
exports.getOrders = (req, res, next) => {
    Order
        .find({"user.userId": req.user._id })
        .then(orders => {
            console.log(orders)
            res.render('shop/orders',{
                pageTitle: "your order",
                path: "/orders",
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            })
        });
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId
    Order.findById(orderId)
        .then(order => {
            if (!order){
                return next()
            }
            if (order.user.userId.toString() !== req.user._id){
                console.log("Unauthorized")
            }
            const invoiceName = 'invoice-' + orderId + '.pdf'
            const invoicePath = path.join('data','invoices',invoiceName)
            const pdfdoc = new PDF()
            res.setHeader('Content-Type','application/pdf')
            res.setHeader(
                'Content-Disposition',
                'inline; filename= "' + invoiceName + '"'
            )
            pdfdoc.pipe(fs.createWriteStream(invoicePath))
            pdfdoc.pipe(res)

            pdfdoc.fontSize(26).text('Invoice',{
                underline: true
            })
            pdfdoc.text('----------------------------------')
            
            let totalprice = 0
            order.products.forEach(prod => {
                totalprice += + prod.quantity * prod.product.price
                pdfdoc.fontSize(16).text(
                    prod.product.title.trim() + ' - ' + prod.quantity + ' x ' + prod.product.price + 'XAF' 
                )
            });
            pdfdoc.text('**********************************')
            pdfdoc.fontSize(20).text('Total Price = ' + totalprice)
            pdfdoc.end()


        })
        .catch(error => console.log(error))
}