const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Food = require('./Food').schema

const OrderSchema = new Schema({
    total: {
        type: Number,
        required: true
    },
    createdAt: {
		type: Date,
		default: Date.now
	},
    orderDetail: [Food, {
        quantity: {
            type: Number,
            require: true
        }
    }]
})

module.exports = mongoose.model('orders', OrderSchema)