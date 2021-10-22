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
        const history = await User.find({ _id: decoded.userId }).select('orderData')
        res.json({ success: true, history })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

router.post('/createOrders', verifyToken, async (req, res) => {
    const { total, orderDetail, createdAt, points } = req.body;

    const decoded = decodeToken(req)
    if (!orderDetail || !total)
        return res.status(400).json({ success: false, message: "No order data" })

    try {
        const userCheck = await User.findOne({ _id: decoded.userId })
        console.log(userCheck)
        if (!userCheck)
            return res.status(400).json({ success: false, message: 'Check userId' })

        const point = await User.findOneAndUpdate({ _id: decoded.userId }, { $inc: { memberPoints: points } })

        console.log(point)

        const newOrders = new Order({
            total,
            createdAt,
            orderDetail,
            points
        })

        userCheck.orderData.push(newOrders);

        await userCheck.save();

        res.json({ success: true, message: 'Success', userCheck })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// router.delete('/deleteOrdersByUserId/:id', verifyToken, async (req, res) => {
//     try {
//         const orderDeleteCondition = { _id: req.params.id, userId: req.userId }
//         const deletedOrder = await Order.findOneAndDelete(orderDeleteCondition)

//         // User not authorised or post not found
//         if (!deletedOrder)
//             return res.status(401).json({
//                 success: false,
//                 message: 'Order not found or user not authorised'
//             })

//         res.json({ success: true, favorites: deletedOrder })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ success: false, message: 'Internal server error' })
//     }
// })

module.exports = router