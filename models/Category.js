const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Food = require('./Food').schema

const CategorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true
    },
    categoryData: [Food]
})

module.exports = mongoose.model('categories', CategorySchema)