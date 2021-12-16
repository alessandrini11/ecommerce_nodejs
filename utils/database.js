const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db;
const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://alexriner:monange1104@eshopnodejs.0ysma.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
        .then(client => {
            console.log('connected')
            _db = client.db()
        })
        .catch(error => {
            console.log(error)
            throw error
        })
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found'
}
exports.mongoConnect = mongoConnect
exports.getDb = getDb