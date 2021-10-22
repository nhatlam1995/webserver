const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Category = require('../models/Category')
const Food = require('../models/Food')

const decodeToken = require('../services/service')

router.get('/', verifyToken, async (req, res) => {
    try {
        const categoryLists = await Category.find()
        res.json({ success: true, categoryLists })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

router.post('/', verifyToken, async (req, res) => {
    const decoded = decodeToken(req)
    const { categoryName } = req.body

    if (decoded.role === "Admin") {
        const category = await Category.findOne({ categoryName })
        if (category) return res.status(400).json({ success: false, message: 'categoryName đã tồn tại' })

        if (!categoryName)
            return res
                .status(400)
                .json({ success: false, message: 'Category name is required' })

        try {
            const newCategory = new Category({
                categoryName: categoryName
            })

            await newCategory.save()

            res.json({ success: true, message: `Category ${categoryName} was created successfully`, category: newCategory })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
    else
        return res.status(400).json({ success: false, message: `You don't have permission` })
})

router.delete('/:id', verifyToken, async (req, res) => {
    const decoded = decodeToken(req)
    
    if (decoded.role === "Admin") {
        try {
            const categoryDeleteCondition = { _id: req.params.id }
            //DeleteFood in category
            const foodInCategory = await Food.find({ categoryId: req.params.id }).select('categoryData').deleteMany()
            console.log(foodInCategory)
            //Delete category
            const deletedCategory = await Category.findOneAndDelete(categoryDeleteCondition)

            // User not authorised or post not found
            if (!deletedCategory)
                return res.status(401).json({
                    success: false,
                    message: 'Post not found or user not authorised'
                })
            res.json({ success: true, category: deletedCategory })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
    else
        return res.status(400).json({ success: false, message: `You don't have permission` })
})

module.exports = router