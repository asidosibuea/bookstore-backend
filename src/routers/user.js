const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')

// register
router.post('/users/register', async (req, res) => {
  const user = new User(req.body)

  try {
    const token = await user.generateAuthToken()
    await user.save()
    
    res.status(201).send({user, token})
  } catch (e) {
    res.status(400).send(e)
  }
})


// admin get all user
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      throw new Error("Can't get users")
    }
    const users = await User.find({})
    
    res.status(200).send({data : users, token : req.token})
  } catch (e) {
    res.status(500).send({ error: 'Must be an admin!'})
  }
})

//user find me
router.get('/users/me', auth, async (req, res) => {
  res.send({data : req.user, token : req.token})
})

// login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({user, token})
  } catch (e) {
    res.status(422).send({
      message: 'Login Gagal',
    })
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.token = req.token
    // req.user.tokens.filter(token => {
    //   return token.token !== req.token
    // })
    await req.user.save()

    res.send({ message: 'Logout Success' })
  } catch (e) {
    res.status(500).send({ message: 'Logout Gagal' })
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(500).send({ message: 'gagal delete' })
  }
})

const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }

    cb(undefined, true)
  },
})

// upload image
router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send({ message: 'berhasil di upload' })
  },
  (error, req, res) => {
    res.status(400).send({ error: error.message })
  }
)

// get image
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send({ message: 'image not found' })
  }
})

module.exports = router
