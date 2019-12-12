const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const Task = require('./task')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('email is invalid')
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber :{
      type : String,
      required : true,
      trim : true
    },
    address : {
      type : String,
      required : false,
      trim : true
    },
    gender : {
      type : Number
    },
    avatar: {
      type: Buffer,
    }
  },
  {
    timestamps: true,
  }
)

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'my_secret')

  user.token = token
  await user.save()

  return token
}

userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'customer',
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Gagal Login')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Gagal Login')
  }

  return user
}

userSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.pre('remove', async function(next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
