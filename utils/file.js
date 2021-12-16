const fs = require('fs')

const deletefile = (path) => {
    fs.unlink(path, (error) => {
        if (error) {
            throw (error)
        }
    })
}

exports.deletefile = deletefile