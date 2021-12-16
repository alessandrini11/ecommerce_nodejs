const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const errorController = require('./controllers/error')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')

//routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
// models
// const Product = require('./models/product')
// const Cart = require('./models/cart')
const User = require('./models/user')
// const CartItem = require('./models/cart-item')
// const Order = require('./models/order')
// const OrderItem = require('./models/order-item')
const app = express()
const MONGODB_URI = 'mongodb+srv://alexriner:monange1104@eshopnodejs.0ysma.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
const csrfProtection = csrf()
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    } 
}

app.set('view engine','ejs')
app.set('views','views')
app.use(bodyParser.urlencoded({extended: false}))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(express.static(path.join(__dirname,'public')))
app.use('/images',express.static(path.join(__dirname,'images')))

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use((req,res,next) => {
    if (!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user
            next()
        })
        .catch(error => console.log(error))
})
app.use(flash())

// routes
app.use('/admin',adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

// 404 page
app.use(errorController.get404)

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(8000)
    })
    .catch(error => console.log(error))
// relation
// Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
// User.hasMany(Product)
//
//
// User.hasOne(Cart)
// Cart.belongsTo(User)
//
// Cart.belongsToMany(Product, {through: CartItem})
// Product.belongsToMany(Cart,{through: CartItem})
//
// Order.belongsTo(User)
// User.hasMany(Order)
// Order.belongsToMany(Product, { through: OrderItem})
//
// sequelize
//     .sync()
//     .then(result => {
//         return User.findByPk(1)
//         // console.log(result)
//     })
//     .then(user => {
//         if (!user) {
//             return User.create({name: "Alex", email: "test@hotmail.com"})
//         }
//         return Promise.resolve(user)
//     })
//     .then(user => {
//         app.listen(3000)
//         // console.log(user)
//     })
//     .catch( error => console.log(error))
