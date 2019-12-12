const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },
        category : {
            type : String,
            required : true,
            trim : true
        },
        author : {
            type : String,
            required : true,
            trim : true
        },
        publisher : {
            type : String,
            required : true,
            trim : true
        },
        yearRelease : {
            type : Number,
            maxlength : 4,
            trim : true
        },
        qtyPrice : {
            type : Number,
            required : true
        },
        inStock : {
            type : Number
        },
        outStock : {
            type : Number
        },
        image: {
            type: Buffer,
        }
    },
    {
        timestamps : true
    }
)

const Book = mongoose.model('Book', bookSchema)

module.exports = Book