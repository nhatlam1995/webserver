const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')

const User = require('../models/User')
const decodeToken = require('../services/service')

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get('/', verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.userId).select('-password -role')
		if (!user)
			return res.status(400).json({ success: false, message: 'User not found' })
		res.json({ success: true, user })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
	const { fullname, email, phonenumber, password, role } = req.body

	// Simple validation
	if (!fullname)
		return res
			.status(400)
			.json({ success: false, message: 'Missing fullname field' })

	else if (!email)
		return res
			.status(400)
			.json({ success: false, message: 'Missing email field' })

	else if (!phonenumber)
		return res
			.status(400)
			.json({ success: false, message: 'Missing phonenumber field' })

	else if (!password)
		return res
			.status(400)
			.json({ success: false, message: 'Missing password' })

	try {
		// Check for existing user
		const userMail = await User.findOne({ email })
		const userPhone = await User.findOne({ phonenumber })

		if (userMail)
			return res
				.status(400)
				.json({ success: false, message: 'Email already taken' })

		if (userPhone)
			return res
				.status(400)
				.json({ success: false, message: 'Phone number already taken' })

		// All good
		const hashedPassword = await argon2.hash(password)
		const newUser = new User({ fullname, email, phonenumber, password: hashedPassword, role })
		console.log(newUser)
		await newUser.save()

		// Return token
		const accessToken = jwt.sign(
			{ userId: newUser._id, email: newUser.email, role: newUser.role },
			process.env.ACCESS_TOKEN_SECRET
		)

		res.json({
			success: true,
			message: 'User created successfully',
			data: { token: accessToken }
		})

	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post('/login', async (req, res) => {
	const { email, password } = req.body

	// Simple validation
	if (!email || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Missing email and/or password' })

	try {
		// Check for existing user
		const user = await User.findOne({ email })
		if (!user)
			return res
				.status(400)
				.json({ success: false, message: 'Incorrect username or password' })

		// Username found
		const passwordValid = await argon2.verify(user.password, password)
		if (!passwordValid)
			return res
				.status(400)
				.json({ success: false, message: 'Incorrect username or password' })

		// All good
		// Return token
		const accessToken = jwt.sign(
			{ userId: user._id, username: user.email, role: user.role },
			process.env.ACCESS_TOKEN_SECRET
		)

		res.json({
			success: true,
			message: 'User logged in successfully',
			data: { userId: user._id, usermail: user.email, token: accessToken }
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: error })
	}
})

// @route POST api/auth/
// @desc Edit
// @access Public
router.put('/edit/', verifyToken, async (req, res) => {
	const { fullname, phonenumber } = req.body
	const decoded = decodeToken(req)

	try {
		if (!fullname || !phonenumber) {
			res.status(500).json({ success: false, message: "Please fill information" })
		}

		const user = await User.findByIdAndUpdate({ _id: decoded.userId }, { fullname: fullname, phonenumber: phonenumber })

		user.save();

		const newUser = await User.findById({ _id: decoded.userId }).select('-password -role')

		res.status(200).json({ success: true, message: 'Edited successfully', data: newUser })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: error })
	}
})

module.exports = router