const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FoodSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    nation: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    isFavorite: {
        type: Boolean,
    },
    quantity: {
        type: Number,
    }
})

module.exports = mongoose.model('foods', FoodSchema)