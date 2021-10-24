const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Food = require('../models/Food')
const Category = require('../models/Category')
const User = require('../models/User')
const Order = require('../models/Order')

const decodeToken = require('../services/service')

router.get('/getFoodsList', verifyToken, async (req, res) => {
    const categoryId = req.query.category;
    const condition = categoryId ? { categoryId: { $eq: categoryId } } : {};

    try {
        var foodLists = await Food.find(condition)
        res.json({ success: true, foodLists })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Wrong categoryId' })
    }
})

router.post('/addFoodIntoCategory/:categoryId', verifyToken, async (req, res) => {
    const { url, weight, price, name, nation, status, description } = req.body;
    const { categoryId } = req.params;
    const decoded = decodeToken(req)

    if (decoded.role === "Admin") {

        if (!name || !url || !weight || !price || !nation || !status)
            return res.status(400).json({ success: false, message: 'Fill the information' })

        try {
            const categoryCheck = await Food.findOne({ "categoryId": categoryId, "name": name, "url": url })
            console.log(categoryCheck)
            if (categoryCheck)
                return res.status(400).json({ success: false, message: 'Category name / url already exists' })

            const category = await Category.findOne({ _id: categoryId })
            const newFood = new Food({
                url,
                weight,
                price,
                name,
                nation,
                status,
                description,
                categoryId: categoryId
            })

            // const category = await Category.findById(categoryId)

            category.categoryData.push(newFood);

            await category.save();

            await newFood.save();

            res.json({ success: true, message: 'Thêm food vào category thành công', newFood })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Chưa có category' })
        }
    }
    else
        return res.status(400).json({ success: false, message: `You don't have permission` })
})

router.post('/addFoodIntoFavorite/:foodId', verifyToken, async (req, res) => {
    const decoded = decodeToken(req)

    try {
        const userCheck = await User.findOne({ _id: decoded.userId })
        const foodCheck = await Food.findById(req.params.foodId)

        //Check xem user có favorite đó chưa ko bị trùng favorite
        const check = await User.findOne({ _id: decoded.userId, favoritesData: { $elemMatch: { _id: req.params.foodId } } })

        console.log(check)

        if (check)
            return res.json({ success: false, message: 'Food has been liked already' })

        userCheck.favoritesData.push(foodCheck);

        await userCheck.save();

        res.json({ success: true, message: 'Thêm thành công', foodCheck })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Favorite data hasnt created yet' })
    }
})

router.delete('/deleteFoodFromFavorite/:id', verifyToken, async (req, res) => {
    const decoded = decodeToken(req)

    try {
        const userCheck = await User.findOne({ _id: decoded.userId })
        const favoriteCheck = await User.findOne({ _id: decoded.userId }).updateOne({}, { $pull: { favoritesData: { _id: req.params.id } } })

        console.log(favoriteCheck)

        res.json({ success: true, message: 'Deleted successfully' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Favorite data hasnt created yet' })
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    const decoded = decodeToken(req)
    if (decoded.role === "Admin") {
        try {
            const foodDeleteCondition = { _id: req.params.id }
            const category = await Food.find({ _id: req.params.id })
            var cateId = category[0].categoryId;
            const foodInCategory = await Category.find({ _id: cateId }).updateOne({}, { $pull: { categoryData: { _id: req.params.id } } })
            console.log('Check delete in category', foodInCategory)

            const deletedFood = await Food.findOneAndDelete(foodDeleteCondition)

            // User not authorised or post not found
            if (!deletedFood)
                return res.status(400).json({
                    success: false,
                    message: 'Food not found or user not authorised'
                })

            res.json({ success: true, food: deletedFood })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Không tìm thấy food' })
        }
    }
    else
        return res.status(400).json({ success: false, message: `You don't have permission` })
})

module.exports = router