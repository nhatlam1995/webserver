const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const decodeToken = require('../services/service')

const User = require('../models/User')

router.get('/getFavorites', verifyToken, async (req, res) => {
    const decode = decodeToken(req)
    try {
        var userCheckFavorite = await User.findOne({ _id: decode.userId }).select('favoritesData')

        if (userCheckFavorite === [] || userCheckFavorite === null) return res.json({ success: true, message: "Empty data" })
        else res.json({ success: true, userCheckFavorite })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Wrong categoryId' })
    }
})

// router.delete('/deleteFavorites/:id', verifyToken, async (req, res) => {
//     try {
//         const favoritesDeleteCondition = { _id: req.params.id, user: req.userId }
//         const deletedfavorites = await User.findOne({_id: decode.userId})

//         // User not authorised or post not found
//         if (!deletedfavorites)
//             return res.status(401).json({
//                 success: false,
//                 message: 'Favorite not found or user not authorised'
//             })

//         res.json({ success: true, favorites: deletedfavorites })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ success: false, message: 'Internal server error' })
//     }
// })

module.exports = router