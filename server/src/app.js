const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const mongodbConnectModule = require('./mongodbConnectModule')
var db = mongodbConnectModule.connect()

var Post = require('../models/post')

// Get
app.get('/posts', (req, res) => {
  Post.find({}, 'title description', function(error, posts) {
    if (error) {
      console.error(error)
    }
    res.send({
      posts
    })
  }).sort({ _id: -1 })
})

// Post
app.post('/posts', (req, res) => {
  var db = req.db
  var title = req.body.title
  var description = req.body.description
  var new_post = new Post({
    title,
    description
  })

  new_post.save(function(error) {
    if (error) {
      console.error(error)
    }
    res.send({
      success: true,
      message: 'Post saved seccessfully!!'
    })
  })
})

// Fetch single Post
app.get('/post/:id', (req, res) => {
  var db = req.db
  Post.findById(req.params.id, 'title description', function(error, post) {
    if (error) {
      console.error(error)
    }
    res.send(post)
  })
})

// Update a post
app.put('/posts/:id', (req, res) => {
  // console.log(req, res)
  var db = req.db
  Post.findById(req.params.id, 'title description', function(error, post) {
    if (error) {
      console.error(error)
    }
    post.title = req.body.title
    post.description = req.body.description
    post.save(function(error) {
      if (error) {
        console.error(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete
app.delete('/posts/:id', (req, res) => {
  var db = req.db
  Post.remove(
    {
      _id: req.params.id
    },
    function(err, post) {
      if (err) {
        res.send(err)
      }
      res.send({
        success: true
      })
    }
  )
})
app.listen(process.env.PORT || 8081)
