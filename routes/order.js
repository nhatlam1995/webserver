const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const decodeToken = require('../services/service')

const User = require('../models/User')
const Order = require('../models/Order')

router.get('/', verifyToken, async (req, res) => {
    const decoded = decodeToken(req)
    try {
        const history = await Order.find({ userId: decoded.userId })
        res.json({ success: true, history })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

router.post('/createOrders', verifyToken, async (req, res) => {
    const { total, orderData } = req.body;
    const decoded = decodeToken(req)
    if (!orderData || !total)
        return res.status(400).json({ success: false, message: "No order data" })

    try {
        const order = await Order.find({ userId: decoded.userId })
        console.log(order)
        if (!order)
            return res.status(400).json({ success: false, message: 'Check userId' })

        const newOrders = new Order({
            total,
            orderData,
            userId: req.userId,
        })

        await newOrders.save();

        res.json({ success: true, message: 'Success', orderData })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

router.delete('/deleteOrdersByUserId/:id', verifyToken, async (req, res) => {
    try {
        const orderDeleteCondition = { _id: req.params.id, userId: req.userId }
        const deletedOrder = await Order.findOneAndDelete(orderDeleteCondition)

        // User not authorised or post not found
        if (!deletedOrder)
            return res.status(401).json({
                success: false,
                message: 'Order not found or user not authorised'
            })

        res.json({ success: true, favorites: deletedOrder })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router