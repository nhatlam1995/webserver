const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Order = require('../models/Order').schema
const Food = require('../models/Food').schema

const UserSchema = new Schema({
	role: {
		type: String,
		enum: ['Admin', 'User'],
		required: true,
	},
	fullname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phonenumber: {
		type: String,
	},
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	memberPoints: {
		type: Number,
		default: 0
	},
	orderData: [
		Order
	],
	favoritesData: [
		Food, {
			isFavorite: true
		}]
})

module.exports = mongoose.model('users', UserSchema)