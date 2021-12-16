// const Cart = require('../models/cart')
const Product = require('../models/product')
const fileHelper = require('../utils/file')
// get the add product page
exports.getAddProduct = (req, res, next) =>{
    res.render('admin/edit-product',{
        pageTitle: "add product",
        path: "/admin/add-product",
        activeAddProduct: true,
        isEditing: false,
        isAuthenticated: req.session.isLoggedIn
    })
    
}


// create a new product
exports.postAddProduct = (req, res, next) => {
    const image = req.file
    const description = req.body.description
    const title = req.body.title
    const price = req.body.price

    if (!image){
        return res.redirect('/admin/add-product')
    }

    const imageUrl = image.path
    
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    })
    product
        .save()
        .then(result => {
            console.log(result)
            console.log('product created')
            res.redirect('/admin/products')
        })
        .catch(error => console.log(error))

}

// get edit product page
exports.getEditProduct = (req, res, next) =>{
    const editMode = req.query.edit
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product',{
                pageTitle: "edit product",
                path: "/admin/edit-product",
                isEditing: editMode,
                product: product,
                isAuthenticated: req.isLoggedIn
            })
        })
}

// edit a product
exports.postEditProduct = (req, res, next) =>{
    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedImageUrl = req.file
    const updatedDesc = req.body.description
    Product.findOne({_id: prodId})
        .then(product => {
            product.title = updatedTitle
            product.price = updatedPrice
            product.description = updatedDesc
            if (updatedImageUrl) {
                fileHelper.deletefile(product.imageUrl)
                product.imageUrl = updatedImageUrl.path
            }
            return product.save()
        })
        .then(result => console.log("updated products"))
        .catch(error => console.log(error))
    res.redirect('/admin/products')
}

// get all products in the admin home page
exports.getProducts = (req, res, next) =>{
    Product
        .find()
        .populate('userId')
        .then(products => {
            res.render('admin/products',{
                pageTitle: "admin products",
                path: "/products",
                products: products,
                isEditing: false,
                isAuthenticated: req.isLoggedIn
            })
        })
        .catch(error => console.log(error) )
}

// delete product
exports.postDeleteProduct = (req, res, next) =>{
    const prodId = req.body.productId
    Product.findOne({ _id: prodId})
        .then(prod => {
            fileHelper.deletefile(prod.imageUrl)
            return Product.deleteOne({ _id: prodId, userId: req.user._id})
        })
        .then(() => {
            console.log("product destroy")
            res.redirect('/admin/products')
        })
        .catch(error => {
            console.log(error)
        });

}



