const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Food = require('./Food').schema

const FavoriteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    favoritesData: [Food, {
        isFavorite: true
    }]
})

module.exports = mongoose.model('favorites', FavoriteSchema)