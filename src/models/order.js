const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
    {
        orderNumber : {
            type : String,
            required: true
        }, 
        customer : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : 'User'
        },
        total : {
            type : Number,
            required : true
        },
        diskon :{
            type : Number
        }
    }
)


const Order = mongoose.model('Order', orderSchema)
module.exports = Order