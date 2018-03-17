var mongoose = require('mongoose')

module.exports.connect = function() {
  mongoose.connect('mongodb://localhost:27017/posts')
  var db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error'))
  db.once('open', function(cb) {
    console.log('Connection Succeeded')
  })
  return db
}
