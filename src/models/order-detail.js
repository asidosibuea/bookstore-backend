const mongoose = require('mongoose')

const orderDetailSchema = mongoose.Schema(
    {
        orderId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : 'Order'
        },
        qty : {
            type : Number,
            required : true
        },
        subtotal : {
            type : Number,
            required : true
        },
        diskon :{
            type : Number
        }
    }
)


const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema)
module.exports = OrderDetail