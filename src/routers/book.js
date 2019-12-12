const express = require('express')
const Book = require('../models/book')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
var ObjectId = require('mongoose').Types.ObjectId; 

// add book
router.post('/books', auth, async (req, res) => {
    let book = new Book({
        ...req.body
    })
    
    try {
        await book.save()
        res.status(201).send(book)
    } catch (e) {
        res.status(500).send(e)
    }
})

// update
router.post('/books/:id/update', auth, async (req, res) => {    
    try {
        let book = await Book.findByIdAndUpdate(req.params.id,
            { ...req.body }, {new: true})
        book.save()
        res.status(201).send(book)
    } catch (e) {
        res.status(500).send(e)
    }
})

// get all book : /books
// get books by name --> /books?name=example 
// get books by category --> /books?category=example
router.get('/books', auth, async (req, res) => {
    try {
        let books = await Book.find(
            {
                name : { $regex : new RegExp(req.query.name, "i")}, 
                category : { $regex : new RegExp(req.query.category, "i")} 
            }
        )
        res.status(200).send(books)    
    } catch (e) {
        res.status(500).send(e)
    }
})

// get book by id
router.get('/books/:id', auth, async (req, res) => {
    try {
        let book = await Book.find({ _id : new ObjectId(req.params.id) } )
        res.status(200).send(book) 
           
    } catch (e) {
        res.status(500).send(e)
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

//upload image
router.post(
    '/books/:id/image',
    auth,
    upload.single('image'),
    async (req, res) => {
        let book = await Book.findByIdAndUpdate(req.params.id,
            { image: req.file.buffer }, {new: true})
        book.save()
        res.send({ message: 'berhasil di upload' })
    },
    (error, req, res) => {
        res.status(400).send({ error: error.message })
    })

// get image
router.get('/books/:id/image', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        if (!book || !book.image) {
        throw Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(book.image)
    } catch (e) {
        res.status(404).send({ message: 'image not found' })
    }
    })

    
module.exports = router
    