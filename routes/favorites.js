const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const jwt = require('jsonwebtoken')

const Favorites = require('../models/Favorites')
const User = require('../models/User')

router.get('/getFavorites', verifyToken, async (req, res) => {
    try {
        var favoriteLists = await Favorites.find({ user: req.userId })
        res.json({ success: true, favoriteLists })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Wrong categoryId' })
    }
})

router.post('/createFavorites', verifyToken, async (req, res) => {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], 'lkj1vxcdsf9-wefgwe8eto');
    try {
        const favorite = await Favorites.findOne({ userId: decoded.userId })

        if (favorite)
            return res.status(400).json({ success: false, message: 'Already name' });

        const newFavorite = new Favorites({
            userId: req.userId
        })

        await newFavorite.save();

        res.json({ success: true, message: 'Happy learning!', favorites: newFavorite })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

router.delete('/deleteFavorites/:id', verifyToken, async (req, res) => {
    try {
        const favoritesDeleteCondition = { _id: req.params.id, user: req.userId }
        const deletedfavorites = await Favorites.findOneAndDelete(favoritesDeleteCondition)

        // User not authorised or post not found
        if (!deletedfavorites)
            return res.status(401).json({
                success: false,
                message: 'Favorite not found or user not authorised'
            })

        res.json({ success: true, favorites: deletedfavorites })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router